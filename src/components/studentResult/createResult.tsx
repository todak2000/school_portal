/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ResultService, Term } from "@/firebase/results";
import {
  sampleClasses,
  sampleSubjects,
  sessionsArr,
} from "@/constants/schools";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Alert from "../alert";
import LoaderSpin from "../loader/LoaderSpin";
import { setModal } from "@/store/slices/modal";
import { getOngoingSession } from "@/helpers/ongoingSession";
import { saveAs } from "file-saver";

interface FormData {
  classLevel: string;
  subject: string;
  term: number;
  session: string;
}

interface FormField {
  label: string;
  name: keyof FormData;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export const CreateResult = ({ schoolId }: { schoolId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const current = getOngoingSession(sessionsArr);

  const formFields: FormField[] = [
    {
      label: "Class",
      name: "classLevel",
      options: sampleClasses.map((cls) => ({
        value: cls.classId,
        label: cls.classId,
      })),
    },
    {
      label: "Subject",
      name: "subject",
      options: sampleSubjects.map((subj) => ({
        value: subj.subjectId,
        label: subj.name,
      })),
    },
  ];

  const scoreTypes = [
    { name: "ca1", max: 30, label: "CA1 (30)" },
    { name: "ca2", max: 30, label: "CA2 (30)" },
    { name: "exam", max: 40, label: "Exam (40)" },
  ] as const;

  const initialState = {
    formData: {
      classLevel: "",
      subject: "",
      term: current?.ongoingTerm as Term,
      session: current?.session as string,
    },
    students: [] as Record<string, any>[],
    scores: {} as Record<string, { ca1: number; ca2: number; exam: number }>,
    showTable: false,
    loader: false,
    csvError: "",
    alert: { message: "", type: "error" as "error" | "success" | "warning" },
  };

  const [state, setState] = useState(initialState);
  const { formData, students, scores, showTable, loader, alert } = state;

  // useEffect(() => {
  //   if (alert.message) {
  //     const timer = setTimeout(() => {
  //       setState((prev) => ({
  //         ...prev,
  //         alert: { message: "", type: "error" },
  //       }));
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [alert.message]);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const fetchStudents = async () => {
    const classStudents = await ResultService.getClassStudents(
      formData.classLevel,
      schoolId
    );

    const initialScores = classStudents.reduce(
      (acc, student) => ({
        ...acc,
        [student.id]: { ca1: 0, ca2: 0, exam: 0 },
      }),
      {}
    );

    updateState({
      students: classStudents,
      scores: initialScores,
      showTable: true,
      loader: false,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateState({ loader: true });

    const isFormValid = Object.values(formData).every(Boolean);
    if (!isFormValid) {
      updateState({
        loader: false,
        alert: { message: "Please fill all fields", type: "error" },
      });
      return;
    }

    await fetchStudents();
  };

  const handleScoreChange = (
    studentId: string,
    scoreType: "ca1" | "ca2" | "exam",
    value: number
  ) => {
    setState((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [studentId]: {
          ...prev.scores[studentId],
          [scoreType]: value,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    updateState({ loader: true });

    // Define max scores for validation
    const maxScores = {
      ca1: 30,
      ca2: 30,
      exam: 40,
    };

    // Validate scores
    const invalidScores = students.filter((student) => {
      const studentScores = scores[student.id];
      return (
        studentScores.ca1 > maxScores.ca1 ||
        studentScores.ca2 > maxScores.ca2 ||
        studentScores.exam > maxScores.exam
      );
    });

    if (invalidScores.length > 0) {
      // Flag the invalid scores and prevent submission
      updateState({
        loader: false,
        alert: {
          message: `Scores exceed maximum limits for students: ${invalidScores
            .map((s) => s.fullname)
            .join(", ")}`,
          type: "error",
        },
      });
      return;
    }

    try {
      const res = await Promise.all(
        students.map((student) =>
          ResultService.recordSubjectResult({
            studentId: student.id,
            assignedStudentId: student.studentId,
            subject: formData.subject,
            classLevel: formData.classLevel,
            term: formData.term as Term,
            name: student.fullname,
            schoolId,
            session: formData.session,
            scores: {
              ...scores[student.id],
              total: 0,
              grade: "",
              remarks: "",
            },
            recordedBy: user?.id,
          })
        )
      );
      updateState({
        loader: false,
        alert: {
          message:
            res[0].status === 200
              ? "Results recorded successfully!"
              : res[0].message,
          type: res[0].status === 200 ? "success" : "error",
        },
        showTable: false,
        formData: initialState.formData,
      });

      res[0].status === 200 &&
        setTimeout(() => {
          dispatch(setModal({ open: false, type: "" }));
        }, 4000);
    } catch (error) {
      console.error("Error recording results:", error);
      updateState({
        loader: false,
        alert: {
          message: "Error recording results. Please try again!",
          type: "error",
        },
      });
    }
  };

  const convertToCSV = (students: any[], scores: any) => {
    const headers = [
      "Student ID",
      "Student Name",
      "School",
      "Class",
      "CA1 (30)",
      "CA2 (30)",
      "Exam (40)",
    ];
    const rows = students.map((student) => {
      const studentScores = scores[student.id] || {
        ca1: "",
        ca2: "",
        exam: "",
      };
      return [
        student.studentId,
        student.fullname,
        student.schoolId,
        student.classId,
        studentScores.ca1,
        studentScores.ca2,
        studentScores.exam,
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  };

  const parseCSV = (csvText: string, existingStudents: any[]) => {
    const lines = csvText.split("\n");
    const [header, ...rows] = lines;
    const studentsMap = new Map(
      existingStudents.map((s: any) => [s.studentId, s])
    );

    return rows.reduce(
      (acc: { scores: any; errors: string[] }, row, index) => {
        const [studentId, _, __, ___, ca1, ca2, exam] = row
          .split(",")
          .map((f) => f.trim());

        if (!studentId) return acc;

        const student = studentsMap.get(studentId);
        if (!student) {
          acc.errors.push(
            `Row ${index + 1}: Student ID ${studentId} not found`
          );
          return acc;
        }

        const scores = {
          ca1: Math.min(30, Math.max(0, Number(ca1) || 0)),
          ca2: Math.min(30, Math.max(0, Number(ca2) || 0)),
          exam: Math.min(40, Math.max(0, Number(exam) || 0)),
        };

        acc.scores[student.id] = scores;
        return acc;
      },
      { scores: {}, errors: [] }
    );
  };

  const handleDownloadCSV = () => {
    const csv = convertToCSV(students, scores);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(
      blob,
      `results_template_${formData.classLevel}_${formData.subject}.csv`
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvText = e.target?.result as string;
      const { scores: newScores, errors } = parseCSV(csvText, students);

      if (errors.length > 0) {
        updateState({
          alert: {
            message: `CSV errors: ${errors.join(", ")}`,
            type: "error",
          },
        });
        return;
      }

      updateState({
        scores: { ...state.scores, ...newScores },
        alert: { message: "CSV data imported successfully!", type: "success" },
      });
    };

    reader.readAsText(file);
  };

  const renderFormField = ({ label, name, options }: FormField) => (
    <div className="form-control w-full" key={name}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered w-full bg-white text-secondary"
        value={formData[name]}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            formData: { ...prev.formData, [name]: e.target.value },
          }))
        }
      >
        <option value="">Select {label}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderStudentScores = (student: Record<string, any>) =>
    scoreTypes.map(({ name, max }) => (
      <td key={name}>
        <input
          type="number"
          min="0"
          max={max}
          className="input input-bordered w-20 bg-orange-100 border-none font-bold text-xl text-secondary text-center rounded-none n-spinner"
          value={scores[student.id]?.[name] ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            handleScoreChange(student.id, name, value as any);
          }}
        />
      </td>
    ));

  const subject = formData.subject
    ? sampleSubjects.find((i) => i.subjectId === formData.subject)?.name
    : "";

  return (
    <div className="card bg-white shadow-xl w-full max-w-4xl mx-auto">
      <div className="card-body font-geistMono">
        <h2 className="card-title text-2xl mb-6 text-secondary">
          Record Results
        </h2>
        
        {alert.message && <Alert message={alert.message} type={alert.type} />}

        {!showTable ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map(renderFormField)}
            </div>

            <div className="card-actions justify-end mt-6">
              <button
                type="submit"
                disabled={loader}
                className="btn bg-primary text-white border-none rounded-none"
              >
                {loader ? <LoaderSpin /> : "Proceed"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="md:w-max md:absolute top-10 right-10">
            
              {[
                { label: "Subject", value: subject },
                { label: "Class", value: formData.classLevel },
                { label: "Session", value: formData.session },
                { label: "Term", value: formData.term },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-row items-center text-xs gap-3 justify-start"
                >
                  <p className="text-orange-300">{label}:</p>
                  <p className="text-right font-semibold text-primary">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto mt-10">
              <table className="table w-full table-zebra">
                <thead>
                  <tr className="text-orange-300">
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>School</th>
                    <th>Class</th>
                    {scoreTypes.map(({ label }) => (
                      <th key={label}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="text-xs text-secondary">
                      <td>{student.studentId}</td>
                      <td>{student.fullname}</td>
                      <td>{student.schoolId}</td>
                      <td>{student.classId}</td>
                      {renderStudentScores(student)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-actions justify-end mt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline border-primary text-primary rounded-none"
                  onClick={handleDownloadCSV}
                >
                  Download CSV Template
                </button>
                <label className="btn btn-outline border-primary text-primary rounded-none cursor-pointer">
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => updateState({ showTable: false })}
                >
                  Back
                </button>
                <button
                  className="btn bg-primary text-white rounded-none border-none"
                  onClick={handleSubmit}
                  disabled={loader}
                >
                  {loader ? <LoaderSpin /> : "Record Results"}
                </button>
              </div>
              <div className="w-full my-5 mx-auto">
            <Alert message="Please make sure to thoroughly review, verify, and validate the results before submission. Once submitted, modifications, edits, or updates will not be possible" type="warning" />
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

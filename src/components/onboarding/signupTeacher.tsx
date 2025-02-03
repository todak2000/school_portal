/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { sampleClasses, sampleSubjects, schoolsArr } from "@/constants/schools";
import { InputField } from "../inputs/text";
import { teacherFormData, teacherFormFields } from "@/constants/form";
import { SelectField } from "../inputs/select";
import { Checkbox } from "../inputs/checkbox";
import { validateTeacherField, validateTeacherForm } from "@/helpers/validator";
import LoaderSpin from "../loader/LoaderSpin";
import Alert from "../alert";
import { userSignup } from "@/firebase/onboarding";
import { setModal } from "@/store/slices/modal";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { StringOrNumber } from "./signup";
import { ROLE } from "@/constants";

export interface School {
  name: string;
  lga: string;
  code: string;
  description: string;
  avatar: string | null;
}

export interface TeacherFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullname: string;
  isAdmin: boolean;
  isDeactivated: boolean;
  isSuperAdmin: boolean;
  role: "teacher" | "admin" | "student";
  school: string;
  subjectsTaught: string[];
  classesTaught: string[];
  teacherId: string;
}

export interface FormErrors {
  [key: string]: string;
}

const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

const SignUpTeacher = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  }>({ message: "", type: "error" });
  const [formData, setFormData] = useState<TeacherFormData>(() => ({
    ...teacherFormData,
    role: ROLE.teacher as "teacher" | "admin" | "student",
    subjectsTaught: [] as string[],
    classesTaught: [] as string[],
  }));
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});

  // Visibility state for password fields
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const storage = getLocalStorage();
  if (storage) {
    // Use localStorage here
  }

  // Handle input changes with validation
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "subjectsOffered") {
      return;
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      validateTeacherField(
        name as keyof TeacherFormData,
        value,
        setErrors,
        formData
      );
    }
  };

  // Handle Subjects Offered Change
  const handleSubjectChange = (value: string, checked: boolean) => {
    let updatedSubjects = [...formData.subjectsTaught];
    if (checked) {
      updatedSubjects.push(value);
    } else {
      updatedSubjects = updatedSubjects.filter((subject) => subject !== value);
    }
    setFormData((prev) => ({
      ...prev,
      subjectsTaught: updatedSubjects,
    }));
    validateTeacherField(
      "subjectsTaught",
      updatedSubjects,
      setErrors,
      formData
    );
  };

  // Handle Classes Offered Change
  const handleClassChange = (value: string, checked: boolean) => {
    let updatedClasses = [...formData.classesTaught];
    if (checked) {
      updatedClasses.push(value);
    } else {
      updatedClasses = updatedClasses.filter((subject) => subject !== value);
    }
    setFormData((prev) => ({
      ...prev,
      classesTaught: updatedClasses,
    }));
    validateTeacherField("classesTaught", updatedClasses, setErrors, formData);
  };

  // Remove subject from badges
  const removeSubject = (subject: string) => {
    const updatedSubjects = formData.subjectsTaught.filter(
      (s) => s !== subject
    );
    setFormData((prev) => ({
      ...prev,
      subjectsTaught: updatedSubjects,
    }));
    validateTeacherField(
      "subjectsTaught",
      updatedSubjects,
      setErrors,
      formData
    );
  };

  // Remove Classes from badges
  const removeClasses = (classs: string) => {
    const updatedClasses = formData.classesTaught.filter((s) => s !== classs);
    setFormData((prev) => ({
      ...prev,
      classesTaught: updatedClasses,
    }));
    validateTeacherField("classesTaught", updatedClasses, setErrors, formData);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const isValid = validateTeacherForm(setErrors, formData);
    if (!isValid) {
      console.log("Validation failed:", errors);
      setAlert({
        message:
          "Incomplete or incorrect information detected. Please fill out all fields properly.",
        type: "error",
      });
      setLoading(false);
      return; // Exit early if validation fails
    }

    try {
      const res = await userSignup(formData);
      setAlert({
        message: res.message,
        type: res.status === 200 ? "success" : "error",
      });

      if (res.status === 200) {
        setTimeout(() => {
          push("/");
          dispatch(setModal({ open: true, type: "login" }));
        }, 3000);
      }
    } catch (error: any) {
      console.log("Sign in error:", error);
      setAlert({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    if (alert.message !== "") {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-gradient-to-r via-secondary from-secondary to-green-500 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6 font-geistMono">
              Teacher Registration Form
            </h2>

            <form className="space-y-6">
              {/* Map through formFields to render inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherFormFields
                  .slice(0, 4)
                  .map((field) =>
                    field.type === "input" ? (
                      <InputField
                        key={field.name}
                        label={field.label}
                        type={field.inputType as string}
                        name={field.name}
                        value={
                          Array.isArray(formData[field.name])
                            ? (formData[field.name] as string[]).join(", ")
                            : (formData[field.name] as StringOrNumber)
                        }
                        onChange={handleChange}
                        required={field.required}
                        error={errors[field.name]}
                        disabled={field.disabled}
                        toggleVisibility={field.toggleVisibility}
                        showPassword={
                          field.name === "password"
                            ? showPassword
                            : showConfirmPassword
                        }
                        onToggleVisibility={
                          field.name === "password"
                            ? () => setShowPassword(!showPassword)
                            : field.name === "confirmPassword"
                            ? () => setShowConfirmPassword(!showConfirmPassword)
                            : undefined
                        }
                      />
                    ) : null
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherFormFields.slice(4, 12).map((field) =>
                  field.type === "input" ? (
                    <InputField
                      key={field.name}
                      label={field.label}
                      type={field.inputType ?? "text"}
                      name={field.name}
                      value={
                        Array.isArray(formData[field.name])
                          ? (formData[field.name] as string[]).join(", ")
                          : (formData[field.name] as StringOrNumber)
                      }
                      onChange={handleChange}
                      required={field.required}
                      error={errors[field.name]}
                      disabled={field.disabled}
                    />
                  ) : field.type === "select" ? (
                    <SelectField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      options={
                        field.name === "school"
                          ? schoolsArr.length > 0
                            ? schoolsArr.map((school) => ({
                                label: school.name,
                                value: school.code,
                              }))
                            : [
                                {
                                  label: "There are no schools in this L.G.A",
                                  value: "",
                                },
                              ]
                          : field.options || []
                      }
                      value={
                        typeof formData[field.name] === "number"
                          ? String(formData[field.name])
                          : (formData[field.name] as
                              | "string"
                              | "number"
                              | string[])
                      }
                      onChange={handleChange}
                      required={field.required}
                      multiple={false}
                      error={errors[field.name]}
                    />
                  ) : null
                )}
              </div>

              {/* Subjects Offered as Checkboxes */}
              <div className="form-control">
                <label className="label" htmlFor="subjectsTaught">
                  <span className="label-text font-geistMono">
                    Subjects Taught*
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sampleSubjects.map((subject) => (
                    <Checkbox
                      disabled={false}
                      key={subject.subjectId}
                      label={subject.name}
                      value={subject.subjectId}
                      checked={formData.subjectsTaught.includes(
                        subject.subjectId
                      )}
                      onChange={handleSubjectChange}
                    />
                  ))}
                </div>
                {errors.subjectsTaught && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subjectsTaught}
                  </p>
                )}
                {/* Display selected subjects as badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subjectsTaught.map((subjectId) => {
                    const subject = sampleSubjects.find(
                      (subj) => subj.subjectId === subjectId
                    );
                    return (
                      subject && (
                        <span
                          key={subjectId}
                          className="badge bg-white text-gray-500 texxt-xs py-4 px-3 flex items-center space-x-1"
                        >
                          <span>{subject.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSubject(subjectId)}
                            className="ml-1 text-primary"
                          >
                            ×
                          </button>
                        </span>
                      )
                    );
                  })}
                </div>
              </div>

              {/* Classes Taugh as Checkboxes */}
              <div className="form-control">
                <label className="label" htmlFor="classesTaught">
                  <span className="label-text font-geistMono">
                    Classes Taught*
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sampleClasses.map((c) => (
                    <Checkbox
                      disabled={false}
                      key={c.classId}
                      label={c.name}
                      value={c.classId}
                      checked={formData.classesTaught.includes(c.classId)}
                      onChange={handleClassChange}
                    />
                  ))}
                </div>
                {errors.classesTaught && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.classesTaught}
                  </p>
                )}
                {/* Display selected subjects as badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.classesTaught.map((cId) => {
                    const subject = sampleClasses.find(
                      (subj) => subj.classId === cId
                    );
                    return (
                      subject && (
                        <span
                          key={cId}
                          className="badge bg-white text-gray-500 texxt-xs py-4 px-3 flex items-center space-x-1"
                        >
                          <span>{subject.name}</span>
                          <button
                            type="button"
                            onClick={() => removeClasses(cId)}
                            className="ml-1 text-primary"
                          >
                            ×
                          </button>
                        </span>
                      )
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="btn bg-primary border-none text-white btn-block"
                >
                  {loading ? <LoaderSpin /> : "Register Student"}
                </button>
              </div>
            </form>
            {alert.message && (
              <Alert
                message={alert.message}
                type={alert.type as "error" | "success" | "warning"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignUpTeacher };

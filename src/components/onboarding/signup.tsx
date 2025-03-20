/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  sampleSeniorSubjects,
  sampleSubjects,
  schoolsArr,
  Subject,
} from "@/constants/schools";
import { InputField } from "../inputs/text";
import { formDataa, formFields } from "@/constants/form";
import { SelectField } from "../inputs/select";
import { Checkbox } from "../inputs/checkbox";
import { validateField, validateForm } from "@/helpers/validator";
import LoaderSpin from "../loader/LoaderSpin";
import Alert from "../alert";
import { userSignup } from "@/firebase/onboarding";
import { setModal } from "@/store/slices/modal";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ROLE } from "@/constants";

// Types moved to separate file for cleaner organization
export type StringOrNumber = "string" | "number" | string[];
export interface School {
  name: string;
  lga: string;
  code: string;
  description: string;
  avatar: string | null;
}

export interface StudentFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  guardian: string;
  gender: "M" | "F";
  dateOfBirth: string;
  address: string;
  class: string;
  lga: string;
  school: string;
  subjectsOffered: string[];
  passportUrl: string | Blob;
  birthCertificateUrl: string | Blob;
  phone: string;
  role: "student";
}

export interface FormErrors {
  [key: string]: string;
}

// Separated alert management into a custom hook
const useAlert = () => {
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  }>({ message: "", type: "error" });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return { alert, setAlert };
};

// Separated form field rendering logic
const FormFields = ({
  formData,
  handleChange,
  errors,
  availableSchools,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
}: any) => {
  const renderInputField = (field: any) => (
    <InputField
      key={field.name}
      label={field.label}
      type={field.inputType ?? "text"}
      name={field.name}
      value={
        Array.isArray(formData[field.name])
          ? formData[field.name].join(", ")
          : formData[field.name]
      }
      onChange={handleChange}
      required={field.required}
      error={errors[field.name]}
      disabled={field.disabled}
      toggleVisibility={field.toggleVisibility}
      showPassword={
        field.name === "password" ? showPassword : showConfirmPassword
      }
      onToggleVisibility={
        field.name === "password"
          ? () => setShowPassword(!showPassword)
          : field.name === "confirmPassword"
          ? () => setShowConfirmPassword(!showConfirmPassword)
          : undefined
      }
    />
  );

  const renderSelectField = (field: any) => (
    <SelectField
      key={field.name}
      label={field.label}
      name={field.name}
      options={
        field.name === "school"
          ? getSchoolOptions(availableSchools)
          : field.options || []
      }
      value={
        typeof formData[field.name] === "number"
          ? String(formData[field.name])
          : formData[field.name]
      }
      onChange={handleChange}
      required={field.required}
      multiple={false}
      disabled={
        field.name === "school" && formData["lga"] !== ""
          ? false
          : field.disabled
      }
      error={errors[field.name]}
    />
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields
          .slice(0, 4)
          .map((field) => field.type === "input" && renderInputField(field))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields
          .slice(4, 12)
          .map((field) =>
            field.type === "input"
              ? renderInputField(field)
              : field.type === "select" && renderSelectField(field)
          )}
      </div>
    </>
  );
};

// Separated subjects handling logic
const SubjectsSection = ({
  formData,
  subjectss,
  errors,
  handleSubjectChange,
  removeSubject,
}: any) => (
  <div className="form-control">
    <label className="label" htmlFor="subjectsOffered">
      <span className="label-text font-geistMono">Subjects Offered* (Kindly select all subjects offered)</span>
    </label>
    {/* <div className="flex flex-wrap gap-2 mb-2"> */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
      {subjectss.map((subject: { subjectId: React.Key | null | undefined; name: string; }) => (
        <Checkbox
          key={subject.subjectId}
          label={subject.name}
          value={subject.subjectId as string}
          checked={formData.subjectsOffered.includes(subject.subjectId)}
          onChange={handleSubjectChange}
          disabled={false}
        />
      ))}
    </div>
    {errors.subjectsOffered && (
      <p className="text-red-500 text-sm mt-1">{errors.subjectsOffered}</p>
    )}
    <div className="flex flex-wrap gap-2 mt-2">
      {formData.subjectsOffered.map((subjectId: string) => {
        const subject = subjectss.find(
          (subj: { subjectId: string; }) => subj.subjectId === subjectId
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
);

const getSchoolOptions = (schools: School[]) => {
  return schools.length > 0
    ? schools.map((school) => ({
        label: school.name,
        value: school.code,
      }))
    : [{ label: "There are no schools in this L.G.A", value: "" }];
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const { alert, setAlert } = useAlert();
  const [formData, setFormData] = useState<StudentFormData>(() => ({
    ...formDataa,
    gender: formDataa.gender as "M" | "F",
    role: ROLE.student as "student",
  }));
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [availableSchools, setAvailableSchools] =
    useState<School[]>(schoolsArr);
  const [subjectss, setSubjectss] = useState<Subject[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    formData.class.startsWith("JSS")
      ? setSubjectss(sampleSubjects)
      : formData.class.startsWith("SSS")
      ? setSubjectss(sampleSeniorSubjects)
      : null;

    if (formData.lga) {
      const filteredSchools = schoolsArr.filter(
        (school) => school.lga === formData.lga
      );
      setAvailableSchools(filteredSchools);
      setFormData((prev) => ({ ...prev, school: "" }));
    } else {
      setAvailableSchools([]);
      setFormData((prev) => ({ ...prev, school: "" }));
    }
  }, [formData.lga, formData.class]);


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name !== "subjectsOffered") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name as keyof StudentFormData, value, setErrors, formData);
    }
  };

  const handleSubjectChange = (value: string, checked: boolean) => {
    const updatedSubjects = checked
      ? [...formData.subjectsOffered, value]
      : formData.subjectsOffered.filter((subject) => subject !== value);

    setFormData((prev) => ({ ...prev, subjectsOffered: updatedSubjects }));
    validateField("subjectsOffered", updatedSubjects, setErrors, formData);
  };

  const removeSubject = (subject: string) => {
    const updatedSubjects = formData.subjectsOffered.filter(
      (s) => s !== subject
    );
    setFormData((prev) => ({ ...prev, subjectsOffered: updatedSubjects }));
    validateField("subjectsOffered", updatedSubjects, setErrors, formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm(setErrors, formData)) {
      setAlert({
        message:
          "Incomplete or incorrect information detected. Please fill out all fields properly.",
        type: "error",
      });
      setLoading(false);
      return;
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
      setAlert({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-gradient-to-r via-secondary from-secondary to-green-500 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6 font-geistMono">
              Student Registration Form
            </h2>

            <form className="space-y-6">
              <FormFields
                formData={formData}
                handleChange={handleChange}
                errors={errors}
                availableSchools={availableSchools}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                setShowPassword={setShowPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />

              <SubjectsSection
                formData={formData}
                subjectss={subjectss}
                errors={errors}
                handleSubjectChange={handleSubjectChange}
                removeSubject={removeSubject}
              />

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
              <Alert message={alert.message} type={alert.type} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignUp };

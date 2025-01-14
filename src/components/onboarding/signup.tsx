/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { sampleSubjects, schoolsArr } from "@/constants/schools";
import { InputField } from "../inputs/text";
import { formDataa, formFields } from "@/constants/form";
import { SelectField } from "../inputs/select";
import { FileUpload } from "../inputs/upload";
import { Checkbox } from "../inputs/checkbox";
import { validateField, validateForm } from "@/helpers/validator";
import LoaderSpin from "../loader/LoaderSpin";
import Alert from "../alert";
import { userSignup } from "@/firebase/onboarding";
import { setModal } from "@/store/slices/modal";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

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
  gender: "male" | "female";
  dateOfBirth: string;
  address: string;
  class: string;
  lga: string;
  school: string;
  subjectsOffered: string[];
  passportUrl: string | Blob;
  birthCertificateUrl: string | Blob;
  phone: string;
  role: "student" | "parent";
}

export interface FormErrors {
  [key: string]: string;
}

const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  }>({ message: "", type: "error" });
  const [formData, setFormData] = useState<StudentFormData>(() => ({
    ...formDataa,
    gender: formDataa.gender as "male" | "female",
    role: "student",
  }));
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [availableSchools, setAvailableSchools] =
    useState<School[]>(schoolsArr);
  const [errors, setErrors] = useState<FormErrors>({});
  const [birthCertificateUrl, setBirthCertificateUrl] = useState<string>("");
  const [passportUrl, setPassportUrl] = useState<string>("");

  // Visibility state for password fields
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const storage = getLocalStorage();
  if (storage) {
    // Use localStorage here
  }

  // Update available schools based on selected LGA
  useEffect(() => {
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
  }, [formData.lga]);

  // Handle file uploads
  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "passport" | "birthCertificate"
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const fakeUrl = URL.createObjectURL(file);

      // Convert the file to a Blob and resize it
      // const blob = new Blob([file], { type: file.type });
      const img = new Image();
      img.src = fakeUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width, height;

        // Set dimensions based on the type
        if (type === "passport") {
          width = 300; // Optimal passport width
          height = 300; // Optimal passport height (1:1 ratio)
        } else {
          width = 400; // Optimal birth certificate width
          height = 300; // Optimal birth certificate height (4:3 ratio)
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert canvas to WebP Blob
        canvas.toBlob((webpBlob) => {
          if (webpBlob) {
            const webpUrl = URL.createObjectURL(webpBlob);
            type === "passport"
              ? setPassportUrl(webpUrl)
              : setBirthCertificateUrl(webpUrl);
            setFormData((prev) => ({
              ...prev,
              [type === "passport" ? "passportUrl" : "birthCertificateUrl"]:
                webpBlob,
            }));

            validateField(
              type === "passport" ? "passportUrl" : "birthCertificateUrl",
              webpBlob,
              setErrors,
              formData
            );
          }
        }, "image/webp");
      };
    }
  };

  // Function to clear the preview image and related states
  const deletePreviewImage = (type: "passport" | "birthCertificate") => {
    if (type === "passport") {
      setPassportUrl("");
      setFormData((prev) => ({
        ...prev,
        passportUrl: "", // Clear the blob
      }));
    } else {
      setBirthCertificateUrl("");
      setFormData((prev) => ({
        ...prev,
        birthCertificateUrl: "", // Clear the blob
      }));
    }
  };

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
      validateField(name as keyof StudentFormData, value, setErrors, formData);
    }
  };

  // Handle Subjects Offered Change
  const handleSubjectChange = (value: string, checked: boolean) => {
    let updatedSubjects = [...formData.subjectsOffered];
    if (checked) {
      updatedSubjects.push(value);
    } else {
      updatedSubjects = updatedSubjects.filter((subject) => subject !== value);
    }
    setFormData((prev) => ({
      ...prev,
      subjectsOffered: updatedSubjects,
    }));
    validateField("subjectsOffered", updatedSubjects, setErrors, formData);
  };

  // Remove subject from badges
  const removeSubject = (subject: string) => {
    const updatedSubjects = formData.subjectsOffered.filter(
      (s) => s !== subject
    );
    setFormData((prev) => ({
      ...prev,
      subjectsOffered: updatedSubjects,
    }));
    validateField("subjectsOffered", updatedSubjects, setErrors, formData);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const isValid = validateForm(setErrors, formData);
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
        push("/");
        dispatch(setModal({ open: true, type: "login" }));
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
              Student Registration Form
            </h2>

            <form className="space-y-6">
              {/* Map through formFields to render inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields
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
                            : (formData[field.name] as
                                | "string"
                                | "number"
                                | string[])
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
                {formFields.slice(4, 12).map((field) =>
                  field.type === "input" ? (
                    <InputField
                      key={field.name}
                      label={field.label}
                      type={field.inputType || "text"}
                      name={field.name}
                      value={
                        Array.isArray(formData[field.name])
                          ? (formData[field.name] as string[]).join(", ")
                          : (formData[field.name] as
                              | "string"
                              | "number"
                              | string[])
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
                          ? availableSchools.length > 0
                            ? availableSchools.map((school) => ({
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
                      disabled={
                        field.name === "school" && formData["lga"] !== ""
                          ? false
                          : field.disabled
                      }
                      error={errors[field.name]}
                    />
                  ) : null
                )}
              </div>

              {/* Subjects Offered as Checkboxes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-geistMono">
                    Subjects Offered*
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sampleSubjects.map((subject) => (
                    <Checkbox
                      key={subject.subjectId}
                      label={subject.name}
                      value={subject.subjectId}
                      checked={formData.subjectsOffered.includes(
                        subject.subjectId
                      )}
                      onChange={handleSubjectChange}
                    />
                  ))}
                </div>
                {errors.subjectsOffered && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subjectsOffered}
                  </p>
                )}
                {/* Display selected subjects as badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subjectsOffered.map((subjectId) => {
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

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    label: "Upload Passport",
                    name: "passportUrl",
                    previewUrl: passportUrl,
                    error: errors.passportUrl,
                  },
                  {
                    label: "Upload Birth Certificate",
                    name: "birthCertificateUrl",
                    previewUrl: birthCertificateUrl,
                    error: errors.birthCertificateUrl,
                  },
                ].map(({ label, name, previewUrl, error }) => (
                  <FileUpload
                    key={name}
                    label={label}
                    deletePreviewUrl={deletePreviewImage}
                    name={name as "passportUrl" | "birthCertificateUrl"}
                    onFileChange={handleFileUpload}
                    previewUrl={previewUrl as string}
                    required
                    error={error}
                  />
                ))}
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

export { SignUp };

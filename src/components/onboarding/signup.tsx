"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import Image from "next/image";
import {
  lgas,
  sampleClasses,
  sampleSubjects,
  schoolsArr,
} from "@/constants/schools";

interface School {
  name: string;
  lga: string;
  code: string;
  description: string;
  avatar: string | null;
}

interface StudentFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  guardian: string;
  gender: "male" | "female";
  dateOfBirth: string;
  age: number;
  address: string;
  class: string;
  lga: string;
  school: string;
  subjectsOffered: string[];
  passportUrl: string;
  birthCertificateUrl: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

// Reusable Input Component
interface InputFieldProps {
  label: string;
  type: string;
  name: keyof StudentFormData;
  value: string | number | string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  toggleVisibility?: boolean;
  showPassword?: boolean;
  onToggleVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  toggleVisibility = false,
  showPassword = false,
  onToggleVisibility,
}) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    <div className="relative">
      <input
        type={toggleVisibility ? (showPassword ? "text" : "password") : type}
        name={name}
        className={`input font-geistSans text-black  w-full bg-orange-100 border-primary focus:outline-none ${
          error ? "border-red-500" : "border-green-500"
        } ${
          disabled
            ? "disabled:bg-orange-200 disabled:border-none disabled:text-black"
            : ""
        }`}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      {toggleVisibility && onToggleVisibility && (
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Select Component
interface SelectFieldProps {
  label: string;
  name: keyof StudentFormData;
  options: { label: string; value: string }[];
  value: string | number | string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  multiple?: boolean;
  error?: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  multiple = false,
  error,
  disabled = false,
}) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text font-geistMono">{label}</span>
    </label>
    <select
      name={name}
      className={`select font-geistSans text-black disabled:bg-orange-200 disabled:border-none disabled:text-black select-bordered w-full bg-orange-100 border-primary ${
        error ? "border-red-500" : "border-green-500"
      }`}
      value={value}
      onChange={onChange}
      required={required}
      multiple={multiple}
      disabled={disabled}
    >
      {!multiple && <option value="">{`Select ${label}*`}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable File Upload Component
interface FileUploadProps {
  label: string;
  name: "passportUrl" | "birthCertificateUrl";
  onFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: "passport" | "birthCertificate"
  ) => void;
  previewUrl?: string;
  required?: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  onFileChange,
  previewUrl,
  required = false,
  error,
}) => (
  <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center">
    <div className="flex flex-col items-center justify-center space-y-4">
      <Upload className="w-12 h-12 text-base-content/50" />
      <div className="text-sm">
        <p className="font-semibold font-geistMono">{label}*</p>
        <p className="text-base-content/70 font-geistMono">
          Drag & Drop your file here
        </p>
      </div>
      <label className="btn  font-geistMono bg-primary text-white border-none">
        Browse Files
        <input
          type="file"
          className="hidden"
          onChange={(e) =>
            onFileChange(
              e,
              name === "passportUrl" ? "passport" : "birthCertificate"
            )
          }
          accept={
            name === "passportUrl" ? "image/*" : "image/*,application/pdf"
          }
          required={required}
        />
      </label>
      {previewUrl && (
        <div className="w-20 h-20 relative mt-2">
          <Image
            src={previewUrl}
            alt="Passport preview"
            width={100}
            height={100}
            className="w-full h-full object-cover rounded"
          />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1 font-geistMono">{error}</p>
      )}
    </div>
  </div>
);

// Reusable Checkbox Component for Subjects Offered
interface CheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  checked,
  onChange,
}) => (
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      value={value}
      checked={checked}
      onChange={(e) => onChange(value, e.target.checked)}
      className="form-checkbox h-5 w-5 text-primary"
    />
    <span className=" text-gray-200 font-geistMono">{label}</span>
  </label>
);

// Main SignUp Component
const SignUp = () => {
  const [formData, setFormData] = useState<StudentFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    guardian: "",
    gender: "male",
    dateOfBirth: "",
    age: 0,
    address: "",
    class: "",
    lga: "",
    school: "",
    subjectsOffered: [],
    passportUrl: "",
    birthCertificateUrl: "",
    phone: "",
  });

  const [availableSchools, setAvailableSchools] = useState<School[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // Visibility state for password fields
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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

  // Calculate age based on date of birth
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Handle date of birth change
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e, "e");
    const dob = e.target.value;
    const age = calculateAge(dob);
    console.log(age, "age--");
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: dob,
      age: age >= 0 ? age : 0,
    }));
    validateField("dateOfBirth", dob);
  };

  // Handle file uploads
  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "passport" | "birthCertificate"
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      // In a real application, upload to server and get the URL
      const fakeUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        [type === "passport" ? "passportUrl" : "birthCertificateUrl"]: fakeUrl,
      }));
      validateField(
        type === "passport" ? "passportUrl" : "birthCertificateUrl",
        fakeUrl
      );
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
      validateField(name as keyof StudentFormData, value);
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
    validateField("subjectsOffered", updatedSubjects);
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
    validateField("subjectsOffered", updatedSubjects);
  };

  // Validation rules
  const validateField = <T extends keyof StudentFormData>(
    fieldName: T,
    value: StudentFormData[T]
  ) => {
    let error = "";

    switch (fieldName) {
      case "email":
        if (!value) {
          error = "Email is required.";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value === "string" && !emailRegex.test(value)) {
            error = "Please enter a valid email address.";
          }
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required.";
        } else if (typeof value === "string" && value.length < 6) {
          error = "Password must be at least 6 characters long.";
        }
        // Check confirm password match
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password.";
        } else if (value !== formData.password) {
          error = "Passwords do not match.";
        }
        break;
      case "name":
        if (!value) {
          error = "Full name is required.";
        }
        break;
      case "guardian":
        if (!value) {
          error = "Guardian name is required.";
        }
        break;
      case "dateOfBirth":
        if (!value) {
          error = "Date of birth is required.";
        }
        break;
      case "address":
        if (!value) {
          error = "Address is required.";
        }
        break;
      case "class":
        if (!value) {
          error = "Class selection is required.";
        }
        break;
      case "lga":
        if (!value) {
          error = "LGA selection is required.";
        }
        break;
      case "school":
        if (!value) {
          error = "School selection is required.";
        }
        break;
      case "subjectsOffered":
        if (!value || (Array.isArray(value) && value.length === 0)) {
          error = "At least one subject must be selected.";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone number is required.";
        } else {
          const phoneRegex = /^[0-9]{10,15}$/;
          if (!phoneRegex.test(String(value))) {
            error = "Please enter a valid phone number.";
          }
        }
        break;
      case "passportUrl":
        if (!value) {
          error = "Passport is required.";
        }
        break;
      case "birthCertificateUrl":
        if (!value) {
          error = "Birth Certificate is required.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // Validate all fields before submission
  const validateForm = (): boolean => {
    const fieldsToValidate: (keyof StudentFormData)[] = [
      "email",
      "password",
      "confirmPassword",
      "name",
      "guardian",
      "gender",
      "dateOfBirth",
      "address",
      "class",
      "lga",
      "school",
      "subjectsOffered",
      "phone",
      "passportUrl",
      "birthCertificateUrl",
    ];

    let valid = true;

    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      validateField(field, value);
      if (field === "subjectsOffered") {
        if (Array.isArray(value) && value.length === 0) {
          valid = false;
        }
      } else if (!value) {
        valid = false;
      } else if (errors[field]) {
        valid = false;
      }
    });

    return valid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Perform further actions like sending data to backend
    } else {
      console.log("Validation failed:", errors);
    }
  };
  // Define form fields configuration
  const formFields = [
    {
      type: "input",
      label: "Email*",
      inputType: "email",
      name: "email" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Password*",
      inputType: "password",
      name: "password" as keyof StudentFormData,
      required: true,
      toggleVisibility: true,
    },
    {
      type: "input",
      label: "Confirm Password*",
      inputType: "password",
      name: "confirmPassword" as keyof StudentFormData,
      required: true,
      toggleVisibility: true,
    },
    {
      type: "input",
      label: "Phone Number*",
      inputType: "tel",
      name: "phone" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Full Name*",
      inputType: "text",
      name: "name" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Guardian Name*",
      inputType: "text",
      name: "guardian" as keyof StudentFormData,
      required: true,
    },
    {
      type: "select",
      label: "Gender*",
      name: "gender" as keyof StudentFormData,
      options: [
        { label: "Select Gender*", value: "" },
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
      required: true,
    },
    {
      type: "input",
      label: "Date of Birth*",
      inputType: "date",
      name: "dateOfBirth" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Age (Calculated)",
      inputType: "number",
      name: "age" as keyof StudentFormData,
      required: false,
      disabled: true,
    },
    {
      type: "input",
      label: "Address*",
      inputType: "text",
      name: "address" as keyof StudentFormData,
      required: true,
    },
    {
      type: "select",
      label: "LGA*",
      name: "lga" as keyof StudentFormData,
      options: [
        { label: "Select LGA*", value: "" },
        ...lgas.map((lga) => ({
          label: lga.name,
          value: lga.name,
        })),
      ],
      required: true,
    },
    {
      type: "select",
      label: "School*",
      name: "school" as keyof StudentFormData,
      options:
        availableSchools.length > 0
          ? availableSchools.map((school) => ({
              label: school.name,
              value: school.code,
            }))
          : [{ label: "Please select LGA first*", value: "" }],
      required: true,
      disabled: !formData.lga,
    },
    {
      type: "select",
      label: "Class*",
      name: "class" as keyof StudentFormData,
      options: [
        { label: "Select Class*", value: "" },
        ...sampleClasses.map((cls) => ({
          label: cls.name,
          value: cls.classId,
        })),
      ],
      required: true,
    },
  ];
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-gradient-to-r via-secondary from-secondary to-green-500 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6 font-geistMono">
              Student Registration Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                            : formData[field.name]
                        }
                        onChange={
                          field.name === "dateOfBirth"
                            ? handleDateChange
                            : handleChange
                        }
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
                    field.name === "age" ? (
                      <div className="form-control" key={field.name}>
                        <label className="label">
                          <span className="label-text">{field.label}</span>
                        </label>
                        <input
                          type={field.inputType}
                          name={field.name}
                          className="input disabled:border-none disabled:bg-orange-200 disabled:text-black input-bordered w-full bg-orange-100 border-primary"
                          value={formData.age}
                          disabled
                        />
                      </div>
                    ) : (
                      <InputField
                        key={field.name}
                        label={field.label}
                        type={field.inputType || "text"}
                        name={field.name}
                        value={
                          Array.isArray(formData[field.name])
                            ? (formData[field.name] as string[]).join(", ")
                            : formData[field.name]
                        }
                        onChange={handleChange}
                        required={field.required}
                        error={errors[field.name]}
                        disabled={field.disabled}
                      />
                    )
                  ) : field.type === "select" ? (
                    <SelectField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      options={field.options || []}
                      value={
                        typeof formData[field.name] === "number"
                          ? String(formData[field.name])
                          : formData[field.name]
                      }
                      onChange={handleChange}
                      required={field.required}
                      multiple={false}
                      disabled={field.disabled}
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
                <FileUpload
                  label="Upload Passport"
                  name="passportUrl"
                  onFileChange={handleFileUpload}
                  previewUrl={formData.passportUrl}
                  required
                  error={errors.passportUrl}
                />
                <FileUpload
                  label="Upload Birth Certificate"
                  name="birthCertificateUrl"
                  onFileChange={handleFileUpload}
                  previewUrl={formData.birthCertificateUrl}
                  required
                  error={errors.birthCertificateUrl}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="btn bg-primary border-none text-white btn-block"
                >
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignUp };

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormErrors, StudentFormData } from "@/components/onboarding/signup";
import { TeacherFormData } from "@/components/onboarding/signupTeacher";

const validateEmail = (value: any): string => {
  if (!value) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof value === "string" && !emailRegex.test(value)
    ? "Please enter a valid email address."
    : "";
};

const validatePassword = (value: any, confirmPassword: any): string => {
  if (!value) return "Password is required.";
  if (typeof value === "string" && value.length < 6)
    return "Password must be at least 6 characters long.";
  return confirmPassword && value !== confirmPassword
    ? "Passwords do not match."
    : "";
}; 

const validateRequiredField = (value: any, fieldName: string): string => {
  return !value ? `${fieldName} is required.` : "";
};

export const validateField = <T extends keyof StudentFormData>(
  fieldName: T,
  value: StudentFormData[T],
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  formData: StudentFormData
) => {
  let error = "";

  switch (fieldName) {
    case "email":
      error = validateEmail(value);
      break;
    case "password":
      error = validatePassword(value, formData.confirmPassword);
      break;
    case "confirmPassword":
      error = validatePassword(value, formData.password);
      break;
    case "name":
      error = validateRequiredField(value, "Full name");
      break;
    case "guardian":
      error = validateRequiredField(value, "Guardian name");
      break;
    case "dateOfBirth":
      error = validateRequiredField(value, "Date of birth");
      break;
    case "address":
      error = validateRequiredField(value, "Address");
      break;
    case "class":
      error = validateRequiredField(value, "Class selection");
      break;
    case "lga":
      error = validateRequiredField(value, "LGA selection");
      break;
    case "school":
      error = validateRequiredField(value, "School selection");
      break;
    case "subjectsOffered":
      error =
        !value || (Array.isArray(value) && value.length === 0)
          ? "At least one subject must be selected."
          : "";
      break;
    case "phone":
      if (!value) {
        error = "Phone number is required.";
      } else {
        const phoneRegex = /^[0-9]{10,15}$/;
        error = !phoneRegex.test(String(value))
          ? "Please enter a valid phone number."
          : "";
      }
      break;
    default:
      break;
  }

  setErrors((prev) => ({
    ...prev,
    [fieldName]: error,
  }));
  return error;
};

export const validateForm = (
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  formData: StudentFormData
): boolean => {
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
  ];

  let valid = true;

  fieldsToValidate.forEach((field) => {
    const value = formData[field];
    const v = validateField(field, value, setErrors, formData);
    if (v !== "") {
      valid = false;
    }
  });

  return valid;
};

export const validateTeacherField = <T extends keyof TeacherFormData>(
  fieldName: T,
  value: TeacherFormData[T],
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  formData: TeacherFormData
) => {
  let error = "";

  const setError = (field: string, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  };

  const validateTeacherPassword = (value: any) => {
    if (!value) return "Password is required.";
    if (typeof value === "string" && value.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return "";
  };

  const validateTeacherConfirmPassword = (value: any) => {
    if (!value) return "Please confirm your password.";
    if (value !== formData.password) {
      return "Passwords do not match.";
    }
    return "";
  };

  switch (fieldName) {
    case "email":
      error = validateEmail(value);
      break;
    case "password":
      error = validateTeacherPassword(value);
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setError("confirmPassword", "Passwords do not match.");
      } else {
        setError("confirmPassword", "");
      }
      break;
    case "confirmPassword":
      error = validateTeacherConfirmPassword(value);
      break;
    case "fullname":
      error = !value ? "Full name is required." : "";
      break;
    case "school":
      error = !value ? "School selection is required." : "";
      break;
    case "subjectsTaught":
      error =
        !value || (Array.isArray(value) && value.length === 0)
          ? "At least one subject must be selected."
          : "";
      break;
    case "classesTaught":
      error =
        !value || (Array.isArray(value) && value.length === 0)
          ? "At least one class must be selected."
          : "";
      break;
    default:
      break;
  }

  setError(fieldName, error);
  return error;
};

export const validateTeacherForm = (
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  formData: TeacherFormData
): boolean => {
  const fieldsToValidate: (keyof TeacherFormData)[] = [
    "email",
    "password",
    "confirmPassword",
    "fullname",
    "school",
    "subjectsTaught",
    "classesTaught",
  ];

  let valid = true;

  fieldsToValidate.forEach((field) => {
    const value = formData[field];
    const v = validateTeacherField(field, value, setErrors, formData);
    if (v !== "") {
      valid = false;
    }
  });

  return valid;
};

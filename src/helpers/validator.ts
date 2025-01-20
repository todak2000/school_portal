import { FormErrors, StudentFormData } from "@/components/onboarding/signup";
import { TeacherFormData } from "@/components/onboarding/signupTeacher";

export const validateField = <T extends keyof StudentFormData>(
  fieldName: T,
  value: StudentFormData[T],
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  formData: StudentFormData
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
    case "fullname":
      if (!value) {
        error = "Full name is required.";
      }
      break;
    case "school":
      if (!value) {
        error = "School selection is required.";
      }
      break;
    case "subjectsTaught":
      if (!value || (Array.isArray(value) && value.length === 0)) {
        error = "At least one subject must be selected.";
      }
      break;
    case "classesTaught":
      if (!value || (Array.isArray(value) && value.length === 0)) {
        error = "At least one class must be selected.";
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

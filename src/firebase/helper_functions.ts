/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the data structure for admin signup
export interface AdminSignupData {
  email: string;
  password: string;
  name?: string;
  fullname?:string
}
export interface UserSignupData {
  email: string;
  password: string;
  name?: string;
  fullname?: string;
  role: "student" | "parent" | "admin" | "teacher";
  schoolId?: string;
  subjectsTaught?: string[];
  isSuperAdmin?: boolean;
  passportUrl?: string | Blob;
  birthCertificateUrl?: string | Blob;
  phone?: string;
  subjectsOffered?: string[];
  guardian?: string;
  gender?: "M" | "F";
  dob?: string;
  address?: string;
  classId?: string;
}
export interface LoginData {
  identifier: string;
  password: string;
}
export interface AdminLoginData {
  email: string;
  password: string;
}
/**
 * Validates the signup data to ensure all required fields are present.
 * @param data - The signup data containing email, password, and name.
 * @returns An object indicating whether the data is valid and an optional message.
 */
export const validateSignupData = (
  data: AdminSignupData
): { valid: boolean; message?: string } => {
  const { email, password } = data;
  const n = data.name? data?.name: data?.fullname
  if (!email || !password || !n) {
    return { valid: false, message: "Email, password, and name are required." };
  }
  return { valid: true };
};

/**
 * Maps Firebase authentication errors to user-friendly messages.
 * @param error - The error object thrown by Firebase.
 * @param email - The email used during signup for personalized messages.
 * @returns An object containing the HTTP status code and a user-friendly message.
 */
export const mapAuthError = (
  error: any,
  email?: string
): { status: number; message: string } => {
  let message: string;
  let status = 400;

  switch (error.code) {
    case "auth/weak-password":
      message = "Password should be at least 6 characters.";
      break;
    case "auth/email-already-in-use":
      message = `Email address ${email} is already in use.`;
      break;
    case "auth/invalid-email":
      message = `Email address ${email} is invalid.`;
      break;
    case "auth/invalid-credential":
      message = "Invalid email address or password.";
      break;
    case "auth/invalid-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
      message = "Email or password is incorrect.";
      break;
    case "auth/too-many-requests":
      message = "Too many unsuccessful login attempts. Please try again later.";
      break;
    default:
      status = 500;
      message = "An unexpected error occurred. Please try again later.";
  }

  return { status, message };
};

/**
 * Validates the login data to ensure all required fields are present.
 * @param data - The login data containing email and password.
 * @returns An object indicating whether the data is valid and an optional message.
 */
export const validateLoginData = (
  data: LoginData
): { valid: boolean; message?: string } => {
  const { identifier, password } = data;
  if (!identifier || !password) {
    return { valid: false, message: "Email and password are required." };
  }
  return { valid: true };
};

/**
 * Validates the login data to ensure all required fields are present.
 * @param data - The login data containing email and password.
 * @returns An object indicating whether the data is valid and an optional message.
 */
export const validateAdminLoginData = (
  data: AdminLoginData
): { valid: boolean; message?: string } => {
  const { email, password } = data;
  if (!email || !password) {
    return { valid: false, message: "Email and password are required." };
  }
  return { valid: true };
};

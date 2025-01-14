/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type User,
  onAuthStateChanged as _onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  sendEmailVerification,
} from "firebase/auth";

import { firebaseAuth, storage } from "..";
import CRUDOperation from "../functions/CRUDOperation";

import { DocumentData, Timestamp } from "firebase/firestore";
import Collection from "../db";
import {
  AdminLoginData,
  AdminSignupData,
  LoginData,
  mapAuthError,
  UserSignupData,
  validateAdminLoginData,
  validateLoginData,
  validateSignupData,
} from "../helper_functions";
import {
  generateStudentID,
  generateTeacherID,
} from "@/helpers/generateStudentID";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const adminOperation = new CRUDOperation(Collection.Admins);
const teacherOperation = new CRUDOperation(Collection.Teachers);
const studentOperation = new CRUDOperation(Collection.Students_Parents);

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(firebaseAuth, callback);
}

// Define the response structure
interface SignupResponse {
  status: number;
  userid?: string;
  message: string;
}

/**
 * Creates a new user with Firebase Authentication.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the user credential.
 */
const createFirebaseUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await createUserWithEmailAndPassword(firebaseAuth, email, password);
};

/**
 * Adds admin-specific data to the database.
 * @param user - The Firebase user object.
 * @param name - The full name of the admin.
 */
export const addAdminDataToDatabase = async (
  user: any,
  name: string
): Promise<void> => {
  const adminData = {
    id: user.uid,
    createdAt: Timestamp.fromDate(new Date()),
    email: user.email,
    fullname: name,
    isAdmin: true,
    role: "admin",
    isSuperAdmin: false,
    isDeactivated: false,
  };
  await adminOperation.add(adminData);
};

export const addUserDataToDatabase = async (
  data: any,
  user: User,
  role: string
): Promise<void> => {
  if (role === "teacher") {
    const teacher = {
      id: user.uid,
      createdAt: Timestamp.fromDate(new Date()),
      email: user.email,
      fullname: data.name,
      teacherId: generateTeacherID(data.school),
      schoolId: data.school,
      subjectsTaught: data.subjectsTaught ?? [], //an array of subject ids
      isAdmin: true,
      role: "teacher",
      isSuperAdmin: data.isSuperAdmin ?? false,
      isDeactivated: false,
    };
    await teacherOperation.add(teacher);
  } else {
    const id = generateStudentID(data.school);

    const student = {
      id: user.uid,

      createdAt: Timestamp.fromDate(new Date()),
      email: user.email,
      studentId: id, // schoold ID is  not uuid, but custom code e.g. AKS/UYO/001
      fullname: data.name,
      passportUrl: "", //await uploadImage(data.passportUrl,`${data.name}_${id}_birth_certificate`),
      birthCertificateUrl: "", //await uploadImage(data.birthCertificateUrl,`${data.name}_${id}_birth_certificate`),
      schoolId: data.school,
      phone: data.phone,
      subjectsOffered: data.subjectsOffered ?? [], //an array of subject ids
      role: "student",
      guardian: data.guardian,
      gender: data.gender, //M|F
      dob: data.dateOfBirth,
      address: data.address,
      classId: data.class,
      isDeactivated: false,
    };

    await studentOperation.add(student);
  }
};

// Define the response structure
interface LoginResponse {
  status: number;
  message: string;
  role?: string;
  userId?: string;
}

/**
 * Signs in a user with Firebase Authentication.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the user credential.
 */
export const signInFirebaseUser = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return await signInWithEmailAndPassword(firebaseAuth, email, password);
};

/**
 * Retrieves admin user data from the database.
 * @param userId - The Firebase user ID.
 * @param role - user role .
 * @returns A promise that resolves to the user data array.
 */
export const getUserData = async (
  userId: string,
  role: "admin" | "teacher" | "student"
): Promise<Record<string, any> | null> => {
  switch (role) {
    case "admin":
      return await adminOperation.getDataByUID(userId);
    case "teacher":
      return await teacherOperation.getDataByUID(userId);
    case "student":
      return await studentOperation.getDataByUID(userId);
    default:
      return null;
  }
};

/**
 * Retrieves user data from admin, teacher, or student collections based on userId.
 * @param userId - The Firebase user ID.
 * @returns A promise that resolves to the user data with role or null if not found.
 * @throws An error if the user is found in multiple collections.
 */
export const getUserDataConcurrently = async (
  userId: string
): Promise<Record<string, any> | null> => {
  try {
    // Execute all getDataByUID calls concurrently
    const [adminData, teacherData, studentData] = await Promise.all([
      adminOperation.getDataByUID(userId),
      teacherOperation.getDataByUID(userId),
      studentOperation.getDataByUID(userId),
    ]);

    // Initialize an array to hold found user data with roles
    let foundUser: Record<string, any> | null = null;
    // Check each collection and add to foundUsers if data is present
    if (adminData) {
      foundUser = adminData;
    }

    if (teacherData) {
      foundUser = teacherData;
    }

    if (studentData) {
      foundUser = studentData;
    }

    return foundUser;
  } catch (error: any) {
    console.error(`Error fetching user data for userId ${userId}:`, error);
    throw error; // Propagate the error to be handled upstream
  }
};
/**
 * Handles deactivated admin users by signing them out and removing the session.
 */
const handleDeactivatedUser = async (): Promise<void> => {
  await signOut(firebaseAuth);
  typeof window !== 'undefined' && window.localStorage.removeItem("aks_portal_user");
};

/**
 * Sends an email verification to the user.
 * @param user - The Firebase user object.
 */

/**
 * Sends a verification email to the user and handles potential errors.
 * @param user - The Firebase user object.
 * @returns A promise that resolves when the email is sent.
 */
const sendVerificationEmail = async (user: User): Promise<void> => {
  try {
    await sendEmailVerification(
      user
      //   {
      //   Optional: Customize the action URL or email template if needed
      //   url: 'https://your-app.com/verify-email',
      //   handleCodeInApp: true,
      // }
    );
    console.log(`Verification email sent to ${user.email}`);
  } catch (error: any) {
    console.error("Error sending verification email:", error.message);
    throw new Error("Failed to send verification email. Please try again.");
  }
};
/**
 * Registers a new admin user.
 * @param data - The signup data containing email, password, and name.
 * @returns A promise that resolves to the signup response.
 */
export const adminSignup = async (
  data: AdminSignupData
): Promise<SignupResponse> => {
  // Validate the signup data
  const validation = validateSignupData(data);
  if (!validation.valid) {
    return {
      status: 400,
      message: validation.message || "Invalid signup data.",
    };
  }

  const { email, password, name } = data;

  try {
    // Create the user with Firebase Authentication
    const result = await createFirebaseUser(email, password);

    if (result.user) {
      // Add admin-specific data to the database
      await addAdminDataToDatabase(result.user, name);
      // Send verification email
      await sendVerificationEmail(result.user);
      return {
        status: 200,
        userid: result.user.uid,
        message: "Admin user registered successfully.",
      };
    }

    // If user creation failed without throwing an error
    return {
      status: 500,
      message: "Signup failed. Please try again.",
    };
  } catch (error: any) {
    console.error("Email/password signup Error:", error.message);
    const errorResponse = mapAuthError(error, email);
    return {
      status: errorResponse.status,
      message: errorResponse.message,
    };
  }
};

/**
 * Logs in an admin user.
 * @param data - The login data containing email and password.
 * @returns A promise that resolves to the login response.
 */
export const adminLogin = async (
  data: AdminLoginData
): Promise<LoginResponse> => {
  // Validate the login data
  const validation = validateAdminLoginData(data);
  if (!validation.valid) {
    return {
      status: 400,
      message: validation.message || "Invalid login data.",
    };
  }

  const { email, password } = data;

  try {
    // Sign in the user with Firebase Authentication
    const result = await signInFirebaseUser(email, password);

    if (result.user) {
      // Retrieve admin user data from the database
      const userData = await getUserData(result.user.uid, "admin");

      // Check if the user is deactivated
      if (userData && userData.isDeactivated) {
        await handleDeactivatedUser();
        return {
          status: 400,
          message: "Oops! You are not authorized to access this app.",
        };
      }
      typeof window !== 'undefined' && window.localStorage.setItem("aks_portal_user", JSON.stringify(userData));
      return {
        status: 200,
        message: "Login successful.",
        role: userData ? userData?.role : null,
        userId: result.user.uid,
      };
    }

    // If user sign-in failed without throwing an error
    return {
      status: 500,
      message: "Sign-in failed. Please try again.",
    };
  } catch (error: any) {
    console.error("Email/password login error:", error.message);
    const errorResponse = mapAuthError(error);
    return {
      status: errorResponse.status,
      message: errorResponse.message,
    };
  }
};

/**
 * Fetches admin user data by user ID.
 * @param userId - The Firebase user ID.
 * @returns A promise that resolves to the admin user data.
 */
export const fetchAdminData = async (
  userId: string
): Promise<Record<string, any> | null> => {
  try {
    const userData = await getUserData(userId, "admin");
    typeof window !== 'undefined' && window.localStorage.setItem("aks_portal_user", JSON.stringify(userData));
    return userData;
  } catch (error: any) {
    console.error("Error fetching admin user data:", error.message);
    throw new Error("Failed to fetch admin user data. Please try again.");
  }
};

/**
 * Logs out the current user.
 * @returns A promise that resolves when the user is logged out.
 */
export const signingOut = async (): Promise<void> => {
  try {
    await signOut(firebaseAuth);

    console.log("User logged out successfully.");
    removeSession(); // Ensure this function is defined to handle session removal
  } catch (error: any) {
    console.error("Error logging out user:", error.message);
    throw new Error("Failed to log out user. Please try again.");
  }
};

/**
 * Removes the user session.
 * (Assuming you have a function like this defined elsewhere)
 */
const removeSession = (): void => {
  // Implementation to remove the session (e.g., clearing cookies, localStorage, etc.)
  typeof window !== 'undefined' && window.localStorage.removeItem("aks_portal_user");
};

/**
 * Registers a new user (student, teacher, parent).
 * @param data - The signup data containing email, password, name, and role.
 * @returns A promise that resolves to the signup response.
 */
export const userSignup = async (
  data: UserSignupData
): Promise<SignupResponse> => {
  // Validate the signup data
  const validation = validateSignupData(data);
  if (!validation.valid) {
    return {
      status: 400,
      message: validation.message || "Invalid signup data.",
    };
  }

  const { email, password, name, role } = data;

  // Ensure the role is valid
  if (!["teacher", "student", "parent"].includes(role)) {
    return {
      status: 400,
      message: "Invalid user role.",
    };
  }

  try {
    // Create the user with Firebase Authentication
    const result = await createFirebaseUser(email, password);

    if (result.user) {
      // Add user-specific data to the database based on role
      await addUserDataToDatabase(data, result.user, role);
      // Send verification email
      await sendVerificationEmail(result.user);
      return {
        status: 200,
        userid: result.user.uid,
        message: `${
          role === "teacher" ? "Teacher" : "Student"
        } registered successfully.`,
      };
    }

    // If user creation failed without throwing an error
    return {
      status: 500,
      message: "Signup failed. Please try again.",
    };
  } catch (error: any) {
    console.error("Email/password signup Error:", error.message);
    const errorResponse = mapAuthError(error, email);
    return {
      status: errorResponse.status,
      message: errorResponse.message,
    };
  }
};

/**
 * Checks if a given identifier is a valid email.
 * @param identifier - The identifier to check.
 * @returns True if the identifier is an email, false otherwise.
 */
const isEmail = (identifier: string): boolean => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(identifier);
};

/**
 * Retrieves the email associated with a given identifier.
 * @param identifier - The email, studentID, or teacherID.
 * @returns The associated email if found, otherwise null.
 */
const getEmailByIdentifier = async (
  identifier: string
): Promise<string | null> => {
  if (isEmail(identifier)) {
    return identifier;
  }

  // Attempt to find in Teachers collection using teacherId
  const teacherData = await teacherOperation.getDataByField(
    "teacherId",
    identifier
  );
  if (teacherData) {
    return teacherData.email;
  }

  // Attempt to find in CustomUsers collection using studentId
  const studentData = await studentOperation.getDataByField(
    "studentId",
    identifier
  );
  if (studentData) {
    return studentData.email;
  }

  // Identifier does not match any user
  return null;
};

/**
 * Signs in a user (student, teacher, parent).
 * @param data - The login data containing email and password.
 * @returns A promise that resolves to the login response.
 */
export const userSignin = async (data: LoginData): Promise<LoginResponse> => {
  // Validate the login data
  const validation = validateLoginData(data);
  if (!validation.valid) {
    return {
      status: 400,
      message: validation.message || "Invalid login data.",
    };
  }

  const { identifier, password } = data;

  try {
    // Retrieve email based on the identifier
    const email = await getEmailByIdentifier(identifier as string);

    if (!email) {
      return {
        status: 400,
        message: "Invalid identifier. User not found.",
      };
    }

    // Sign in the user with Firebase Authentication using the retrieved email
    const result = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    if (result.user) {
      // Determine the user's role by checking different collections
      let userData: DocumentData | null = null;
      let role: string | undefined;

      // Check in Teachers collection
      userData = await teacherOperation.getDataByUID(result.user.uid);
      if (userData) {
        role = userData.role;
      } else {
        // Check in CustomUsers collection
        userData = await studentOperation.getDataByUID(result.user.uid);
        if (userData) {
          role = userData.role;
        }
      }

      if (!role) {
        // If role is not found, sign out the user
        await handleDeactivatedUser();
        return {
          status: 400,
          message: "User role not found. Please contact support.",
        };
      }

      // Check if the user is deactivated
      if (userData && userData.isDeactivated) {
        await handleDeactivatedUser();
        return {
          status: 400,
          message: "Oops! You are not authorized to access this app.",
        };
      }
      typeof window !== 'undefined' && window.localStorage.setItem("aks_portal_user", JSON.stringify(userData));
      return {
        status: 200,
        message: "Login successful.",
        role: role,
        userId: result.user.uid,
      };
    }

    // If user sign-in failed without throwing an error
    return {
      status: 500,
      message: "Sign-in failed. Please try again.",
    };
  } catch (error: any) {
    console.error("User signin error:", error.message);
    const errorResponse = mapAuthError(error);
    return {
      status: errorResponse.status,
      message: errorResponse.message,
    };
  }
};

/**
 * Fetches user data by user ID based on their role.
 * @param userId - The Firebase user ID.
 * @param role - The role of the user ('teacher', 'student', 'parent').
 * @returns A promise that resolves to the user data.
 */
export const fetchUserData = async (
  userId: string,
  role: "admin" | "teacher" | "student"
): Promise<Record<string, any> | null> => {
  try {
    const userData = await getUserData(userId, role);
    typeof window !== 'undefined' && window.localStorage.setItem("aks_portal_user", JSON.stringify(userData));
    return userData;
  } catch (error: any) {
    console.error(`Error fetching ${role} user data:`, error.message);
    throw new Error(`Failed to fetch ${role} user data. Please try again.`);
  }
};

const uploadImage = async (
  blob: Blob,
  name: string
): Promise<{ url: string; path: string }> => {
  const fileName = `${name}.webp`;
  const storageRef = ref(storage, `images/${fileName}`);

  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);

  return {
    url: downloadURL,
    path: `images/${fileName}`,
  };
};

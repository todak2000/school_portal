/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import { OnboardingWrapper } from "./wrapper";
import { PasswordField } from "../inputs/password";
import { userSignin } from "@/firebase/onboarding";
import { useRouter } from "next/navigation";
import Alert from "../alert";
import LoaderSpin from "../loader/LoaderSpin";
import { ROLE } from "@/constants";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const SignIn = React.memo(() => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "error" });
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customFormatRegex = /^AKS\/.+\/.+$/;

    if (!email) {
      return "Email is required.";
    } else if (!emailRegex.test(email) && !customFormatRegex.test(email)) {
      return "Please enter a valid email address or a valid ID.";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    // const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    // const numberRegex = /\d/;
    // const uppercaseRegex = /[A-Z]/;
    // const lowercaseRegex = /[a-z]/;

    if (!password) {
      return "Password is required.";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    } 
    // else if (!specialCharRegex.test(password)) {
    //   return "Password must include at least one special character.";
    // } else if (!numberRegex.test(password)) {
    //   return "Password must include at least one number.";
    // } else if (!uppercaseRegex.test(password)) {
    //   return "Password must include at least one uppercase letter.";
    // } else if (!lowercaseRegex.test(password)) {
    //   return "Password must include at least one lowercase letter.";
    // }
    return undefined;
  };

  // Handle input changes with validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
    // Validate the specific field
    let error: string | undefined;
    if (field === "email") {
      error = validateEmail(value);
    } else if (field === "password") {
      error = validatePassword(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  // Validate the entire form before submission
  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Handle form submission
    try {
      const res = await userSignin({
        identifier: formData.email,
        password: formData.password,
      });
      setAlert({
        message: res.message,
        type: res.status === 200 ? "success" : "error",
      });
      if (res.status === 200) {
        res.role === ROLE.teacher
          ? push("/school_admin/dashboard")
          : push("/student/dashboard");
      }
    } catch (error: any) {
      console.log("Sign in error:", error);

      setAlert({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    dispatch(setModal({ open: true, type: "forgot" }));
  };
  // Extracted variables for nested ternary operations
  const emailIconClass = formData.email
    ? errors.email
      ? "text-red-500 top-1/3"
      : "text-green-500 top-1/2"
    : "group-focus-within:text-green-500";

  const buttonDisabled =
    loading || Object.values(errors).some((error) => error);

  const formFields = [
    {
      name: "email",
      type: "text",
      placeholder: "Username or Email address",
      icon: (
        <Mail
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${emailIconClass}`}
          size={20}
        />
      ),
    },
  ];

  useEffect(() => {
    if (alert.message !== "") {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const getInputClassName = (fieldName: string) => {
    const getClassName = (error: string | undefined, value: string) => {
      switch (true) {
        case !!error:
          return "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500";
        case !!value:
          return "border-green-500";
        default:
          return "border-green-200 focus:border-green-500";
      }
    };

    return `w-full font-geistMono text-black pr-10 pl-4 py-2 bg-gray-50 border ${getClassName(
      errors[fieldName as keyof typeof formData],
      formData[fieldName as keyof typeof formData]
    )} rounded-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 border-green-500 transition-all`;
  };

  return (
    <OnboardingWrapper>
      {/* Form Section */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-geistMono text-primary">
            Login
          </h1>
          <p className="text-orange-600 font-geistMono">
            to continue to the Portal
          </p>
        </div>
        {alert.message && (
          <Alert
            message={alert.message}
            type={alert.type as "error" | "success" | "warning"}
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name} className="relative group">
                {field.icon}
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className={getInputClassName(field.name as keyof FormData)}
                  value={formData[field.name as keyof FormData]}
                  onChange={(e) =>
                    handleChange(e, field.name as keyof FormData)
                  }
                />
                {errors[field.name as keyof FormData] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field.name as keyof FormData]}
                  </p>
                )}
              </div>
            ))}
            <PasswordField
              name="password"
              placeholder="Password"
              value={formData.password}
              error={errors.password as string}
              onChange={(e) => handleChange(e, "password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <button
              type="button"
              aria-label="forgot password"
              onClick={handleForgotPassword}
              className="hover:text-orange-700 text-xs cursor-pointer text-primary font-geistMono"
            >
              Forgot Password
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-primary text-white py-2 rounded-none hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-200 ${
              buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={buttonDisabled}
          >
            {loading ? <LoaderSpin /> : "Login"}
          </button>
        </form>

        <p className="text-xs text-gray-200 font-geistMono">
          Yet to register your child/Ward?{" "}
          <a
            href="/register"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </OnboardingWrapper>
  );
});

SignIn.displayName = "SignIn";
export { SignIn };

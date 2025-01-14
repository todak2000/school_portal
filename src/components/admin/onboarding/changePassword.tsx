import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import { OnboardingWrapper } from "./wrapper";
import { PasswordField } from "@/components/inputs/password";


const ChangePassword: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Reset errors
    setErrors({ newPassword: "", confirmPassword: "" });

    // Basic validation
    let valid = true;
    const newErrors = { newPassword: "", confirmPassword: "" };

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      valid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Password Changed:", formData.newPassword);
        dispatch(setModal({ open: false, type: "" }));
        setIsSubmitting(false);
        // Optionally, reset form
        setFormData({ newPassword: "", confirmPassword: "" });
      }, 2000);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleLogin = () => {
    dispatch(setModal({ open: true, type: "login" }));
  };

  const formFields = [
    {
      name: "newPassword",
      placeholder: "New Password",
    },
    {
      name: "confirmPassword",
      placeholder: "Confirm New Password",
    },
  ];

  return (
    <OnboardingWrapper>
      {/* Form Section */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-geistMono text-primary">
            Change Password
          </h1>
          <p className="text-orange-600 font-geistMono">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {formFields.map((field, index) => (
              <PasswordField
                key={index}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name as keyof typeof formData]}
                error={errors[field.name as keyof typeof errors]}
                onChange={(e) =>
                  handleChange(
                    e,
                    field.name as "confirmPassword" | "newPassword"
                  )
                }
              />
            ))}
          </div>

          <div className="flex items-center ">
            <label
              onClick={handleLogin}
              className="hover:text-orange-700 text-xs cursor-pointer text-primary font-geistMono"
            >
              Remembered your password? Login
            </label>
          </div>

          <button
            type="submit"
            className={`w-full bg-primary text-white py-3 rounded-md hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 ${
              isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Change Password"}
          </button>
        </form>

        <p className="text-xs text-gray-200 font-geistMono ">
          Need help?{" "}
          <a
            href="#"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Contact Support
          </a>
        </p>
      </div>
    </OnboardingWrapper>
  );
});

ChangePassword.displayName = "ChangePassword";
export { ChangePassword };

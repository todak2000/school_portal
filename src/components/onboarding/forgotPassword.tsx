import React, { useState } from "react";
import { User } from "lucide-react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import { OnboardingWrapper } from "./wrapper";

const ForgotPassword = React.memo(() => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    dispatch(setModal({ open: true, type: "reset" }));
  };

  const handleLogin = () => {
    dispatch(setModal({ open: true, type: "login" }));
  };

  const formFields = [
    {
      name: "email",
      type: "text",
      placeholder: "Username or email address",
      icon: (
        <User
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
          size={20}
        />
      ),
    },
  ];

  return (
    <OnboardingWrapper>
      {/* Form Section */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-geistMono text-primary">
            Forgot Password
          </h1>
          <p className="text-orange-600 font-geistMono">
            Enter your email to reset it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {formFields.map((field, index) => (
              <div key={index} className="relative group">
                {field.icon}
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full font-geistMono text-black pl-10 pr-4 py-2 bg-gray-50 border border-orange-200 rounded-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name as keyof typeof formData]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <label
              onClick={handleLogin}
              className="hover:text-orange-700 text-xs cursor-pointer text-primary font-geistMono"
            >
              Have an account? Login
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-none hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-200"
          >
            Send Reset Code
          </button>
        </form>

        <p className="text-xs text-gray-200 font-geistMono">
          Yet to register your child/Ward?{" "}
          <a
            href="#"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </OnboardingWrapper>
  );
});

ForgotPassword.displayName = "ForgotPassword";
export { ForgotPassword };

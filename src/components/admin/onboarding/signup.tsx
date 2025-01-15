"use client";
import React, { useState } from "react";
import { User, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import { OnboardingWrapper } from "./wrapper";
import { PasswordField } from "@/components/inputs/password";
import { adminSignup } from "@/firebase/onboarding";
import LoaderSpin from "@/components/loader/LoaderSpin";
import Alert from "@/components/alert";
import { useRouter } from "next/navigation";

const AdminSignUp = React.memo(() => {
  const dispatch = useDispatch();
  const {push} = useRouter()
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "error" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    // Handle form submission
    const res = await adminSignup(formData);
    setLoading(false);
    setAlert({
      message: res.message,
      type: res.status === 200 ? "success" : "error",
    });
push('/admin/onboarding/signin')
  };

  const handleForgotPassword = () => {
    dispatch(setModal({ open: true, type: "forgot" }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const formFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Full Name",
      icon: (
        <User
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
          size={20}
        />
      ),
    },
    {
      name: "email",
      type: "text",
      placeholder: "Admin Email address",
      icon: (
        <Mail
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
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
            Admin Registration Portal
          </h1>
          <p className="text-orange-600 font-geistMono">
            Only for Authorized Personnel 
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
            {formFields.map((field, index) => (
              <div key={index} className="relative group">
                {field.icon}
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full font-geistMono text-black pr-10 pl-4 py-2 bg-gray-50 border border-green-500 rounded-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
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
            <PasswordField
              name="password"
              placeholder="Password"
              value={formData.password}
              error=""
              onChange={(e) => handleChange(e, "password")}
            />
          </div>

          <div className="flex items-center">
            <label
              onClick={handleForgotPassword}
              className="hover:text-orange-700 text-xs cursor-pointer text-primary font-geistMono"
            >
              Forgot Password
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-none hover:bg-orange-700 transform hover:scale-[1.02] transition-all duration-200"
          >
            {loading ? <LoaderSpin /> : "Create Account"}
          </button>
        </form>
      </div>
    </OnboardingWrapper>
  );
});

AdminSignUp.displayName = "AdminSignUp";
export { AdminSignUp };

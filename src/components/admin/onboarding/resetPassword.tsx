import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import { OnboardingWrapper } from "./wrapper";

const ResetPassword: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission with the 6-digit code
    const resetCode = code.join("");
    console.log("Reset Code Submitted:", resetCode);
    // Dispatch modal or perform other actions as needed
    dispatch(setModal({ open: true, type: "change-password" }));
  };

  const handleLogin = () => {
    dispatch(setModal({ open: true, type: "login" }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Take only the last digit if multiple are entered
    setCode(newCode);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const { key } = e;
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").replace(/\s+/g, "");
    if (!/^\d{6}$/.test(pasteData)) return; // Ensure exactly 6 digits

    const pasteCode = pasteData.split("").slice(0, 5);
    setCode(pasteCode);
    pasteCode.forEach((digit, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = digit;
      }
    });
    inputRefs.current[4]?.focus();
  };

  const formFields = [
    {
      name: "digit1",
      type: "text",
      placeholder: "*",
      maxLength: 1,
    },
    {
      name: "digit2",
      type: "text",
      placeholder: "*",
      maxLength: 1,
    },
    {
      name: "digit3",
      type: "text",
      placeholder: "*",
      maxLength: 1,
    },
    {
      name: "digit4",
      type: "text",
      placeholder: "*",
      maxLength: 1,
    },
    {
      name: "digit5",
      type: "text",
      placeholder: "*",
      maxLength: 1,
    },
  ];

  return (
    <OnboardingWrapper>
      {/* Form Section */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-geistMono text-primary">
            Reset Password
          </h1>
          <p className="text-orange-600 font-geistMono">
            Enter the 5-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-4">
            {formFields.map((field, index) => (
              <div key={index} className="relative group">
                <input
                  type={field.type}
                  inputMode="numeric"
                  pattern="\d{1}"
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className="w-12 h-12 text-center text-xl  font-geistMono text-black py-2 bg-gray-50 border border-orange-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200 ease-in-out transform hover:scale-105"
                  value={code[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <label
              onClick={handleLogin}
              className="hover:text-orange-700 text-xs cursor-pointer text-primary font-geistMono"
            >
              Remembered your password? Login
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-orange-700 transform hover:scale-105 transition-all duration-200"
            disabled={code.includes("")}
          >
            Submit
          </button>
        </form>

        <p className="text-xs text-gray-200 font-geistMono ">
          Did not receive the code?{" "}
          <a
            href="#"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Resend Code
          </a>
        </p>
      </div>
    </OnboardingWrapper>
  );
});

ResetPassword.displayName = "ResetPassword";
export { ResetPassword };

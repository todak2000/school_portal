import React, { ChangeEvent } from "react";
import { StudentFormData } from "../onboarding/signup";
import { Eye, EyeOff } from "lucide-react";
import { TeacherFormData } from "../onboarding/signupTeacher";

export interface InputFieldProps {
  label: string;
  type: string;
  name: keyof StudentFormData | keyof TeacherFormData;
  value: string | number | string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  toggleVisibility?: boolean;
  showPassword?: boolean;
  onToggleVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({
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
  }) => {
    // Extracted variable for input type
    const inputType = toggleVisibility
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{label}*</span>
        </label>
        <div className="relative">
          <input
            type={inputType}
            name={name}
            className={`input font-geistSans text-black  w-full bg-orange-100  focus:outline-none ${
              error ? "border-red-500 bg-red-100" : "border-green-500"
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
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                error ? "text-red-500 " : "text-green-500"
              } `}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
InputField.displayName = "InputField";
export { InputField };

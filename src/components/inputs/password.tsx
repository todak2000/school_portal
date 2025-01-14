import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  name: string;
  placeholder: string;
  value: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  placeholder,
  value,
  error,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative group">
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full font-geistMono text-black pr-10 pl-4 py-2 bg-gray-50 border ${
          error ? "border-red-500" : "border-orange-200"
        }  focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200 ${
          error ? "animate-pulse" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e, name)}
      />
    </div>
  );
};

export { PasswordField };

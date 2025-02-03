import { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

interface CheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  disabled: boolean;
  onChange: (value: string, checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = React.memo(
  ({ label, value, checked, disabled = false, onChange }) => 
    
    {
      const { user } = useSelector((state: RootState) => state.auth);

      return (    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="form-checkbox h-5 w-5 text-primary custom-checkbox rounded-none"
      />
      <span className={`${user?.role ==='student'? "text-gray-500":"text-gray-200"} font-geistMono`}>{label}</span>
    </label>
  )}
);
Checkbox.displayName = "Checkbox";
export { Checkbox };

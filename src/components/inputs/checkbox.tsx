import React from "react";

interface CheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = React.memo(({
    label,
    value,
    checked,
    onChange,
  }) => (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="form-checkbox h-5 w-5 text-primary custom-checkbox rounded-none"
      />
      <span className=" text-gray-200 font-geistMono">{label}</span>
    </label>
  ))
  Checkbox.displayName = "Checkbox";
export { Checkbox };

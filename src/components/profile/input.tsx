import React from "react";

export const getLabel = (l: string) => {
  let r = l;
  switch (l) {
    case "year":
      r = "Academic Year";
      break;
    case "firstTermStart":
      r = "First Term Start Date";
      break;
    case "firstTermEnd":
      r = "First Term End Date";
      break;
    case "secondTermStart":
      r = "Second Term Start Date";
      break;
    case "secondTermEnd":
      r = "Second Term End Date";
      break;
    case "thirdTermStart":
      r = "Third Term Start Date";
      break;
    case "thirdTermEnd":
      r = "Third Term End Date";
      break;
    default:
      break;
  }
  return r;
};
interface InputProps {
  label: string;
  type: string;
  value: string;
  name: string;
  placeholder?: string | undefined;
  isEditable?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

const InputField = ({
  label,
  type,
  value,
  name,
  isEditable,
  onChange,
  placeholder = undefined,
  options,
  disabled,
}: InputProps) => {

  if (type === "select" && options) {
    return (
      <div className="form-control">
        <label className="label">
          <span className="label-text">{getLabel(label)}</span>
        </label>
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled || !isEditable}
          className="select rounded-none select-bordered w-full focus:border-orange-500 text-black bg-orange-100 focus:outline-none disabled:bg-green-100 disabled:font-bold disabled:text-secondary disabled:border-none disabled:rounded-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={type === "date" ? "Select Date" : placeholder}
        disabled={disabled || !isEditable}
        className="input input-bordered rounded-none w-full focus:border-orange-500 text-black bg-orange-100 focus:outline-none disabled:bg-green-100 disabled:font-bold disabled:text-secondary disabled:border-none disabled:rounded-none"
      />
    </div>
  );
};

export default InputField;

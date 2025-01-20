import React, { ChangeEvent } from "react";
import { StudentFormData } from "../onboarding/signup";
import { TeacherFormData } from "../onboarding/signupTeacher";

export interface SelectFieldProps {
    label: string;
    name: keyof StudentFormData | keyof TeacherFormData;
    options: { label: string; value: string }[];
    value: string | number | string[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    multiple?: boolean;
    error?: string;
    disabled?: boolean;
  }
  
  const SelectField: React.FC<SelectFieldProps> = React.memo(({
    label,
    name,
    options,
    value,
    onChange,
    required = false,
    multiple = false,
    error,
    disabled = false,
  }) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-geistMono">{label}*</span>
      </label>
      <select
        name={name}
        className={`select font-geistSans text-black  disabled:text-black select-bordered w-full   ${
          error ? "border-red-500 disabled:bg-red-200 disabled:border-red-500 bg-red-100" : "border-green-500 disabled:bg-orange-200 disabled:border-none bg-orange-100"
        }`}
        value={value}
        onChange={onChange}
        required={required}
        multiple={multiple}
        disabled={disabled}
      >
        {!multiple && <option value="">{`Select ${label}`}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  ));
  SelectField.displayName = "SelectField";
  export {SelectField}
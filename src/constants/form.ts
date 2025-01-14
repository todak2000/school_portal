import { StudentFormData } from "@/components/onboarding/signup";
import { lgas, sampleClasses, schoolsArr } from "./schools";

export const formDataa = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    guardian: "",
    gender: "male",
    dateOfBirth: "",
    address: "",
    class: "",
    lga: "",
    school: "",
    subjectsOffered: [],
    passportUrl: "",
    birthCertificateUrl: "",
    phone: "",
  }
export const formFields = [
    {
      type: "input",
      label: "Email",
      inputType: "email",
      name: "email" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Password",
      inputType: "password",
      name: "password" as keyof StudentFormData,
      required: true,
      toggleVisibility: true,
    },
    {
      type: "input",
      label: "Confirm Password",
      inputType: "password",
      name: "confirmPassword" as keyof StudentFormData,
      required: true,
      toggleVisibility: true,
    },
    {
      type: "input",
      label: "Phone Number",
      inputType: "tel",
      name: "phone" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Full Name",
      inputType: "text",
      name: "name" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Guardian Name",
      inputType: "text",
      name: "guardian" as keyof StudentFormData,
      required: true,
    },
    {
      type: "select",
      label: "Gender",
      name: "gender" as keyof StudentFormData,
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
      required: true,
    },
    {
      type: "input",
      label: "Date of Birth",
      inputType: "date",
      name: "dateOfBirth" as keyof StudentFormData,
      required: true,
    },
    {
      type: "input",
      label: "Address",
      inputType: "text",
      name: "address" as keyof StudentFormData,
      required: true,
    },
    {
      type: "select",
      label: "LGA",
      name: "lga" as keyof StudentFormData,
      options: [
        ...lgas.map((lga) => ({
          label: lga.name,
          value: lga.name,
        })),
      ],
      required: true,
    },
    {
      type: "select",
      label: "School",
      name: "school" as keyof StudentFormData,
      options:
        schoolsArr.length > 0
          ? schoolsArr.map((school) => ({
              label: school.name,
              value: school.code,
            }))
          : [{ label: "Please select LGA first*", value: "" }],
      required: true,
      disabled: !formDataa.lga,
    },
    {
      type: "select",
      label: "Class",
      name: "class" as keyof StudentFormData,
      options: [
        ...sampleClasses.map((cls) => ({
          label: cls.name,
          value: cls.classId,
        })),
      ],
      required: true,
    },
  ];
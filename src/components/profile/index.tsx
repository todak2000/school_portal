/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { PenOff, Trash2, UserRoundPen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar } from "../admin/students";
import { Checkbox } from "../inputs/checkbox";
import { sampleClasses, sampleSubjects, schoolsArr } from "@/constants/schools";
import InputField from "./input";
import Alert from "../alert";
import LoaderSpin from "../loader/LoaderSpin";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

export type UserRole = "admin" | "teacher" | "student";

// Base interface for common user properties
interface BaseUser {
  id: string;
  createdAt: any; // Replace with proper Timestamp type
  email: string;
  fullname: string;
  role: UserRole;
  isDeactivated: boolean;
}

// Specific interfaces for each user type
interface AdminUser extends BaseUser {
  role: "admin";
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface TeacherUser extends BaseUser {
  role: "teacher";
  teacherId: string;
  schoolId: string;
  subjectsTaught: string[];
  classesTaught: string[];
  isAdmin: boolean;
  isSuperAdmin?: boolean;
}

interface StudentUser extends BaseUser {
  role: "student";
  studentId: string;
  passportUrl?: string;
  birthCertificateUrl?: string;
  schoolId: string;
  phone?: string;
  subjectsOffered: string[];
  guardian?: string;
  gender?: "M" | "F";
  dob?: string;
  address?: string;
  classId?: string;
}

// Custom hook for alert management
const useAlert = () => {
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  }>({ message: "", type: "error" });

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return { alert, setAlert };
};

// Separated profile header component
const ProfileHeader = ({
  user,
  formData,
  passportUrl,
  isAdmin = false,
  isEditable,
  handleEditClick,
}: any) => (
  <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
    {user?.role === "student" && passportUrl ? (
      <div className="w-16 h-16 rounded-full">
        <Image
          src={passportUrl}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full border-white border-2"
        />
      </div>
    ) : (
      <Avatar schoolName={formData?.fullname} />
    )}
    <div className="flex-1">
      <h2 className="text-2xl font-semibold text-center md:text-left">
        {formData?.fullname}
      </h2>
      <p className="text-center md:text-left">
        {user?.role === "student"
          ? (user as StudentUser)?.studentId
          : user?.role === "teacher"
          ? (user as TeacherUser)?.teacherId
          : "Admin"}
      </p>
      {(user?.role === "student" || user?.role === "teacher") && (
        <p className="text-center md:text-left text-orange-400">
          {
            schoolsArr.find(
              (school) =>
                school.code === (formData as StudentUser | TeacherUser).schoolId
            )?.name
          }
        </p>
      )}
    </div>
    {isAdmin && (
      <EditButton isEditable={isEditable} onClick={handleEditClick} />
    )}
  </div>
);

// Separated edit button component
const EditButton = ({
  isEditable,
  onClick,
}: {
  isEditable: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`btn btn-outline hover:border-orange-500 hover:bg-orange-500 rounded-none gap-2 ${
      isEditable ? "text-white bg-orange-400" : "text-white border-white"
    }`}
  >
    {isEditable ? (
      <span className="flex flex-row items-center justify-center gap-3">
        <PenOff /> Cancel Edit
      </span>
    ) : (
      <span className="flex flex-row items-center justify-center gap-3">
        <UserRoundPen /> Edit
      </span>
    )}
  </button>
);

// Separated subject/class selection component
const SubjectClassSelection = ({
  user,
  formData,
  isEditable,
  handleSubjectChange,
}: any) => (
  <>
    {(user?.role === "student" || user?.role === "teacher") && (
      <div className="form-control">
        <div className="label">
          <span className="label-text font-medium">
            {user.role === "student" ? "Subjects Offered" : "Subjects Taught"}
          </span>
        </div>
        <CheckboxGroup
          items={sampleSubjects}
          itemKey="subjectId"
          itemLabel="name"
          checked={
            user.role === "student"
              ? (formData as StudentUser)?.subjectsOffered
              : (formData as TeacherUser)?.subjectsTaught
          }
          disabled={!isEditable}
          onChange={(id: string) =>
            handleSubjectChange(
              id,
              user.role === "student" ? "subjectsOffered" : "subjectsTaught"
            )
          }
        />
      </div>
    )}

    {user?.role === "teacher" && (
      <div className="form-control">
        <div className="label">
          <span className="label-text font-medium">Classes Taught</span>
        </div>
        <CheckboxGroup
          items={sampleClasses}
          itemKey="classId"
          itemLabel="name"
          checked={(formData as TeacherUser)?.classesTaught}
          disabled={!isEditable}
          onChange={(id: string) => handleSubjectChange(id, "classesTaught")}
        />
      </div>
    )}
  </>
);

// Reusable checkbox group component
const CheckboxGroup = ({
  items,
  itemKey,
  itemLabel,
  checked = [],
  disabled,
  onChange,
}: any) => (
  <div className="flex flex-wrap gap-2 mb-2">
    {items.map((item: any) => (
      <Checkbox
        key={item[itemKey]}
        label={item[itemLabel]}
        value={item[itemKey]}
        disabled={disabled}
        checked={checked?.includes(item[itemKey])}
        onChange={() => onChange(item[itemKey])}
      />
    ))}
  </div>
);

const UserProfileEdit = ({ data }: { data: Record<string, any> }) => {
  const { user, onCancel, onDelete, onEdit, editMode } = data;
  const { user: loggedUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(!editMode);
  const { alert, setAlert } = useAlert();

  const initialFormData =
    loggedUser?.role === "teacher"
      ? { ...user, subjectsTaught: user?.subjectsTaught || [] }
      : { ...user, subjectsOffered: user?.subjectsOffered || [] };

  const [formData, setFormData] = useState(initialFormData);
  const passportUrl = (user as StudentUser)?.passportUrl ?? "";

  const getCommonFields = () => [
    {
      label: "Full Name",
      type: "text",
      value: formData.fullname,
      key: "fullname",
      name: "fullname",
    },
    {
      label: "Email",
      type: "email",
      value: formData.email,
      key: "email",
      name: "email",
      disabled: true,
    },
    {
      label: "School",
      type: "select",
      value: (formData as StudentUser).schoolId,
      options: schoolsArr.map((school) => ({
        value: school.code,
        label: school.name,
      })),
      key: "schoolId",
      name: "schoolId",
    },
  ];

  const getRoleSpecificFields = () => {
    const roleFields: Record<string, Array<any>> = {
      student: [
        {
          label: "Phone",
          type: "text",
          value: (formData as StudentUser).phone,
          key: "phone",
          name: "phone",
        },
        {
          label: "Gender",
          type: "select",
          value: (formData as StudentUser).gender,
          options: [
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
          ],
          key: "gender",
          name: "gender",
        },
        {
          label: "Date of Birth",
          type: "date",
          value: (formData as StudentUser).dob,
          key: "dob",
          name: "dob",
        },
        {
          label: "Address",
          type: "text",
          value: (formData as StudentUser).address,
          key: "address",
          name: "address",
        },
        {
          label: "Class",
          type: "select",
          value: (formData as StudentUser).classId,
          options: sampleClasses.map((cls) => ({
            value: cls.classId,
            label: cls.classId,
          })),
          key: "classId",
          name: "classId",
        },
      ],
      teacher: [
        {
          label: "School Admin Role",
          type: "select",
          value: (formData as TeacherUser)?.isSuperAdmin?.toString(),
          options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ],
          key: "isSuperAdmin",
          name: "isSuperAdmin",
        },
      ],
      admin: [
        {
          label: "Super Admin",
          type: "checkbox",
          value: (formData as AdminUser).isSuperAdmin,
          key: "isSuperAdmin",
          name: "isSuperAdmin",
        },
      ],
    };

    return [
      ...getCommonFields(),
      ...(roleFields[user.role as keyof typeof roleFields] || []),
    ];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]:
        name === "schoolId"
          ? schoolsArr.find((school) => school.code === value)?.code
          : value,
    }));
  };

  const handleSubjectChange = (subjectId: string, form?: string) => {
    const updateArray = (arr: string[]) =>
      arr.includes(subjectId)
        ? arr.filter((id) => id !== subjectId)
        : [...arr, subjectId];

    setFormData((prev: typeof formData) => {
      if (user.role === "student") {
        return {
          ...prev,
          subjectsOffered: updateArray((prev as StudentUser).subjectsOffered),
        };
      }
      if (user.role === "teacher") {
        return {
          ...prev,
          [form === "subjectsTaught" ? "subjectsTaught" : "classesTaught"]:
            updateArray(
              form === "subjectsTaught"
                ? (prev as TeacherUser).subjectsTaught
                : (prev as TeacherUser).classesTaught
            ),
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = editMode ? await onEdit(formData) : null;
      if (res) {
        setAlert({
          message: res.message,
          type: res.status === 200 ? "success" : "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const isAdmin = loggedUser?.isSuperAdmin && loggedUser?.role === "admin";
  return (
    <div className="bg-gradient-to-r via-secondary from-secondary to-green-500 font-geistMono p-6 shadow-lg max-w-2xl mx-auto max-h-[80vh] overflow-y-auto scrollbar-hide">
      {editMode ? (
        <ProfileHeader
          user={user}
          isAdmin={isAdmin}
          formData={formData}
          passportUrl={passportUrl}
          isEditable={isEditable}
          handleEditClick={() => setIsEditable(!isEditable)}
        />
      ) : (
        <h2 className="text-2xl capitalize font-semibold text-orange-500 text-center md:text-left">
          Create {user.role}
        </h2>
      )}

      <form className="space-y-6">
        <div className="space-y-4">
          {getRoleSpecificFields().map((field) => (
            <InputField
              key={field.key}
              {...field}
              isEditable={isEditable}
              onChange={handleChange}
            />
          ))}

          <SubjectClassSelection
            user={user}
            formData={formData}
            isEditable={isEditable}
            handleSubjectChange={handleSubjectChange}
          />
        </div>

        {alert.message && <Alert message={alert.message} type={alert.type} />}

        <div className="flex justify-between pt-4">
          {editMode &&
            loggedUser?.isSuperAdmin &&
            loggedUser?.role === "admin" && (
              <button
                type="button"
                onClick={() => onDelete(user.id)}
                disabled={loading}
                className="btn rounded-none bg-red-500 text-white border-error disabled:bg-white disabled:border-gray-300 disabled:text-gray-300 btn-outline gap-2 flex flex-row items-center justify-center"
              >
                {loading ? (
                  <LoaderSpin />
                ) : (
                  <>
                    <Trash2 />
                    Delete user
                  </>
                )}
              </button>
            )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn text-primary rounded-none hover:opacity-70"
            >
              Cancel
            </button>
            {isEditable && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn bg-primary rounded-none border-none text-white flex flex-row items-center justify-center"
              >
                {loading ? (
                  <LoaderSpin />
                ) : editMode ? (
                  "Save changes"
                ) : (
                  "Create"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default React.memo(UserProfileEdit);

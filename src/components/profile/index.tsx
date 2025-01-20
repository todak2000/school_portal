/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
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

// Base interface for common user properties
interface BaseUser {
  id: string;
  createdAt: any; // Replace with proper Timestamp type
  email: string;
  fullname: string;
  role: "admin" | "teacher" | "student";
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

const UserProfileEdit = ({ data }: { data: Record<string, any> }) => {
  const { user, onCancel, onDelete, onEdit, editMode } = data;
  const { user: loggedUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState(!editMode);
  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "warning";
  }>({ message: "", type: "error" });

  const [formData, setFormData] = useState(() => {
    if (user.role === "teacher") {
      return {
        ...user,
        subjectsTaught: user?.subjectsTaught || [],
      };
    } else {
      return {
        ...user,
        subjectsOffered: user?.subjectsOffered || [],
      };
    }
  });

  //   const [passportUrl, setPassportUrl] = useState<string>(
  //     (user as StudentUser)?.passportUrl ?? ""
  //   );
  const passportUrl = (user as StudentUser)?.passportUrl ?? "";
  //   const [birthCertificateUrl, setBirthCertificateUrl] = useState<string>(
  //     (user as StudentUser)?.birthCertificateUrl ?? ""
  //   );

  // Generate fields based on user role
  const getFieldsForRole = () => {
    const commonFields = [
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
        disabled: true, // Email shouldn't be editable
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

    switch (user.role) {
      case "student":
        return [
          ...commonFields,
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
        ];

      case "teacher":
        return [
          ...commonFields,
          {
            label: "School Admin Role",
            type: "select",
            value: (formData as TeacherUser)?.isSuperAdmin?.toString(),
            options: [
              {
                value: "true",
                label: "Yes",
              },
              {
                value: "false",
                label: "No",
              },
            ],
            key: "isSuperAdmin",
            name: "isSuperAdmin",
          },
        ];

      case "admin":
        return [
          ...commonFields,
          {
            label: "Super Admin",
            type: "checkbox",
            value: (formData as AdminUser).isSuperAdmin,
            key: "isSuperAdmin",
            name: "isSuperAdmin",
          },
        ];

      default:
        return commonFields;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = editMode
      ? await onEdit(formData)
      : () =>
          void (
            //await onCreate(formData);
            setLoading(false)
          );
    res &&
      setAlert({
        message: res.message,
        type: res.status === 200 ? "success" : "error",
      });
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    const res = onDelete(id);
    setLoading(false);
    setAlert({
      message: res.message,
      type: res.status === 200 ? "success" : "error",
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData: typeof formData) => ({
      ...prevData,
      [name]:
        name === "schoolId"
          ? schoolsArr.filter((school) => school.code === value)[0]?.code
          : value,
    }));
  };

  const handleSubjectChange = (subjectId: string, form?: string) => {
    if (user.role === "student") {
      setFormData((prev: typeof formData) => ({
        ...prev,
        subjectsOffered: (prev as StudentUser).subjectsOffered.includes(
          subjectId
        )
          ? (prev as StudentUser).subjectsOffered.filter(
              (id) => id !== subjectId
            )
          : [...(prev as StudentUser).subjectsOffered, subjectId],
      }));
    } else if (user.role === "teacher" && form === "subjectsTaught") {
      setFormData((prev: typeof formData) => ({
        ...prev,
        subjectsTaught: (prev as TeacherUser)?.subjectsTaught?.includes(
          subjectId
        )
          ? (prev as TeacherUser)?.subjectsTaught?.filter(
              (id) => id !== subjectId
            )
          : [...(prev as TeacherUser)?.subjectsTaught, subjectId],
      }));
    } else if (user.role === "teacher" && form === "classesTaught") {
      setFormData((prev: typeof formData) => ({
        ...prev,
        classesTaught: (prev as TeacherUser)?.classesTaught?.includes(subjectId)
          ? (prev as TeacherUser)?.classesTaught?.filter(
              (id) => id !== subjectId
            )
          : [...(prev as TeacherUser)?.classesTaught, subjectId],
      }));
    }
  };

  useEffect(() => {
    if (alert.message !== "") {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "error" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  return (
    <div className="bg-gradient-to-r via-secondary from-secondary to-green-500 font-geistMono p-6 shadow-lg max-w-2xl mx-auto max-h-[80vh] overflow-y-auto scrollbar-hide">
      {editMode ? (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {user?.role === "student" && passportUrl !== "" ? (
            <div className="w-16 h-16 rounded-full">
              <img
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
                      school.code ===
                      (formData as StudentUser | TeacherUser).schoolId
                  )?.name
                }
              </p>
            )}
          </div>
          <button
            onClick={handleEditClick}
            className={`btn btn-outline hover:border-orange-500 hover:bg-orange-500   rounded-none  gap-2 ${
              isEditable
                ? "text-white bg-orange-400"
                : "text-white border-white"
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
        </div>
      ) : (
        <h2 className="text-2xl capitalize font-semibold text-orange-500 text-center md:text-left">
          Create {user.role}
        </h2>
      )}

      <form className="space-y-6">
        <div className="space-y-4">
          {getFieldsForRole().map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              type={field.type}
              value={field.value}
              name={field.name}
              isEditable={isEditable}
              onChange={handleChange}
              options={field.options || []}
            />
          ))}
          {(user?.role === "student" || user?.role === "teacher") && (
            <div className="form-control">
              <div className="label">
                <span className="label-text font-medium">
                  {user.role === "student"
                    ? "Subjects Offered"
                    : "Subjects Taught"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {sampleSubjects.map((subject) => (
                  <Checkbox
                    key={subject.subjectId}
                    label={subject.name}
                    value={subject.subjectId}
                    disabled={!isEditable}
                    checked={
                      user.role === "student"
                        ? (formData as StudentUser)?.subjectsOffered?.includes(
                            subject.subjectId
                          )
                        : (formData as TeacherUser)?.subjectsTaught?.includes(
                            subject.subjectId
                          )
                    }
                    onChange={() =>
                      handleSubjectChange(
                        subject?.subjectId,
                        user.role === "student"
                          ? "subjectsOffered"
                          : "subjectsTaught"
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {user?.role === "teacher" && (
            <div className="form-control">
              <div className="label">
                <span className="label-text font-medium">Classes Taught</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {sampleClasses.map((c) => (
                  <Checkbox
                    key={c.classId}
                    label={c.name}
                    value={c.classId}
                    disabled={!isEditable}
                    checked={(formData as TeacherUser)?.classesTaught?.includes(
                      c.classId
                    )}
                    onChange={() =>
                      handleSubjectChange(c.classId, "classesTaught")
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {alert.message && (
          <Alert
            message={alert.message}
            type={alert.type as "error" | "success" | "warning"}
          />
        )}
        <div className="flex justify-between pt-4">
          {editMode && (
            <button
              type="button"
              onClick={() => {
                loggedUser &&
                  loggedUser.isSuperAdmin &&
                  loggedUser.role === "admin" &&
                  handleDelete(user.id);
              }}
              disabled={
                !(
                  loggedUser &&
                  loggedUser.isSuperAdmin &&
                  loggedUser.role === "admin"
                ) || loading
              }
              className="btn rounded-none bg-red-500 text-white border-error disabled:bg-white disabled:border-gray-300 disabled:text-gray-300 btn-outline gap-2 flex flex-row items-center justify-center"
            >
              {" "}
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
                ) : (
                  <>{editMode ? "Save changes" : "Create"}</>
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

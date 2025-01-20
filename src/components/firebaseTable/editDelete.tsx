/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import InputField from "../profile/input";
import { lgas } from "@/constants/schools";
import Alert from "../alert";

interface EditDeleteModalProps {
  showModal: boolean;
  modalData: any;
  handleCloseModal: () => void;
  handleEditItem: (data: any) => void;
  handleDeleteItem: (data: any) => void;
  handleCreateItem: (data: any) => void;
  alert: {
    message: string;
    type: string;
  };
  setModalData: React.Dispatch<React.SetStateAction<any>>;
  isEditMode: boolean;
  editableKeys: string[];
}

const EditDeleteModal: React.FC<EditDeleteModalProps> = ({
  showModal,
  modalData,
  handleCloseModal,
  handleEditItem,
  handleDeleteItem,
  handleCreateItem,
  alert,
  setModalData,
  isEditMode,
  editableKeys,
}) => {
  if (!showModal || !modalData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string
  ) => {
    setModalData((prev: any) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg min-w-[90vw] md:min-w-[35vw] max-w-[50vw] max-h-[60vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-secondary">
          {isEditMode ? "Edit/Delete Item" : "Create Item"}
        </h2>
        {alert.message && (
          <Alert
            message={alert.message}
            type={alert.type as "error" | "success" | "warning"}
          />
        )}
        {editableKeys
          .filter((key) => isEditMode || key !== "subjectId")
          .map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 capitalize font-geistMono">
                {key}
              </label>
              {key === "lga" ? (
                <InputField
                  key={key}
                  label=""
                  type="select"
                  value={modalData[key as keyof typeof modalData]}
                  name={key}
                  isEditable={
                    (!isEditMode && !["subjectId"].includes(key)) ||
                    (isEditMode && !["lga", "subjectId"].includes(key))
                  }
                  onChange={(
                    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
                  ) => handleChange(e, key)}
                  options={lgas.map((lga) => ({
                    value: lga.name,
                    label: lga.name,
                  }))}
                />
              ) : (
                <InputField
                  key={key}
                  label=""
                  type="text"
                  value={modalData[key as keyof typeof modalData]}
                  name={key}
                  isEditable={
                    (!isEditMode && !["subjectId"].includes(key)) ||
                    (isEditMode && !["lga", "subjectId"].includes(key))
                  }
                  onChange={(e) => handleChange(e, key)}
                />
              )}
            </div>
          ))}
        <div className="flex justify-end gap-2">
          <button onClick={handleCloseModal} className="btn btn-ghost">
            Cancel
          </button>
          {isEditMode ? (
            <>
              <button
                onClick={() => handleEditItem(modalData)}
                className="btn bg-primary text-white border-none"
              >
                Save
              </button>
              <button
                onClick={() => handleDeleteItem(modalData)}
                className="btn bg-red-500 border-none text-white hover:opacity-70"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => handleCreateItem(modalData)}
              className="btn bg-primary text-white border-none"
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditDeleteModal);

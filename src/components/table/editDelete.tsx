/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface EditDeleteModalProps {
  showModal: boolean;
  modalData: any;
  handleCloseModal: () => void;
  handleEditItem: (data: any) => void;
  handleDeleteItem: () => void;
  handleCreateItem: (data: any) => void;
  setModalData: React.Dispatch<React.SetStateAction<any>>;
  isEditMode: boolean;
}

const EditDeleteModal: React.FC<EditDeleteModalProps> = ({
  showModal,
  modalData,
  handleCloseModal,
  handleEditItem,
  handleDeleteItem,
  handleCreateItem,
  setModalData,
  isEditMode,
}) => {
  if (!showModal || !modalData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setModalData((prev: any) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg min-w-[90vw] md:min-w-[35vw] max-w-[50vw]">
        <h2 className="text-lg font-bold mb-4 text-secondary">
          {isEditMode ? "Edit/Delete Item" : "Create Item"}
        </h2>
        {Object.keys(modalData).map((key) => (
          <div key={key} className="mb-4">
            <label className="block mb-2 capitalize font-geistMono">{key}</label>
            <input
              type="text"
              value={modalData[key as keyof typeof modalData]}
              onChange={(e) => handleChange(e, key)}
              className="input input-bordered w-full bg-transparent border-orange-400 text-black text-sm focus:outline-none focus:border-green-500"
            />
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
                onClick={handleDeleteItem}
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

import { OctagonX, Upload } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent } from "react";

export interface FileUploadProps {
  label: string;
  name: "passportUrl" | "birthCertificateUrl";
  onFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: "passport" | "birthCertificate"
  ) => void;
  deletePreviewUrl: (type: "passport" | "birthCertificate") => void;
  previewUrl?: string;
  required?: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = React.memo(
  ({
    label,
    name,
    onFileChange,
    previewUrl,
    deletePreviewUrl,
    required = false,
    error,
  }) => (
    <div
      className={`border-[1px] border-dashed   p-6 text-center ${
        error ? "border-red-300" : "border-orange-300"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload className="w-12 h-12 text-base-content/50" />
        <div className="text-sm">
          <p className="font-semibold text-white font-geistMono">{label}*</p>
          <p className="text-base-content/70 font-geistMono">
            Drag & Drop your file here
          </p>
        </div>
        <label className="btn  font-geistMono bg-orange-300 text-secondary border-none">
          Browse Files
          <input
            type="file"
            className="hidden"
            name={name}
            onChange={(e) =>
              onFileChange(
                e,
                name === "passportUrl" ? "passport" : "birthCertificate"
              )
            }
            accept={
              name === "passportUrl" ? "image/*" : "image/*,application/pdf"
            }
            required={required}
          />
        </label>
        {previewUrl && (
          <div className="w-20 h-20 relative mt-2">
            <Image
              src={previewUrl}
              alt="Passport preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded"
            />
            <OctagonX
              className="absolute text-red-500 top-0 right-0 cursor-pointer"
              onClick={() =>
                deletePreviewUrl(
                  name === "passportUrl" ? "passport" : "birthCertificate"
                )
              }
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-1 font-geistMono">{error}</p>
        )}
      </div>
    </div>
  )
);
FileUpload.displayName = "FileUpload";
export { FileUpload };

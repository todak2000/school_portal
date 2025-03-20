import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeComponentProps {
  studentId: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ studentId }) => {
  const portalUrl = `https://school-portal-sigma.vercel.app/result/${studentId}`;

  return (
    <QRCodeSVG
      value={portalUrl}
      title={`QR Code for Student ID: ${studentId}`}
      size={100}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"M"}
    //   marginSize={4}
      imageSettings={{
        src: "/coas.png",
        x: undefined,
        y: undefined,
        height: 24,
        width: 24,
        opacity: 1,
        excavate: true,
      }}
    />
  );
};

export default QRCodeComponent;

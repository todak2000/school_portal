import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center bg-black font-geistSans text-primary-content p-10">
      <aside>
        <div className="relative w-14 h-14 md:w-20 md:h-20">
          <Image
            src="/aks_logo2.webp"
            alt="AKS Schools Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="font-semibold text-primary">
          Akwa Ibom State Schools Portal
          <br />
          Arise: Secure, Efficient, Data-Driven Planning for the future of our
          Children&apos;s Education.
        </p>
        <p className="text-primary font-geistMono">Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
    </footer>
  );
};
export default  React.memo(Footer);

"use client";
import { CloudAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page404 = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-r  via-secondary from-secondary to-green-500 px-4 lg:px-20 2xl:px-[20%] py-10 flex flex-col items-center justify-center">
      <Image
        src="/aks_logo1.webp"
        alt="AKS Schools Logo"
        width={208}
        height={208}
        className="object-contain"
        priority
      />
      <CloudAlert className="text-primary mx-auto my-10" size={100} />
      <p className="text-primary text-4xl mx-auto text-center font-geistMono">
        Oops! Not Found
      </p>

      <Link
        className={`w-full max-w-52 my-6 flex flex-row items-center justify-center bg-primary text-white py-3 rounded-none hover:bg-orange-700 hover:opacity-70`}
        href="/"
      >
        Go back Home
      </Link>
    </div>
  );
};

export default React.memo(Page404);

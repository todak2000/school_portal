'use client'
import { BookOpenText, GraduationCap, UserRoundPen } from "lucide-react";
import Countdown from "../countdown";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const mainTitle = "Welcome to Akwa Ibom State Schools Portal";
const subTitle = `Streamlining Educational Registration, Database Management for all
          secondary schools in Akwa Ibom State accessible by School admins,
          Parents and Students`;
const govImage =
  "https://vip.akwaibomstate.gov.ng/wp-content/uploads/2023/07/pueiii1.webp";

const Hero = () => {
  const { push } = useRouter();
  const statistics = [
    { icon: <BookOpenText size={50} />, value: 50, unit: "Schools" },
    { icon: <UserRoundPen size={50} />, value: 100, unit: "Teachers" },
    { icon: <GraduationCap size={50} />, value: 100, unit: "Students" },
  ];

  const handleLogin = () => {
    push("/register");
  };
  return (
    <div className="2xl:px-[15%] hero bg-transparent h-auto flex flex-col lg:flex-row justify-center items-center lg:items-end gap-6 p-4 lg:p-0">
      <div className="bg-transparent w-full lg:w-1/2 flex flex-col justify-between gap-4 md:gap-8">
        <h1 className="text-3xl lg:text-5xl font-geistMono text-center lg:text-left">
          {mainTitle}
        </h1>
        <p className="py-6 font-geistSans text-center lg:text-left text-sm lg:text-xl">
          {subTitle}
        </p>
        <div className="flex justify-center lg:justify-start">
          <button
            onClick={handleLogin}
            type="button"
            className=" bg-primary px-10 py-4 w-max text-white hover:bg-opacity-70"
          >
            Get Started
          </button>
        </div>
        <Image
          src={govImage}
          width={762}
          height={819}
          alt="Government Image"
          className="lg:hidden w-full lg:w-1/2 object-cover mt-6 lg:mt-0"
        />
        <div className="flex flex-wrap justify-center lg:justify-start items-center w-full gap-3 mb-6">
          {statistics.map((stat, index) => (
            <Countdown
              key={index}
              icon={stat.icon}
              value={stat.value}
              unit={stat.unit}
            />
          ))}
        </div>
      </div>
      <Image
        src={govImage}
        alt="Government Image"
        width={762}
        height={819}
        className="hidden lg:flex w-full lg:w-1/2 object-cover mt-6 lg:mt-0"
      />
    </div>
  );
};

export default React.memo(Hero);

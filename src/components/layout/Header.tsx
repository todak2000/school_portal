"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/slices/modal";
import { useRouter } from "next/navigation";

const navItems = [
  {
    name: "Contact Us",
    href: "#",
    onClick: (scrollToFooter: () => void) => scrollToFooter(),
  },
  { name: "School Directory", href: "/directory" },
];

const mobileNavItems = [
  {
    name: "Contact Us",
    href: "#",
    onClick: (scrollToFooter: () => void) => scrollToFooter(),
  },
  { name: "School Directory", href: "/directory" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const Header = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const scrollToFooter = () => {
    const footer = document.querySelector("footer");
    footer?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOnboarding = (type: "login" | "register") => {
    dispatch(setModal({ open: true, type: type }));
  };

  const handleRegistration = () => {
    push("/register");
  };
  return (
    <div className="navbar bg-white shadow-sm lg:px-20 2xl:px-[20%]">
      <div className="navbar-start lg:hidden">
        <div className="dropdown">
          <button type="button" className="btn btn-ghost">
            <Menu className="h-5 w-5 text-primary" />
          </button>
          <ul className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
            {mobileNavItems.map((item) => (
              <li key={item.name}>
                {item.onClick ? (
                  <input
                    type="button"
                    onClick={() => item.onClick(scrollToFooter)}
                    className="text-gray-700 hover:text-primary"
                    value={item.name}
                  />
                ) : (
                  <input
                    type="button"
                    onClick={() =>
                      item.name.toLowerCase() === "register"
                        ? handleRegistration()
                        : handleOnboarding(
                            item.name.toLowerCase() as "login" | "register"
                          )
                    }
                    className="text-gray-700 font-geistSans hover:text-primary"
                    value={item.name}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navbar-end lg:navbar-start w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-14 h-14 md:w-20 md:h-20">
            <Image
              src="/aks_logo2.webp"
              alt="AKS Schools Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden lg:flex text-sm md:text-xl font-semibold text-primary font-geistSans">
            Schools Portal
          </span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-4 w-full navbar-end">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.onClick ? (
                <input
                  type="button"
                  onClick={() => item.onClick(scrollToFooter)}
                  className="text-gray-700 font-geistSans  hover:text-primary"
                  value={item.name}
                />
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-primary font-geistSans "
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <input
          type="button"
          onClick={() => handleOnboarding("login")}
          className="text-gray-700 cursor-pointer hover:text-primary font-geistSans"
          value="Login"
        />
        <input
          type="button"
          onClick={handleRegistration}
          className="bg-secondary cursor-pointer text-white px-4 py-2 hover:bg-primary transition-colors font-geistSans font-bold"
          value="Register"
        />
      </div>
    </div>
  );
};

export default React.memo(Header);

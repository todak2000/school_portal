'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setModal } from '@/store/slices/modal';


const navItems = [
  { name: "Contact Us", href: "#", onClick: (scrollToFooter: () => void) => scrollToFooter() },
  { name: "School Directory", href: "/directory" },
];

const mobileNavItems = [
  { name: "Contact Us", href: "#", onClick: (scrollToFooter: () => void) => scrollToFooter() },
  { name: "School Directory", href: "/directory" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const Header = () => {
  const dispatch = useDispatch();
  
  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    footer?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOnboarding = (type: "login" | "register") => {
    dispatch(setModal({ open: true, type: type }));
  };

  return (
    <div className="navbar bg-white shadow-sm lg:px-20 2xl:px-[20%]">
      <div className="navbar-start lg:hidden">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <Menu className="h-5 w-5 text-primary" />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
            {mobileNavItems.map((item, index) => (
              <li key={index}>
                {item.onClick ? (
                  <button onClick={() => item.onClick(scrollToFooter)} className="text-gray-700 hover:text-primary">
                    {item.name}
                  </button>
                ) : (
                  <button onClick={() => handleOnboarding(item.name.toLowerCase() as "login" | "register")} className="text-gray-700 font-geistSans hover:text-primary">
                    {item.name}
                  </button>
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
          <span className="hidden lg:flex text-sm md:text-xl font-semibold text-primary font-geistSans">Schools Portal</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-4 w-full navbar-end">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item, index) => (
            <li key={index}>
              {item.onClick ? (
                <button onClick={() => item.onClick(scrollToFooter)} className="text-gray-700 font-geistSans  hover:text-primary">
                  {item.name}
                </button>
              ) : (
                <Link href={item.href} className="text-gray-700 hover:text-primary font-geistSans ">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <button onClick={() => handleOnboarding("login")} className="text-gray-700 hover:text-primary font-geistSans">
          Login
        </button>
        <button 
          onClick={() => handleOnboarding("register")} 
          className="bg-secondary text-white px-4 py-2 hover:bg-primary transition-colors font-geistSans font-bold"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default React.memo(Header);

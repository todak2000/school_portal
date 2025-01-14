"use client";

import React, { type ReactElement, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import Footer from "./Footer";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { setModal } from "@/store/slices/modal";

import Modal from "../modal/modal";
import { ModalChild } from "../modal";
import { RootState } from "@/store";
import useAuthListener from "@/hooks/useAuthListener";

const paths = ["/", "/directory", '/register', '/admin/onboarding'];

const Wrapper = ({ children }: { children: ReactElement | ReactNode }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  useAuthListener();
  const closeModal = () => {
    dispatch(setModal({ open: false, type: "" }));
  };
  const { open, type, data } = useSelector((state: RootState) => state.modal);

  return (
    <>
      <Modal isOpen={open} onClose={closeModal}>
        {ModalChild(type, data)}
      </Modal>
      {paths.includes(pathname) ? (
        <>
          <Header />
          {children}
          <Footer />
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default React.memo(Wrapper);

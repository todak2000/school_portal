"use client";

import React, { type ReactElement, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

import Footer from "./Footer";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { setModal } from "@/store/slices/modal";
import { modal } from "@/store";
import Modal from "../modal/modal";
import { ModalChild } from "../modal";

const paths = ["/", "/directory"];

const Wrapper = ({ children }: { children: ReactElement | ReactNode }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const closeModal = () => {
    dispatch(setModal({ open: false, type: "" }));
  };
  const modall = useSelector(modal);

  return (
    <>
      <Modal isOpen={modall.open} onClose={closeModal}>
        {ModalChild(modall.type, modall.data)}
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

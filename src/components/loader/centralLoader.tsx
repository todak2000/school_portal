import React from "react";
import LoaderSpin from "./LoaderSpin";

const CentralLoader: React.FC = () => {
  return (
    <main className="w-[100vw] md:w-[80vw] p-6 pt-[45vh] h-[90vh] flex-col items-center justify-center">
      <LoaderSpin />
    </main>
  );
};

export default React.memo(CentralLoader);

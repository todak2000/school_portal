import React from "react";
import { ImSpinner2 } from "react-icons/im";

const LoaderSpin: React.FC = () => {
  return <ImSpinner2 className="h-8 w-8 animate-spin mx-auto" />;
};

export default React.memo(LoaderSpin);

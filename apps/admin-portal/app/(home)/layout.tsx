import React, { ReactNode } from "react";
import { Navbar } from "../../components/Navbar";
import { Toaster } from "react-hot-toast";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      {children}
    </div>
  );
};

export default layout;

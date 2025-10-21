"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
}

export const Button = ({ children }: ButtonProps) => {
  return (
    <button
      className={"bg-red-600 text-2xl"}
      onClick={() => alert(`Hello from your  app!`)}
    >
      {children}
    </button>
  );
};

"use client";

import { Toaster as ToasterProvider } from "react-hot-toast";

export const Toaster = () => {
  return (
    <ToasterProvider
      position="bottom-center"
      toastOptions={{
        success: {
          style: {
            background: "#491b74",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#491b74",
          },
        },
        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ef4444",
          },
        },
      }}
    />
  );
};

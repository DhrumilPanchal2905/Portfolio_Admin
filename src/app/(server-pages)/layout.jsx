"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <>
      {/* <AuroraBackground> */}
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
      {/* </AuroraBackground> */}
    </>
  );
}

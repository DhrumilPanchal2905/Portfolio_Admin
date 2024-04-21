"use client";

import React, { useState, useEffect } from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
// import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    AOS.init({
      offset: 0,
      duration: 1000,
    });
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <BarLoader color="#f6c400" height={4} />
      </div>
    );
  }

  return (
    <>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
}


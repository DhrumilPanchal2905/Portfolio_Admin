"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { metaInfo } from "@/constants/pageMetaInfo";
import styled from "styled-components";
import { RingLoader } from "react-spinners";
import HomePage from "@/components/HomePage";
import LoginModal from "@/components/LoginModal";
import axios from "axios";
// import { AuroraBackground } from "@/components/UI";

export const metadata = {
  title: metaInfo.home.title,
  description: metaInfo.home.description,
  alternates: { canonical: "https://dev.dhrumilpanchal.in" },
  openGraph: {
    url: `${process.env.NEXT_APP_BASE_URL}`,
    title: metaInfo.home.title,
    images: `${process.env.NEXT_APP_BASE_URL}/images/og-image.png`,
    description: metaInfo.home.description,
    type: "article",
  },
  twitter: {
    title: "Form | Dhrumil Panchal",
    description:
      "Explore Dhrumil Panchal's portfolio showcasing MERN stack projects and web development expertise.",
    card: "summary_large_image",
  },
  robots: {
    index: process.env.NEXT_APP_ENVIRONMENT === "production",
  },
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // useEffect(() => {
      //   const token = localStorage.getItem("token");
      //   if (!token) {
      //     setIsLoginModalOpen(true); // Show login modal if no token found
      //   } else {
      //     fetchData(); // Fetch data if logged in
      //   }
      // }, []);
      setIsLoginModalOpen(true); // Show login modal if no token found
    } else {
      fetchData(); // Fetch data if logged in
    }
  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `${process.env.NEXT_APP_BASE_URL}/api/data`
      );
      console.log("result:", result);
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  };
  const handleLogin = () => {
    // For simplicity, we'll just set a token directly. In a real app, this would come from your backend.
    localStorage.setItem("token", "your_generated_token");
    setIsLoggedIn(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };
  return (
    <>
      {/* <AuroraBackground> */}

      {isLoading ? (
        <LoaderContainer>
          <RingLoader color="#000" size={100} />
        </LoaderContainer>
      ) : isLoginModalOpen ? ( // Simplified conditional rendering
        <LoginModal isVisible={!isLoggedIn} onLogin={handleLogin} />
      ) : (
        <HomePage
          data={data}
          fetchData={fetchData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      {/* </AuroraBackground> */}
    </>
  );
}

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

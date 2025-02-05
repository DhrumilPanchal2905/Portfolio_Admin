"use client";

import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { HiMenu } from "react-icons/hi";
// import { MdClose as AiOutlineClose } from "react-icons/md"; // Assuming you want a close icon
import { AiOutlineClose } from "react-icons/ai";
import LoginModal from "../LoginModal";

const navItems = [
  {
    id: 0,
    name: "Login",
  },
];

export default function Header({ toggleDarkMode, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    // For simplicity, we'll just set a token directly. In a real app, this would come from your backend.
    localStorage.setItem("token", "your_generated_token");
    setIsLoggedIn(true);
  };

  // Toggle the Header Section
  const toggleNav = (name) => {
    setIsOpen(!isOpen);
    setActiveIndex(name === activeIndex ? null : name);
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* {!isLoggedIn && (
        <LoginModal isVisible={!isLoggedIn} onLogin={handleLogin} />
      )} */}
      <div
        className={`w-full mx-auto  fixed top-0 py-5 sm:py-4 z-30 ${
          scrollPosition > 0 ? `bg-white shadow-md` : "bg-white shadow-md"
        } `}
      >
        <nav className=" container m-auto flex items-center justify-between">
          <div data-aos="fade-down" className="logo">
            <Link
              onClick={() => window.scrollTo(0, 0)}
              href={"/"}
              className="text-3xl font-bold sm:text-3xl"
            >
              Dhrumil Panchal.
            </Link>
          </div>
          <div
            data-aos="fade-down"
            className="nav-items flex items-center space-x-11"
          >
            {/* hamburger */}
            <button
              onClick={toggleNav}
              className="cursor-pointer text-2xl hidden md:block"
            >
              <HiMenu size={25} />
            </button>

            <ul
              className={`flex items-center space-x-11 ${
                !isOpen ? "md:flex" : "md:right-[0%]"
              } md:flex-col md:absolute m-auto md:top-0 md:right-[-100%] md:w-[78%] md:h-screen md:bg-white `}
            >
              {/* Use a button tag for better accessibility */}
              <button
                onClick={toggleNav}
                className={`text-3xl hidden md:block relative right-0 top-4 container mx-auto`}
              >
                <AiOutlineClose size={25} />
              </button>
              {navItems.map((item) => (
                <li
                  key={item.id}
                  className="md:m-6 md:flex md:gap-6 md:items-center md:justify-center"
                >
                  <Link
                    to={item.name} // This matches the id of the target section.
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="uppercase cursor-pointer text-black hover:text-yellow-600 font-bold"
                    activeClass="text-yellow-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <div className="bg-black text-[1rem] text-white px-8 py-2 rounded-lg font-bold hover:text-yellow-400 md:m-5 md:block md:mx-auto md:w-fit lg:px-3">
                Project's Data Dashboard
              </div>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

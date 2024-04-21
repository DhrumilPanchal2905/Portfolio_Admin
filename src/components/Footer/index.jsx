import React from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import { AiFillGithub } from "react-icons/ai";
import Link from "next/link";

export default function Footer({ toggleDarkMode, darkMode }) {
  return (
    <div id="works" className=" mx-auto m-auto h-[300px]  mt-16 sm:h-[250px]">
      <div className=" bg-black h-full flex flex-col gap-8 items-center justify-between p-10 sm:p-7">
        <h2
          data-aos="zoom-out"
          className="text-white font-bold text-5xl sm:text-3xl"
        >
          Let's Talk
        </h2>
        <div className=" flex items-center justify-center gap-8 sm:gap-5">
          <Link
            data-aos="fade-up"
            data-aos-duration="1000"
            href="https://telegram.me/dhrumilpanchal2905"
            target="_blank"
            className="box font-medium text-white   flex items-center justify-center flex-col"
          >
            <FaTelegramPlane className=" text-white text-3xl hover:scale-125 cursor-pointer" />
            <p>Telegram</p>
          </Link>
          <Link
            data-aos="fade-up"
            data-aos-duration="1000"
            href="https://github.com/DhrumilPanchal2905"
            target="_blank"
            className="box font-medium text-white   flex items-center justify-center flex-col"
          >
            <AiFillGithub className=" text-white text-3xl hover:scale-125 cursor-pointer" />
            <p>GitHub</p>
          </Link>
          <Link
            data-aos="fade-up"
            data-aos-duration="1200"
            href="https://wa.me/6354226347?text=Hi%20there!%20I'm%20[Your%20Name],%20a%20passionate%20and%20innovative%20IT%20professional%20specializing%20in%20[Your%20Specialization].%20I'm%20excited%20about%20exploring%20opportunities%20where%20I%20can%20contribute%20and%20grow.%20Let's%20discuss%20how%20we%20can%20collaborate%20for%20mutual%20success!"
            target="_blank"
            className="box font-medium text-white  flex items-center justify-center flex-col"
          >
            <IoLogoWhatsapp className=" text-white text-3xl hover:scale-125 cursor-pointer" />
            <p>WhatsApp</p>
          </Link>
          <Link
            data-aos="fade-up"
            data-aos-duration="1400"
            href="https://www.instagram.com/dhrumilpanchal__/"
            target="_blank"
            className="box font-medium text-white  flex items-center justify-center flex-col"
          >
            <RiInstagramFill className=" text-white text-3xl hover:scale-125 cursor-pointer" />
            <p>Instagram</p>
          </Link>
        </div>
        <div className="sm:text-[12px] text-white">
          | Copyright &copy; <span>2024 Dhrumil Panchal </span> All rights
          reserved |
        </div>
      </div>
    </div>
  );
}

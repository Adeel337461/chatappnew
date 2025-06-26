import React from "react";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AuthLayouts = ({ children }) => {
  const mode = useSelector((state) => state.sidebar.mode);

  return (
    <>
      <header
        className={`flex justify-center items-center py-3 h-20 shadow-md ${
          mode ? "bg-black" : "bg-gray-200"
        } `}
      >
        <Link to={"/"}>
          <img
            src={logo}
            alt="logo"
            width={180}
            height={60}
            style={mode ? { filter: "brightness(5)" } : {}}
          />
        </Link>
      </header>

      {children}
    </>
  );
};

export default AuthLayouts;

import React from "react";
import { toggleMode, toggleSidebar } from "../redux/slice/slice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { MdOutlineOpenInFull } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import Avatar from "./Avatar";

const Header = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const mode = useSelector((state) => state.sidebar.mode);
  const userMessageInfo = useSelector((state) => state.userinfo);
  const basePath = location.pathname === "/";
  return (
    <div className="h-15 flex items-center justify-between px-3">
      {!basePath && userMessageInfo.messageName && (
        <div className="flex items-center gap-2">
          <Avatar
            icon={userMessageInfo.messageProfile_pic}
            name={userMessageInfo.messageName}
            userid={userMessageInfo.messageId}
          />
          <div >
            <p className="poppins-500">{userMessageInfo.messageName}</p>
            {userMessageInfo.messageOnline ? (

              <p style={{marginTop:'-7px'}} className="poppins-600 text-green-600">online</p>
            ):(
              <p style={{marginTop:'-7px'}} className="poppins-600">offline</p>

            )}
          </div>
        </div>
      )}
      <div>
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-sm bg-blue-500 text-white p-2 rounded cursor-pointer"
          title={collapsed ? "Open Sidebar" : "Close Sidebar"}
        >
          {collapsed ? (
            <span>
              <MdOutlineOpenInFull />
            </span>
          ) : (
            <span>
              <MdOutlineCloseFullscreen />
            </span>
          )}
        </button>

        <button
          onClick={() => dispatch(toggleMode())}
          className="ms-2 text-sm bg-blue-500 text-white p-2 rounded cursor-pointer"
          title={mode ? "Dark Mode" : "Light Mode"}
        >
          {mode ? (
            <span>
              <FaRegMoon />
            </span>
          ) : (
            <span>
              <IoSunnySharp />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;

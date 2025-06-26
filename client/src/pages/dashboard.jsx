import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUser } from "../redux/slice/slice";
import { initSocket } from "../helpers/socket.js";


const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.sidebar.mode);
  const userinfo = useSelector((state) => state.userinfo);
  const basePath = location.pathname === "/";

  useEffect(() => {
    if (!userinfo.token) return;

    const timeout = setTimeout(() => {
      const socket = initSocket();
      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });

      socket.on("onlineUser", (data) => {   
           console.log('online', data)

        dispatch(setOnlineUser(data));
      });

      return () => socket.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, [userinfo.token, dispatch]);

  return (
    <div className="flex min-h-screen main_body">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <SideBar />
      </section>
      <div className="flex-1">
        <div
          className={`sticky top-0 ${mode ? "bg-black" : "bg-red-200"} z-10`}
        >
          <Header />
        </div>

        {!basePath && userinfo.name ? (
          <section>
            <Outlet />
          </section>
        ) : (
          <div
            className={`justify-center items-center flex flex-col gap-2 ${mode && "bg-gray-600"
              }`}
            style={{ height: "calc(100% - 3.75rem)" }}
          >
            <div>
              <img
                src={logo}
                width={250}
                alt="logo"
                style={mode ? { filter: "brightness(5)" } : {}}
              />
            </div>
            <p
              className={`${mode && "text-white"} text-lg mt-2 text-slate-500`}
            >
              Select user to send message
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

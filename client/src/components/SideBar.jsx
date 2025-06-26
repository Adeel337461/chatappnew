import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import logo from "../assets/logo.png";
import { FiLogOut } from "react-icons/fi";
import { logout, setUserInfo } from "../redux/slice/slice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import UserProfileModel from "../modals/userProfile";
import UserListModel from "../modals/userList";
import axios from "axios";
import { summaryAPIS } from "../helpers/summaryAPIS";
import TokenExp from "../helpers/checkToken";
import { initSocket } from "../helpers/socket";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";

const SideBar = () => {
  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const mode = useSelector((state) => state.sidebar.mode);
  const userinfo = useSelector((state) => state.userinfo);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openModalList, setOpenModalList] = useState(false);
  const navigate = useNavigate();
  const [allUser, setAllUser] = useState([])

  const handleLogin = () => {
    navigate("/login");
  };

  const handleOpenModel = async () => {
    const valid = await TokenExp(dispatch);
    if (valid) {
      setOpenModalList(true);
    }
  };

  const handleProfile = async () => {
    const valid = await TokenExp(dispatch);
    if (valid) {
      setOpenModal(true);
    }
  };

  const userDetails = async () => {
    try {
      const response = await axios({
        url: summaryAPIS.details.url,
        method: summaryAPIS.details.method,
        withCredentials: true,
      });

      if (response.status === 500) {
        toast.error("Server error. Please try again later.");
        return;
      }

      if (response.data.error) {
        toast.error(response.data.message);
        dispatch(logout());
        return;
      }

      if (response.data.success) {
        if (response.data.data.logout) {
          // toast.error("Session expired. Please login again.");
          dispatch(logout());
        } else {
          dispatch(setUserInfo(response.data.data));
        }
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      // toast.error(message);
      console.log(message);
      dispatch(logout());
    }
  };

  useEffect(() => {
    if (userinfo.token) {
      userDetails();
    }
  }, [userinfo.token]);

  useEffect(() => {
    const socket = initSocket();

    if (socket) {
      socket.emit('sidebar', userinfo._id)

      socket.on('conversation', (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            }
          }
          else if (conversationUser?.receiver?._id !== userinfo?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver
            }
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            }
          }
        })

        setAllUser(conversationUserData)
      })
    }
  }, [userinfo])


  return (
    <div
      className={`${mode ? "bg-black" : "bg-gray-300"
        } min-h-screen transition-all duration-300 p-2 flex flex-col ${collapsed ? "w-16" : "w-64"
        }`}
    >
      <div
        className={`
        bg-red-0 ${!collapsed ? "h-[145px]" : "h-[75px]"}`}
      >
        <div className={` ${collapsed ? "mb-2" : "mb-4"} border-indigo-500`}>
          <Link to={'/'} >
            <img
              src={logo}
              width={200}
              alt="logo"
              className={`m-auto ${mode && "border-indigo-600"} ${collapsed ? "border-b-1" : "border-b-2"
                } pb-2`}
              style={mode ? { filter: "brightness(5)" } : {}}
            />
          </Link>
        </div>

        <div
          className={`flex gap-2 items-center ${collapsed && "justify-center"
            } cursor-pointer hover:bg-gray-500 p-2 rounded hover:text-white ${mode && "text-white bg-gray-600 hover:bg-gray-500"
            }`}
          onClick={() => (userinfo.token ? handleOpenModel() : handleLogin())}
        >
          <IoChatbubbleEllipsesSharp
            className={collapsed ? "text-2xl" : "text-4xl"}
          />
          {!collapsed && <p className="poppins-500 text-lg">Let's Chat</p>}
        </div>
      </div>
      <div className="bg-green-0 flex-1 overflow-auto ">

        {
          allUser.map((conv, index) => {
            return (
              <Link key={index} to={"/" + conv?.userDetails?._id}  className={`flex items-center gap-2   ${collapsed ? 'px-1' : 'px-2'} py-1 my-1 border-transparent border-2 hover:border-e-blue-400   cursor-pointer ${mode ? 'border-b-slate-100 hover:bg-slate-500 text-black': 'hover:bg-slate-100 rounded'}`}>
                <div title={collapsed && conv?.userDetails?.name}>

                  <Avatar icon={conv?.userDetails?.profile_pic} name={conv?.userDetails?.name} userid={'1'} />



                </div>
                <div className={collapsed && 'hidden'}>
                  <h3 className={`ext-ellipsis line-clamp-1 poppins-600 text-base ${mode && 'text-white'}`}>{conv?.userDetails?.name}</h3>
                  <div className={` ${mode ? 'text-white' : 'text-slate-500'} text-xs flex items-center gap-1`}>
                    
                    <div className='flex items-center gap-1'>
                      {
                        conv?.lastMsg?.imageUrl && (
                          <div className='flex items-center gap-1'>
                            <span><FaImage /></span>
                            {!conv?.lastMsg?.text && <span>Image</span>}
                          </div>
                        )
                      }
                      {
                        conv?.lastMsg?.videoUrl && (
                          <div className='flex items-center gap-1'>
                            <span><FaVideo /></span>
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </div>
                        )
                      }
                    </div>
                    <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                  </div>
                </div>
                {
                  Boolean(conv?.unseenMsg) && (
                    <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-blue-500 text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                  )
                }

              </Link>
            )
          })
        } 
      </div>

      {userinfo.token && userinfo.token && (
        <>
          {openModal && <UserProfileModel setOpenModal={setOpenModal} />}
          {openModalList && <UserListModel setOpenModal={setOpenModalList} />}
          <div
            className={`bg-blue-0 flex flex-col justify-center ${!userinfo.token
              ? "h-[60px]"
              : collapsed
                ? "h-[90px]"
                : "h-[105px]"
              }`}
          >
            <div
              className={`flex cursor-pointer w-fit  ${!collapsed && "ps-2"
                } mb-1 ${collapsed ? "justify-center m-auto" : ""}`}
              onClick={() => handleProfile()}
            >
              <Avatar icon={userinfo.profile_pic} name={userinfo.name} userid={userinfo._id} />
            </div>

            <div
              className={`flex gap-2 items-center ${collapsed && "justify-center"
                } cursor-pointer hover:bg-gray-500 p-2 rounded hover:text-white ${mode && "text-white bg-gray-600 hover:bg-gray-500"
                }`}
              onClick={() => dispatch(logout())}
            >
              <FiLogOut className={collapsed ? "text-2xl" : "text-3xl"} />
              {!collapsed && <p className="poppins-500 text-lg">Logout</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;

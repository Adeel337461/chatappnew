import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import axios from "axios";
import { summaryAPIS } from "../helpers/summaryAPIS";
import toast from "react-hot-toast";
import { setUserInfo } from "../redux/slice/slice";

const userProfile = ({ setOpenModal }) => {
  const userinfo = useSelector((state) => state.userinfo);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: userinfo.name ? userinfo.name : "",
    email: userinfo.email ? userinfo.email : "",
    password: "",
    profile_pic: userinfo.profile_pic ? userinfo.profile_pic : "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((preve) => {
      return {
        ...preve,
        profile_pic: "",
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios({
        url: summaryAPIS.profile.url,
        method: summaryAPIS.profile.method,
        data: data,
        withCredentials: true,
      });

      if (response.status === 500) {
        toast.error("Server error. Please try again later.");
        setLoading(false);

        return;
      }

      if (response.data.error) {
        toast.error(response.data.message);
        setLoading(false);
      }

      if (response.data.success) {
        setLoading(false);
        dispatch(setUserInfo(response.data.data));
        setOpenModal(false);
        toast.success(response.data.message);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundColor: "rgba(0,0,0,.4)" }}
      className="fixed z-14 w-full h-full top-0 left-0 flex justify-center items-center"
    >
      <div className="dialog bg-white w-[40%] p-3 rounded shadow">
        <div className="flex justify-end">
          <button
            onClick={() => setOpenModal(false)}
            type="button"
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-800 cursor-pointer"
          >
            <IoClose className="text-2xl text-white" />
          </button>
        </div>

        <div>
          <form className="grid gap-3 mt-1" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name :</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="enter your name"
                className="bg-slate-100 px-2 py-1 focus:outline-green-500 border-1 rounded"
                value={data.name}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="name">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="enter your email"
                className="bg-slate-100 px-2 py-1 focus:outline-green-500 border-1 rounded"
                value={data.email}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="name">Password :</label>
              <input
                type="text"
                id="password"
                name="password"
                placeholder="enter your password"
                className="bg-slate-100 px-2 py-1 focus:outline-green-500 border-1 rounded"
                value={data.password}
                onChange={handleOnChange}
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="profile_pic">
                  Photo :
                  <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                    <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                      {uploadPhoto?.name
                        ? uploadPhoto?.name
                        : "Upload profile photo"}
                    </p>
                    {uploadPhoto?.name && (
                      <button
                        className="text-lg ml-2 hover:text-red-600"
                        onClick={handleClearUploadPhoto}
                      >
                        <IoClose />
                      </button>
                    )}
                  </div>
                </label>
              </div>

              {(userinfo.profile_pic || data.profile_pic) && (
                <div>
                  <Avatar
                    icon={data.profile_pic || userinfo.profile_pic}
                    name={data.name || userinfo.name}
                  />
                </div>
              )}

              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
                onChange={handleUploadPhoto}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                      bg-blue-500 text-lg px-4 py-1 hover:bg-blue-700
                      rounded mt-2 font-bold text-white leading-relaxed
                      tracking-wide cursor-pointer
                      ${loading ? "opacity-50 pointer-events-none" : ""}
                    `}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default userProfile;

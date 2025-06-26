import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import { summaryAPIS } from "../helpers/summaryAPIS";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const mode = useSelector((state) => state.sidebar.mode);

  const [uploadPhoto, setUploadPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await axios({
        url: summaryAPIS.register.url,
        method: summaryAPIS.register.method,
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
        toast.success(response.data.message);
        navigate("/login");
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
      className={`w-full flex items-center justify-center ${
        mode && "bg-gray-700"
      } `}
      style={{ height: "calc(100vh - 5rem)", minHeight: "520px" }}
    >
      <div
        
        className={`card ${
          mode ? "bg-white" : "bg-gray-300"
        }  w-100 p-4 rounded shadow `}
      >
        <h2 className="poppins-600">Welcome to Chat App</h2>

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
              required
            />
          </div>
          <div className="flex flex-col gap-1">
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
            {loading ? "Saving…" : "Register"}
          </button>
        </form>

        <p className="my-3 mb-0 text-center">
          Already have account? &nbsp;
          <Link to={"/login"} className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

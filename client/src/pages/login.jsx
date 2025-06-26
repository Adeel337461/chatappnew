import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { summaryAPIS } from "../helpers/summaryAPIS";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../redux/slice/slice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const mode = useSelector((state) => state.sidebar.mode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios({
        url: summaryAPIS.login.url,
        method: summaryAPIS.login.method,
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
        navigate("/");
        dispatch(setToken(response?.data?.token));
        // dispatch(setUserInfo(response?.data?.token))
        localStorage.setItem("token", response?.data?.token);
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
      className={`w-full flex items-center justify-center ${
        mode && "bg-gray-700"
      } `}
      style={{ height: "calc(100vh - 5rem)", minHeight: "400px" }}
    >
      <div
        className={`card ${
          mode ? "bg-white" : "bg-gray-300"
        }  w-100 p-4 rounded shadow `}
      >
        <h2 className="poppins-600">Login to Chat App</h2>

        <form className="grid gap-3 mt-1" onSubmit={handleSubmit}>
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
            {loading ? "Login..." : "Login"}
          </button>
        </form>

        <p className="my-3 mb-0 text-center">
          New User ? &nbsp;
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

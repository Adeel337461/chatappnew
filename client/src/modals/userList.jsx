import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../components/Avatar";
import axios from "axios";
import { summaryAPIS } from "../helpers/summaryAPIS";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const userList = ({ setOpenModal }) => {
  const userinfo = useSelector((state) => state.userinfo);
  const dispatch = useDispatch();

  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleList = async () => {
    setLoading(true);

    try {
      const response = await axios({
        url: summaryAPIS.list.url,
        method: summaryAPIS.list.method,
        withCredentials: true,
      });

      if (response.status === 500) {
        toast.error("Server error. Please try again later.");
        setLoading(false);
      }

      if (response.data.error) {
        toast.error(response.data.message);
        setLoading(false);
      }

      if (response.data.success) {
        setLoading(false);
        setListData(response.data.data);
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

  useEffect(() => {
    const list = async () => {
      await handleList();
    };
    list();
  }, [search]);

  const filteredList = listData.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{ backgroundColor: "rgba(0,0,0,.4)" }}
      className="fixed z-14 w-full h-full top-0 left-0 flex justify-center 
      "
    >
      <div className="dialog bg-white w-[40%] mt-4 h-fit p-3 rounded shadow">
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
          <div className="my-2">
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search User"
              className="bg-slate-100 px-2 py-1 focus:outline-green-500 border-1 rounded w-full h-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            {loading ? (
              <div className="flex justify-center mt-3">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div>
                {filteredList.length > 0 ? (
                  filteredList.map((data, index) => (
                    <Link
                      onClick={() => setOpenModal(false)}
                      to={data._id}
                      className="flex gap-2 items-center my-1 cursor-pointer p-2 hover:bg-gray-200 rounded"
                      key={index}
                    >
                      <Avatar icon={data.profile_pic} name={data.name} userid={data._id} />
                      <div>
                        <p className="poppins-500 text-red-600">{data.name}</p>
                        <p>{data.email}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No user found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default userList;

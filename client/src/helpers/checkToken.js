import axios from "axios";
import { summaryAPIS } from "./summaryAPIS";
import toast from "react-hot-toast";
import { logout } from "../redux/slice/slice";

const TokenExp = async (dispatch) => {
  try {
    const response = await axios({
      url: summaryAPIS.token.url,
      method: summaryAPIS.token.method,
      withCredentials: true,
    });

    if (response.status === 500) {
      toast.error("Server Error.");
      return true;
    }
    
    if (response.data.error) {
      toast.error("Session expired. Please login again.");
      dispatch(logout());
      return false;
    }

    if (response.data.success) {
      if (response.data.logout) {
        dispatch(logout());
        return false;
      } else {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.log(err?.message || "Unknown error");
    dispatch(logout());
    return false;
  }
};

export default TokenExp;

export const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const summaryAPIS = {
  login: {
    url: `${API_URL}/user/login`,
    method: "post",
  },
  register: {
    url: `${API_URL}/user/register`,
    method: "post",
  },
  details: {
    url: `${API_URL}/user/details`,
    method: "post",
  },
  token: {
    url: `${API_URL}/user/token`,
    method: "post",
  },
  profile: {
    url: `${API_URL}/user/profile`,
    method: "post",
  },
  list: {
    url: `${API_URL}/user/list`,
    method: "post",
  },
};

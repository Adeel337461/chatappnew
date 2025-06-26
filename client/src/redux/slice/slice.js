import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: { collapsed: false },
  reducers: {
    toggleSidebar: (state) => {
      state.collapsed = !state.collapsed;
    },
    toggleMode: (state) => {
      state.mode = !state.mode;
    },
    setCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
  },
});
const initialStateData = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
};

const userinfoSlice = createSlice({
  name: "userinfo",
  initialState: initialStateData,
  reducers: {
    setUserInfo: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      state.onlineUser = [];
      state.messageId="";
      state.messageName="";
      state.messageEmail="";
      state.messageProfile_pic="";
      localStorage.removeItem('token')
      state.messageOnline="";
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
      setUserMessageInfo: (state, action) => {
      state.messageId = action.payload._id;
      state.messageName = action.payload.name;
      state.messageEmail = action.payload.email;
      state.messageProfile_pic = action.payload.profile_pic;
      state.messageOnline = action.payload.online;
    },
  },
});

export const { toggleSidebar, setCollapsed, toggleMode } = sidebarSlice.actions;
export const {
  setUserInfo,
  setToken,
  logout,
  setOnlineUser,
  setUserMessageInfo
} = userinfoSlice.actions;

export const sidebarReducer = sidebarSlice.reducer;
export const userinfoReducer = userinfoSlice.reducer;

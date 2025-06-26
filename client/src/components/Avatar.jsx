import React from "react";
import { useSelector } from "react-redux";

const Avatar = ({ userid, icon, name = "" }) => {
  const collapsed = useSelector((state) => state.sidebar.collapsed);
  const onlineUser = useSelector((state) => state?.userinfo?.onlineUser || []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const avatarSize = collapsed ? "w-[35px] h-[35px]" : "w-[50px] h-[50px]";
  const isOnline =
    Array.isArray(onlineUser) &&
    typeof userid === "string" &&
    onlineUser.includes(userid);

  return (
    <div className="relative flex items-center gap-2">
      <div
        className={`rounded-full flex items-center justify-center bg-gray-400 ${avatarSize}`}
      >
        {icon ? (
          <img
            src={icon}
            alt="avatar"
            className="rounded-full w-full h-full object-cover"
          />
        ) : (
          <span
            className={`text-white font-bold ${
              collapsed ? "text-sm" : "text-lg"
            }`}
          >
            {getInitials(name)}
          </span>
        )}
        {isOnline && (
          <div className="bg-green-600 w-[10px] h-[10px] absolute bottom-0 right-0 rounded-full border border-white" />
        )}
      </div>

    </div>
  );
};

export default Avatar;

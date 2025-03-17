import React from "react";
import { Avatar, Spotify } from "../../../assets";
import { NavLink } from "react-router-dom";
import { Bell, House, Search, User } from "lucide-react";

const Header = () => {
  return (
    <div className="w-full py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 basis-2/3">
        {/* logo */}
        <NavLink to="/">
          <img src={Spotify} alt="logo" className="w-12" />
        </NavLink>
        <NavLink to="/" className="bg-[#1f1f1f] p-2 rounded-full">
          <House size={24} className="text-white" />
        </NavLink>
        <div className="relative w-full flex items-center">
          <Search className="absolute left-3 text-white" />
          <input
            className="bg-[#1f1f1f] text-white rounded-2xl h-10 py-2 pl-12 text-[14px] w-[500px]"
            type="text"
            placeholder="Bạn muốn phát nội dung gì ?"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 basis-1/3">
        <button className="bg-white text-black px-4 py-2 rounded-2xl cursor-pointer ">
          Khám phá premium
        </button>
        <Bell size={24} className="text-white cursor-pointer" />

        <User
          size={36}
          className="text-white border-2 border-white rounded-full p-1 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Header;

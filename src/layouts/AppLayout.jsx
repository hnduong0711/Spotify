import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/user/Header/Header";
import Sidebar from "../components/user/Sidebar/Sidebar";

const AppLayout = () => {
  return (
    <div className="bg-black">
      <Header />
      <main className="px-2 flex">
        <Sidebar />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

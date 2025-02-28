import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/user/Header/Header";
import Footer from "../components/user/Footer/Footer";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function Home() {
  return (
    <div className="w-full h-screen flex">
      <div className="fixed top-0 left-0 w-64 h-full bg-white z-10">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <div className="p-4 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

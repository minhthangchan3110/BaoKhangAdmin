import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";

import { IoSettingsOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

export default function Header() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const userCircleRef = useRef(null);
  const settingsRef = useRef(null);

  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  const toggleChangePassword = () => {
    setIsChangePassword(!isChangePassword);
  };

  const handleClickOutside = (event) => {
    if (
      userCircleRef.current &&
      !userCircleRef.current.contains(event.target)
    ) {
      setIsRegister(false);
    }
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsChangePassword(false);
    }
  };

  async function handleLogout() {
    console.log("Hàm handleLogout đã được gọi"); // Thêm log để kiểm tra
    try {
      await auth.signOut();
      console.log("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error.message);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex justify-between py-2 px-5 items-center h-[81px] border-b">
      {/* Search */}
      <div className="flex border border-black p-2 bg-white rounded-full items-center w-1/6">
        <input
          className="focus:outline-none text-sm focus:border-none px-1 w-11/12"
          placeholder="Tìm kiếm..."
        />
        <div className="hover:bg-gray-100 p-1 rounded-full">
          <CiSearch />
        </div>
      </div>

      {/* Info */}
      <div className="relative flex items-center justify-center gap-5">
        <div className="w-1/3 relative" ref={userCircleRef}>
          <FaRegUserCircle
            className="text-2xl cursor-pointer"
            onClick={toggleRegister}
          />
          {isRegister && (
            <div
              onClick={handleLogout}
              className="absolute right-0 w-48 bg-white border rounded shadow-lg z-10"
            >
              <button className="font-montserrat text-sm w-full text-left px-4 py-2 hover:bg-gray-100">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
        <div className="w-1/3" ref={settingsRef}>
          <IoSettingsOutline
            className="text-2xl cursor-pointer"
            onClick={toggleChangePassword}
          />
          {isChangePassword && (
            <div className="absolute right-0 w-48 bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => navigate("/change-password")}
                className="font-montserrat text-sm w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Đổi mật khẩu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.jpg";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  const listOptions = [
    {
      title: "Bảng sản phẩm",
      path: "/",
    },
    {
      title: "Thêm sản phẩm",
      path: "/add-product",
    },
    {
      title: "Danh mục loại sản phẩm",
      path: "/categories",
    },
    {
      title: "Các bài viết",
      path: "/blog",
    },
    {
      title: "Các thông tin chi tiết",
      path: "/info-table",
    },
    {
      title: "Thư liên hệ",
      path: "/contact-table",
    },
  ];

  return (
    <div className="w-full h-screen border-r flex flex-col items-center">
      <div className="border-b w-full flex items-center justify-center">
        <img alt="Logo" src={Logo} className="w-[80px] h-[80px]" />
      </div>
      <div className="w-full font-montserrat">
        {listOptions.map((option, index) => (
          <div
            key={index}
            className={`w-full  p-4 mt-4 cursor-pointer text-center ${
              location.pathname === option.path
                ? "bg-slate-100 text-red-500 font-semibold border-l-4 border-red-500"
                : "hover:bg-slate-200"
            }`}
            onClick={() => navigate(option.path)}
          >
            {option.title}
          </div>
        ))}
      </div>
    </div>
  );
}

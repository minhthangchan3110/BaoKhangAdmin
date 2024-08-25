import { doc, setDoc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { toast } from "react-toastify";

export default function InfoTable() {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    mst: "",
    address: "",
    email: "",
    phone: "",
    hotline: "",
  });

  const title = [
    { name: "Số điện thoại", key: "phone" },
    { name: "Địa chỉ", key: "address" },
    { name: "Email", key: "email" },
    { name: "MST", key: "mst" },
    { name: "Hotline", key: "hotline" },
  ];

  // Sử dụng useEffect để lấy dữ liệu từ Firestore khi trang được tải
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "companyInfo", "info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data());
        } else {
          console.log("Không tìm thấy tài liệu!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []); // Chỉ chạy một lần khi component được mount

  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = async () => {
    setEditable(false);
    try {
      console.log("Dữ liệu gửi đi:", formData); // Kiểm tra dữ liệu
      await setDoc(doc(db, "companyInfo", "info"), formData);
      toast.success("Dữ liệu đã được lưu thành công!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lưu dữ liệu", {
        position: "top-center",
      });
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="font-montserrat w-full">
      <form className="w-full flex flex-col gap-4">
        {title.map((options, index) => (
          <div key={index} className="w-full">
            <div className="w-full">{options.name}</div>
            <input
              name={options.key} // Thay đổi tên của input để khớp với formData
              value={formData[options.key]} // Gán giá trị từ formData
              onChange={handleChange} // Xử lý thay đổi
              required
              disabled={!editable}
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 w-full"
            />
          </div>
        ))}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleEdit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500 duration-300 border"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!editable}
            className={`px-4 py-2 rounded-lg border duration-300 ${
              editable
                ? "bg-red-500 text-white hover:bg-white hover:text-red-500"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

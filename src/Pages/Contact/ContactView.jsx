import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";

export default function ContactView() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "contactMessages", id); // Truy vấn dữ liệu theo id
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.log("Không tìm thấy tài liệu!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!data) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="font-montserrat p-5">
      <h1 className="text-2xl font-semibold mb-4">Thông tin thư liên hệ</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">Tên</label>
          <input
            type="text"
            value={data.name}
            readOnly
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">
            Số điện thoại
          </label>
          <input
            type="text"
            value={data.phone}
            readOnly
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">Email</label>
          <input
            type="text"
            value={data.email}
            readOnly
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">
            Nội dung
          </label>
          <textarea
            value={data.content}
            readOnly
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-white"
          />
        </div>
        <div>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="items-center duration-300 border-green-400 hover:bg-white border font-montserrat px-4 py-2 hover:text-green-400 rounded-lg bg-green-400 text-white"
          >
            Trở về
          </button>
        </div>
      </form>
    </div>
  );
}

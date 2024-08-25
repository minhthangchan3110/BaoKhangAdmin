import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";

const ContactTable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [deleteBlogId, setDeleteBlogId] = useState(null);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    useState(false);

  const openConfirmDeleteModal = (key) => {
    setDeleteBlogId(key);
    setConfirmDeleteModalIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(false);
    setDeleteBlogId(null);
  };

  const handleDelete = async (key) => {
    try {
      await deleteDoc(doc(db, "contactMessages", key));
      toast.success("Bài viết đã được xóa thành công!", {
        position: "top-center",
      });
      const updatedData = data.filter((item) => item.key !== key);
      setData(updatedData);
      closeConfirmDeleteModal();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa bài viết", {
        position: "top-center",
      });
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "contactMessages"));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          key: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      className: "font-montserrat",
      width: 100,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
      className: "font-montserrat",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      className: "font-montserrat",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "font-montserrat",
      ellipsis: true,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      className: "font-montserrat",
      ellipsis: true,
    },
    {
      title: "Thời gian gửi",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => {
        // Định dạng thời gian theo cách bạn muốn
        const date = new Date(timestamp.seconds * 1000); // Chuyển đổi timestamp Firestore thành đối tượng Date
        return date.toLocaleString(); // Hiển thị ngày và giờ
      },
      className: "font-montserrat",
    },
    {
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            className="font-montserrat text-green-500"
            onClick={() => navigate(`/contact-view/${record.key}`)}
          >
            Xem
          </a>
          <a
            onClick={() => openConfirmDeleteModal(record.key)}
            className="font-montserrat text-red-300 hover:text-red-600"
          >
            Xóa
          </a>
        </Space>
      ),
      className: "font-montserrat",
    },
  ];

  return (
    <div className="font-montserrat">
      <Table columns={columns} dataSource={data} />
      <Modal
        isOpen={confirmDeleteModalIsOpen}
        onRequestClose={closeConfirmDeleteModal}
        contentLabel="Confirm Delete Modal"
        className="flex items-center justify-center h-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-5 rounded-lg font-montserrat">
          <div className="text-lg mb-4">
            Bạn có chắc chắn muốn xóa bài viết này?
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDelete(deleteBlogId)}
              className="border-blue-500 border px-4 py-2 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
            >
              Đồng ý
            </button>
            <button
              type="button"
              onClick={closeConfirmDeleteModal}
              className="border-red-500 border px-4 py-2 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactTable;

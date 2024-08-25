/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Oval } from "react-loader-spinner";
import Modal from "react-modal";
import { toast } from "react-toastify";

const Blog = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteBlogId, setDeleteBlogId] = useState(null);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogs = [];
        querySnapshot.forEach((doc) => {
          blogs.push({ key: doc.id, ...doc.data() });
        });
        setData(blogs);
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu", {
          position: "top-center",
        });
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
    fetchData();
  }, []);

  const handleAddPost = () => {
    navigate("/add-post");
  };

  const handleView = (key) => {
    navigate(`/view-blog/${key}`);
  };

  const handleEdit = (key) => {
    navigate(`/edit-blog/${key}`);
  };

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
      await deleteDoc(doc(db, "blogs", key));
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

  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "index",
      key: "index",
      width: 100,
      render: (text, record, index) => index + 1,
      className: "font-montserrat",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <a className="font-montserrat">{text}</a>,
      className: "font-montserrat",
    },
    {
      title: "Nội dung",
      dataIndex: "contentBlocks",
      key: "contentBlocks",
      render: (contentBlocks) => {
        if (contentBlocks && contentBlocks.length > 0) {
          const firstBlock = contentBlocks[0];
          const text = firstBlock.text || "";
          const previewText =
            text.length > 50 ? text.slice(0, 50) + "..." : text;
          return (
            <div className="font-montserrat truncate">
              <p>{previewText}</p>
            </div>
          );
        }
        return <div>Chưa có nội dung mô tả</div>;
      },
      className: "font-montserrat",
    },
    {
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            className="font-montserrat text-green-500"
            onClick={() => handleView(record.key)}
          >
            Xem
          </a>
          <a
            className="font-montserrat text-blue-500"
            onClick={() => handleEdit(record.key)}
          >
            Sửa
          </a>
          <a
            className="font-montserrat text-red-300 hover:text-red-600"
            onClick={() => openConfirmDeleteModal(record.key)}
          >
            Xóa
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="font-montserrat">
      <div className="flex items-end justify-end mx-2 my-5">
        <div
          className="bg-green-500 py-2 px-4 text-white rounded-full hover:bg-green-600 cursor-pointer"
          onClick={handleAddPost}
        >
          Thêm bài viết
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-full p-6">
            <Oval
              height={80}
              width={80}
              color="#007bff"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#007bff"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />
          </div>
        ) : (
          <Table columns={columns} dataSource={data} />
        )}

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
    </div>
  );
};

export default Blog;

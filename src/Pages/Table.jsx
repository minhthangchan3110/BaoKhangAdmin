/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner"; // Import spinner

Modal.setAppElement("#root");

const TableInfo = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading

      try {
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, "product"));
        const products = productsSnapshot.docs.map((doc, index) => ({
          key: doc.id,
          index: index + 1,
          ...doc.data(),
        }));

        // Fetch categories
        const categorySnapshot = await getDocs(collection(db, "category"));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          value: doc.data().name.toLowerCase(), // Convert to lowercase for filtering
          text: doc.data().name,
        }));
        setCategories(categoryList);

        setData(products);
        setFilteredData(products); // Initially, show all products
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu", {
          position: "top-center",
        });
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "product", id));
      toast.success("Sản phẩm đã được xóa thành công!", {
        position: "top-center",
      });
      // Update both data and filteredData
      const updatedData = data.filter((item) => item.key !== id);
      setData(updatedData);
      setFilteredData(updatedData);
      closeConfirmDeleteModal();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm", {
        position: "top-center",
      });
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const openConfirmDeleteModal = (id) => {
    setDeleteProductId(id);
    setConfirmDeleteModalIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(false);
    setDeleteProductId(null);
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "index",
      key: "index",
      width: 100,
      className: "font-montserrat",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      sortOrder: sortedInfo.columnKey === "Name" ? sortedInfo.order : null,
      ellipsis: true,
      className: "font-montserrat",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "Category",
      key: "Category",
      filters: categories.map((category) => ({
        text: category.text,
        value: category.value,
      })),
      onFilter: (value, record) => record.Category.toLowerCase() === value,
      filterMultiple: false,
      className: "font-montserrat",
    },
    {
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => navigate(`/detail/${record.key}`)}
            className="text-green-500 font-montserrat"
          >
            Xem
          </a>
          <a
            onClick={() => navigate(`/edit/${record.key}`)}
            className="text-blue-500  font-montserrat"
          >
            Sửa
          </a>
          <a
            onClick={() => openConfirmDeleteModal(record.key)}
            className="text-red-300  font-montserrat hover:text-red-600"
          >
            Xóa
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className=" font-montserrat">
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
        <Table
          columns={columns}
          dataSource={filteredData}
          onChange={handleChange}
        />
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
            Bạn có chắc chắn muốn xóa sản phẩm này?
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleDelete(deleteProductId)}
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

export default TableInfo;

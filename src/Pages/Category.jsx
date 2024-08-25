/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Space, Table, Modal, Button, Form, Input } from "antd";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Oval } from "react-loader-spinner"; // Import spinner

const columns = (showEditModal, handleDelete) => [
  {
    title: "Số thứ tự",
    dataIndex: "index",
    key: "index",
    width: 100,
    render: (text, record, index) => index + 1,
    className: "font-montserrat",
  },
  {
    title: "Tên loại sản phẩm",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
    className: "font-montserrat",
  },
  {
    title: "Số lượng",
    dataIndex: "count",
    key: "count",
    className: "font-montserrat",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    className: "font-montserrat",
  },
  {
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a
          className="text-green-500 font-montserrat"
          onClick={() => showEditModal(record)}
        >
          Sửa
        </a>
        <a
          className="text-red-300 hover:text-red-600 font-montserrat"
          onClick={() => handleDelete(record.key)}
        >
          Xóa
        </a>
      </Space>
    ),
  },
];

const Category = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading

      try {
        // Fetch categories
        const categorySnapshot = await getDocs(collection(db, "category"));
        const categories = categorySnapshot.docs.map((doc) => ({
          ...doc.data(),
          key: doc.id,
        }));

        // Fetch products and count by category
        const productsSnapshot = await getDocs(collection(db, "product"));
        const productCounts = {};
        productsSnapshot.docs.forEach((doc) => {
          const productData = doc.data();
          if (productCounts[productData.Category]) {
            productCounts[productData.Category]++;
          } else {
            productCounts[productData.Category] = 1;
          }
        });

        const categoriesWithCounts = categories.map((category) => ({
          ...category,
          count: productCounts[category.name] || 0, // Update count for each category
        }));

        setData(categoriesWithCounts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, []);

  const showModal = () => {
    setIsEditMode(false);
    setCurrentRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setCurrentRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && currentRecord) {
        // Update
        const docRef = doc(db, "category", currentRecord.key);
        await updateDoc(docRef, values);
        setData(
          data.map((item) =>
            item.key === currentRecord.key ? { ...item, ...values } : item
          )
        );
      } else {
        // Add
        const docRef = await addDoc(collection(db, "category"), values);
        setData([...data, { ...values, key: docRef.id, count: 0 }]);
      }
      handleCancel();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const handleDelete = (key) => {
    setConfirmDelete(key);
  };

  const confirmDeleteCategory = async () => {
    try {
      await deleteDoc(doc(db, "category", confirmDelete));
      setData(data.filter((item) => item.key !== confirmDelete));
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  return (
    <div>
      <div className="flex justify-end p-4">
        <Button
          className="bg-green-500 px-4 py-2 uppercase text-white text-sm rounded-full hover:bg-green-700"
          onClick={showModal}
        >
          Thêm loại sản phẩm
        </Button>
      </div>

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
          columns={columns(showEditModal, handleDelete)}
          dataSource={data}
        />
      )}

      <Modal
        title={isEditMode ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        className="font-montserrat" // Thêm lớp CSS cho font chữ
      >
        <Form
          form={form}
          layout="vertical"
          name="category_form"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="name"
            label="Tên loại sản phẩm"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại sản phẩm!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        title="Xóa loại sản phẩm"
        visible={!!confirmDelete}
        onOk={confirmDeleteCategory}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        className="font-montserrat" // Thêm lớp CSS cho font chữ
      >
        <p>Bạn có chắc chắn muốn xóa loại sản phẩm này không?</p>
      </Modal>
    </div>
  );
};

export default Category;

import React, { useState } from "react";
import Modal from "react-modal";
import { db, storage } from "../firebaseConfig"; // Import từ cấu hình Firebase của bạn
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export default function AddProduct() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [digital, setDigital] = useState("");
  const [productDetails, setProductDetails] = useState("");

  const dbref = collection(db, "product");

  const uploadImages = async (files) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên Firebase Storage:", error);
      throw error;
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        dbref,
        where("Name", "==", name),
        where("Category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Tên sản phẩm đã tồn tại trong loại sản phẩm này", {
          position: "top-center",
        });
        return;
      }

      const imageFiles = Array.from(
        e.target.querySelector('input[type="file"]').files
      );
      if (imageFiles.length === 0) {
        toast.error("Vui lòng chọn ít nhất một ảnh", {
          position: "top-center",
        });
        return;
      }
      const imageUrls = await uploadImages(imageFiles);

      await addDoc(dbref, {
        Name: name,
        Category: category,
        Digital: digital,
        ProductDetails: productDetails,
        Image: imageUrls,
      });
      toast.success("Sản phẩm đã được thêm thành công!", {
        position: "top-center",
      });

      setName("");
      setCategory("");
      setDigital("");
      setProductDetails("");
      setSelectedImages([]);
      setSelectedImage(null);
      setFileInputKey(Date.now());
      closeModal();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm sản phẩm: " + error.message, {
        position: "top-center",
      });
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files.map((file) => URL.createObjectURL(file)));
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="w-full h-auto p-5">
      <h1 className="text-2xl font-semibold font-montserrat">Thêm sản phẩm</h1>
      <form className="mt-5 w-full" onSubmit={addProduct}>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
            Tên sản phẩm
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Thêm vào tên sản phẩm"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
            Loại sản phẩm
          </label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Thêm loại sản phẩm"
          />
        </div>
        <div className="font-montserrat flex flex-col mt-4">
          <label className="block font-medium text-gray-900 dark:text-white">
            Thông số kỹ thuật
          </label>
          <input
            value={digital}
            onChange={(e) => setDigital(e.target.value)}
            className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Thêm thông số kỹ thuật"
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
            Chi tiết sản phẩm
          </label>
          <textarea
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Thêm chi tiết sản phẩm"
            rows="5"
          />
        </div>
        <div className="font-montserrat flex flex-col mt-4">
          <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
            Ảnh mô tả sản phẩm
          </label>
          <input
            key={fileInputKey}
            required
            className="block p-3 w-full mt-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            multiple
            onChange={handleImageChange}
          />
          <div className="flex flex-wrap mt-4">
            {selectedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Selected file ${index}`}
                className="w-12 h-12 object-cover m-2 border border-gray-300 rounded-lg cursor-pointer"
                onClick={() => openModal(image)}
              />
            ))}
          </div>
          {selectedImage && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Image Modal"
              className="flex items-center justify-center h-full"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-0 right-0 m-2 text-white text-xl"
                >
                  &times;
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            </Modal>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 font-montserrat border hover:bg-blue-700 px-4 py-2 uppercase rounded-lg bg-blue-500 text-white"
        >
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}

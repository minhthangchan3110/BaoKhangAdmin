/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] =
    useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "product", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

  const handleDeleteProduct = async () => {
    try {
      await deleteDoc(doc(db, "product", id));
      toast.success("Sản phẩm đã được xóa thành công!", {
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm", {
        position: "top-center",
      });
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  const openConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModalIsOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteProduct();
    closeConfirmDeleteModal();
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <div className="font-montserrat font-semibold text-xl">
        Thông tin sản phẩm
      </div>
      <form>
        <div className="flex w-full gap-5 mt-4">
          <div className="w-1/2 flex flex-col mt-2">
            <label className="font-montserrat">Tên sản phẩm</label>
            <input
              type="text"
              value={product.Name}
              disabled
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2"
            />
          </div>
          <div className="w-1/2 flex flex-col mt-2">
            <label className="font-montserrat">Loại sản phẩm</label>
            <input
              type="text"
              value={product.Category}
              disabled
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2"
            />
          </div>
        </div>
        <div className="flex w-full gap-5 mt-4">
          <div className="flex flex-col w-1/2 ">
            <label className="font-montserrat">Thông số kỹ thuật</label>
            <textarea
              value={product.Digital}
              disabled
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 h-48"
            ></textarea>
          </div>
          <div className="flex flex-col w-1/2 ">
            <label className="font-montserrat">Chi tiết sản phẩm</label>
            <textarea
              value={product.ProductDetails}
              disabled
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 h-48"
            ></textarea>
          </div>
        </div>
        <div className="mt-4">
          <label className="font-montserrat">Hình ảnh sản phẩm</label>
          <div className="border w-full mt-2 h-[80px] border-gray-500 rounded-lg">
            {product.Image && product.Image.length > 0 ? (
              product.Image.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product image ${index}`}
                  className="w-16 h-16 object-cover inline-block m-2 cursor-pointer"
                  onClick={() => openModal(image)}
                />
              ))
            ) : (
              <div className="p-2">Không có hình ảnh</div>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/edit/${id}`)}
            className="items-center border-green-400 hover:bg-white border font-montserrat px-4 py-2 hover:text-green-400 rounded-lg bg-green-400 duration-100 text-white"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={openConfirmDeleteModal}
            className="items-center border-red-500 border px-4 py-2 text-red-500 rounded-lg hover:text-white hover:bg-red-500"
          >
            Xóa
          </button>
        </div>
      </form>

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal
        isOpen={confirmDeleteModalIsOpen}
        onRequestClose={closeConfirmDeleteModal}
        contentLabel="Confirm Delete Modal"
        className="flex items-center justify-center h-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-5 rounded-lg">
          <div className="font-montserrat text-lg mb-4">
            Bạn có chắc chắn muốn xóa sản phẩm này?
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={confirmDelete}
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

      {/* Modal xem hình ảnh */}
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
  );
}

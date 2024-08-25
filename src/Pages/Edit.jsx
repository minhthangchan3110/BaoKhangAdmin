/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import { IoIosClose } from "react-icons/io";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [digital, setDigital] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "product", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct(data);
        setName(data.Name);
        setCategory(data.Category);
        setDigital(data.Digital);
        setProductDetails(data.ProductDetails);
        setImages(data.Image || []);
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "product", id);
      await updateDoc(docRef, {
        Name: name,
        Category: category,
        Digital: digital,
        ProductDetails: productDetails,
        Image: images,
      });
      toast.success("Sản phẩm đã được cập nhật thành công!", {
        position: "top-center",
      });
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật sản phẩm", {
        position: "top-center",
      });
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const docRef = doc(db, "product", id);
      const productSnap = await getDoc(docRef);
      const productData = productSnap.data();

      if (productData && productData.Image) {
        // Xóa hình ảnh từ Firebase Storage
        await Promise.all(
          productData.Image.map(async (imageUrl) => {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          })
        );
      }

      await deleteDoc(docRef);
      toast.success("Sản phẩm đã được xóa thành công!", {
        position: "top-center",
      });
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa sản phẩm", {
        position: "top-center",
      });
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = [];

    for (const file of files) {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      newImageUrls.push(downloadURL);
    }

    setNewImages(newImages.concat(newImageUrls));
    setImages(images.concat(newImageUrls));
  };

  const openModal = (image) => {
    setImageToDelete(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setImageToDelete(null);
    setShowModal(false);
  };

  const confirmDeleteImage = async () => {
    try {
      const imageRef = ref(storage, imageToDelete);
      await deleteObject(imageRef);
      setImages(images.filter((img) => img !== imageToDelete));
      toast.success("Hình ảnh đã được xóa thành công!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa hình ảnh", {
        position: "top-center",
      });
      console.error("Lỗi khi xóa hình ảnh:", error);
    } finally {
      closeModal();
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <div className="font-montserrat font-semibold text-xl">
        Sửa thông tin sản phẩm
      </div>
      <form onSubmit={handleUpdate}>
        <div className="flex w-full gap-5 mt-4">
          <div className="w-1/2 flex flex-col mt-2">
            <label className="font-montserrat">Tên sản phẩm</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2"
            />
          </div>
          <div className="w-1/2 flex flex-col mt-2">
            <label className="font-montserrat">Loại sản phẩm</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2"
            />
          </div>
        </div>
        <div className="flex w-full gap-5 mt-4">
          <div className="flex flex-col w-1/2 ">
            <label className="font-montserrat">Thông số kỹ thuật</label>
            <textarea
              value={digital}
              onChange={(e) => setDigital(e.target.value)}
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 h-48"
            ></textarea>
          </div>
          <div className="flex flex-col w-1/2 ">
            <label className="font-montserrat">Chi tiết sản phẩm</label>
            <textarea
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 h-48"
            ></textarea>
          </div>
        </div>
        <div className="mt-4">
          <label className="font-montserrat">Hình ảnh sản phẩm</label>
          <div className="border w-full mt-2 h-[80px] border-gray-500 rounded-lg flex flex-wrap">
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="relative w-16 h-16 m-2">
                  <img
                    src={image}
                    alt={`Product image ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 p-1 bg-white rounded-full"
                    onClick={() => openModal(image)}
                  >
                    <IoIosClose className="text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-2">Không có hình ảnh</div>
            )}
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="mt-2"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="items-center border-blue-500 hover:bg-white border font-montserrat px-4 py-2 hover:text-blue-500 rounded-lg bg-blue-500 duration-100 text-white"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="items-center border-red-500 border px-4 py-2 text-red-500 rounded-lg hover:text-white hover:bg-red-500 font-montserrat"
          >
            Xóa
          </button>
        </div>
      </form>
      {/* Modal xác nhận xóa hình ảnh */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-lg">
            <div className="font-montserrat text-lg mb-4">
              Bạn có chắc chắn muốn xóa hình ảnh này?
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmDeleteImage}
                className="border-blue-500 border px-4 py-2 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white"
              >
                Đồng ý
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="border-red-500 border px-4 py-2 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

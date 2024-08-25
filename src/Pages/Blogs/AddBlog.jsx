import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebaseConfig";
import { toast } from "react-toastify";

export default function AddBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    coverImage: null,
    contentBlocks: [{ title: "", text: "", image: null }],
  });

  const handleAddBlock = () => {
    setFormData({
      ...formData,
      contentBlocks: [
        ...formData.contentBlocks,
        { title: "", text: "", image: null },
      ],
    });
  };

  const handleInputChange = (e, index) => {
    const { name, value, files } = e.target;
    const updatedContentBlocks = [...formData.contentBlocks];
    if (files) {
      updatedContentBlocks[index][name] = files[0];
    } else {
      updatedContentBlocks[index][name] = value;
    }
    setFormData({
      ...formData,
      contentBlocks: updatedContentBlocks,
    });
  };

  const uploadImage = async (image) => {
    if (!image) return null;
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (!formData.coverImage) {
        alert("Ảnh bìa là bắt buộc.");
        return;
      }
      const coverImageUrl = await uploadImage(formData.coverImage);
      const contentBlocksUrls = await Promise.all(
        formData.contentBlocks.map(async (block) => {
          let imageUrl = null;
          if (block.image) {
            imageUrl = await uploadImage(block.image);
          }
          return { title: block.title, text: block.text, image: imageUrl };
        })
      );

      await addDoc(collection(db, "blogs"), {
        title: formData.title,
        coverImage: coverImageUrl,
        contentBlocks: contentBlocksUrls,
      });

      toast.success("Dữ liệu đã được lưu thành công!", {
        position: "top-center",
      });
      navigate("/blog");
    } catch (error) {
      console.error("Error saving blog: ", error);
      toast.error("Đã xảy ra lỗi khi lưu dữ liệu", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="w-full h-auto p-5">
      <h1 className="text-2xl font-semibold font-montserrat">
        Thêm vào bài viết
      </h1>
      <form className="mt-5 w-full" onSubmit={handleSave}>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
            Tên bài viết
          </label>
          <input
            name="title"
            required
            className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Thêm vào tên bài viết"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
            Ảnh bìa của bài viết
          </label>
          <input
            name="coverImage"
            required
            className="block font-montserrat p-3 w-full mt-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, coverImage: e.target.files[0] })
            }
          />
        </div>
        {formData.contentBlocks.map((block, index) => (
          <div key={index} className="mt-4">
            <div className="flex flex-col">
              <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
                Tiêu đề nội dung {index + 1}
              </label>
              <input
                name="title"
                className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={`Thêm tiêu đề nội dung ${index + 1}`}
                value={block.title}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
                Nội dung {index + 1}
              </label>
              <textarea
                name="text"
                className="font-montserrat mt-2 block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={`Thêm nội dung ${index + 1}`}
                rows="5"
                value={block.text}
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-montserrat block font-medium text-gray-900 dark:text-white">
                Ảnh mô tả {index + 1}
              </label>
              <input
                name="image"
                className="block font-montserrat p-3 w-full mt-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                onChange={(e) => handleInputChange(e, index)}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddBlock}
          className="font-montserrat mr-3 mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Thêm phần nội dung
        </button>
        <button
          type="submit"
          className="font-montserrat mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Lưu lại
        </button>
      </form>
    </div>
  );
}

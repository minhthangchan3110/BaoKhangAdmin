import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function EditBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [coverImage, setCoverImage] = useState(""); // State cho ảnh bìa
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlog(data);
          setTitle(data.title);
          setContentBlocks(data.contentBlocks || []);
          setCoverImage(data.coverImage || ""); // Lấy ảnh bìa từ dữ liệu
        } else {
          setError("Không tìm thấy bài viết.");
        }
      } catch (err) {
        setError("Lỗi khi tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "blogs", id), {
        title,
        contentBlocks,
        coverImage, // Cập nhật ảnh bìa
      });
      navigate("/blog");
    } catch (err) {
      setError("Lỗi khi cập nhật bài viết.");
    }
  };

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleContentChange = (index, field, value) => {
    const updatedBlocks = [...contentBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setContentBlocks(updatedBlocks);
  };

  const handleAddImage = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedBlocks = [...contentBlocks];
      updatedBlocks[index] = { ...updatedBlocks[index], image: reader.result };
      setContentBlocks(updatedBlocks);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
      const updatedBlocks = [...contentBlocks];
      updatedBlocks[index] = { ...updatedBlocks[index], image: "" };
      setContentBlocks(updatedBlocks);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh bìa này không?")) {
      setCoverImage(""); // Xóa ảnh bìa
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="font-montserrat p-5">
      <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa bài viết</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col mb-4">
          <label className="font-montserrat text-lg font-medium">Ảnh bìa</label>
          {coverImage && (
            <div className="relative mb-4">
              <img
                src={coverImage}
                alt="Ảnh bìa"
                className="w-[300px] mb-4 rounded-lg h-[300px]"
              />
              <button
                type="button"
                onClick={handleRemoveCoverImage}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                X
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">
            Tên bài viết
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">
            Nội dung bài viết
          </label>
          {contentBlocks.map((block, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                value={block.title || ""}
                onChange={(e) =>
                  handleContentChange(index, "title", e.target.value)
                }
                placeholder="Tiêu đề khối nội dung"
                className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100 w-full"
              />
              <textarea
                value={block.text || ""}
                onChange={(e) =>
                  handleContentChange(index, "text", e.target.value)
                }
                placeholder="Nội dung"
                className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100 w-full"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAddImage(index, e.target.files[0])}
                className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100 w-full"
              />
              {block.image && (
                <div className="relative mt-2">
                  <img
                    src={block.image}
                    alt={`Content ${index}`}
                    className="w-[300px] mb-4 rounded-lg h-[300px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setContentBlocks([
                ...contentBlocks,
                { title: "", text: "", image: "" },
              ])
            }
            className="border border-blue-500 px-4 py-2 text-blue-500 rounded-lg hover:bg-blue-100"
          >
            Thêm khối nội dung
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSave}
            type="button"
            className="items-center duration-300 border-green-400 hover:bg-white border font-montserrat px-4 py-2 hover:text-green-400 rounded-lg bg-green-400 text-white"
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => navigate(`/view-blog/${id}`)}
            className="items-center duration-300 border-gray-500 border px-4 py-2 text-gray-500 rounded-lg hover:text-white hover:bg-gray-500"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

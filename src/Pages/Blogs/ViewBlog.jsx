import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ViewBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog(docSnap.data());
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

  const formatContent = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="font-montserrat p-5">
      <h1 className="text-2xl font-semibold mb-4">Thông tin bài đăng</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">
            Tên bài viết
          </label>
          <input
            type="text"
            value={blog.title}
            disabled
            className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="font-montserrat text-lg font-medium">
            Ảnh bìa bài viết
          </label>
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt="Ảnh bìa"
              className="w-[300px] mb-4 rounded-lg h-[300px]"
            />
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-montserrat text-lg font-medium">
            Nội dung bài viết
          </label>
          <div className="border font-montserrat border-gray-500 mt-2 rounded-lg p-2 bg-gray-100">
            {blog.contentBlocks &&
              blog.contentBlocks.map((block, index) => (
                <div key={index} className="mb-4">
                  {block.title && (
                    <h2 className="text-xl font-semibold mb-2">
                      {block.title}
                    </h2>
                  )}
                  {block.text && <div>{formatContent(block.text)}</div>}
                  {block.image && (
                    <img
                      src={block.image}
                      alt={`Content ${index}`}
                      className="w-[300px] mb-4 rounded-lg h-[300px]"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate(`/edit-blog/${id}`)}
            type="button"
            className="items-center duration-300 border-green-400 hover:bg-white border font-montserrat px-4 py-2 hover:text-green-400 rounded-lg bg-green-400 text-white"
          >
            Sửa
          </button>
          <button
            type="button"
            className="items-center duration-300 border-red-500 border px-4 py-2 text-red-500 rounded-lg hover:text-white hover:bg-red-500"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  );
}

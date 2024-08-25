import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  // States to manage password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate new passwords
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    setError(""); // Clear previous errors

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Người dùng không hợp lệ!");

      // Reauthenticate the user to confirm their identity
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);

      // Sign out after password change
      await signOut(auth);

      toast.success(
        "Mật khẩu đã được thay đổi thành công! Vui lòng đăng nhập lại.",
        {
          position: "top-center",
        }
      );

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error(error.message);
      // Handle specific error cases
      let errorMessage = "Đã xảy ra lỗi khi thay đổi mật khẩu.";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Mật khẩu hiện tại không đúng.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Mật khẩu mới quá yếu.";
      }
      toast.error(errorMessage, {
        position: "bottom-center",
      });
      setError(errorMessage);
    }
  };

  return (
    <div className="p-5 w-full">
      <h1 className="font-montserrat text-xl font-semibold">Đổi mật khẩu</h1>
      <form
        onSubmit={handleChangePassword}
        className="w-2/5 mt-4 border-gray-500"
      >
        <div className="flex flex-col">
          <label className="font-montserrat">Mật khẩu hiện tại</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              className="font-montserrat border border-gray-200 rounded-lg mt-2 p-2 w-full"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 mt-2 flex items-center pr-3"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat">Mật khẩu mới</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              className="font-montserrat border border-gray-200 rounded-lg mt-2 p-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 mt-2 flex items-center pr-3"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label className="font-montserrat">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="font-montserrat border border-gray-200 rounded-lg mt-2 p-2 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 mt-2 flex items-center pr-3"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full border bg-blue-500 my-4 px-2 py-3 font-montserrat uppercase rounded-full hover:bg-white hover:text-blue-500 text-white"
        >
          Lưu
        </button>
      </form>
    </div>
  );
}

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TableInfo from "./Pages/Table";
import Home from "./Pages/Home";
import AddProduct from "./Pages/Add";
import Category from "./Pages/Category";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Details from "./Pages/Details";
import Edit from "./Pages/Edit";
import ChangePassword from "./Pages/ChangePassword";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Blog from "./Pages/Blogs/Blog";
import AddBlog from "./Pages/Blogs/AddBlog";
import ViewBlog from "./Pages/Blogs/ViewBlog";
import EditBlog from "./Pages/Blogs/EditBlog";
import InfoTable from "./Pages/Infomation/InfoTable";
import ContactTable from "./Pages/Contact/ContactTable";
import ContactView from "./Pages/Contact/ContactView";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home />}>
          <Route index element={<TableInfo />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="categories" element={<Category />} />
          <Route path="detail/:id" element={<Details />} />
          <Route path="edit/:id" element={<Edit />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="blog" element={<Blog />} />
          <Route path="add-post" element={<AddBlog />} />
          <Route path="view-blog/:id" element={<ViewBlog />} />
          <Route path="edit-blog/:id" element={<EditBlog />} />
          <Route path="info-table" element={<InfoTable />} />
          <Route path="contact-table" element={<ContactTable />} />
          <Route path="contact-view/:id" element={<ContactView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

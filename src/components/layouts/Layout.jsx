import Sidebar from "@components/layouts/sidebar/sidebar.jsx";
import Header from "@components/layouts/header/header.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <div className="flex w-full">
    <Sidebar />
    
    <div className="ml-[20%] w-4/5 min-h-screen">
      <div className="px-6">
        <Header />
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;
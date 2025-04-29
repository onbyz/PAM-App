import Sidebar from "@components/layouts/sidebar/sidebar.jsx";
import Header from "@components/layouts/header/header.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <div className="w-full">
    <div className="flex">
        <div className="hidden md:block md:w-[270px] md:h-screen">
            <Sidebar />
        </div>

        <div className="w-full h-screen px-6">
            <Header />
            <Outlet />
        </div>
        
    </div>
        
  </div>
);

export default Layout;

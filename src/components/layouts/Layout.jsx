import Sidebar from "@components/layouts/sidebar/sidebar.jsx";
import Header from "@components/layouts/header/header.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <div className="w-full">
    <div className="md:flex md:gap-8">
        <div className="hidden md:block md:w-[270px] md:h-[1100px]">
            <Sidebar />
        </div>

        <div className="w-[100%] md:w-[80%] h-full my-10 mx-6 md:mx-0">
            <Header />
            <Outlet />
        </div>
        
    </div>
        
  </div>
);

export default Layout;

import React from 'react';
import Logo from "../../assets/login/PAM Logo.png";
import SettingsIcon from '../../assets/icons/setting.svg';
import LogoutIcon from '../../assets/icons/logout.svg';


const Sidebar = ({ sidebarTitles }) => {
  
  return (
    <div className="w-[20%] flex flex-col sidebar">
      <div>
        <img src={Logo} alt="Logo" className="w-[170px] mt-6" />

        <div className="mt-24">
          {sidebarTitles.map((item, index) => (
            <div  key={index}>
             <a className={`flex gap-2 mt-4 border-r-0 hover:border-r-2 border-green-500 ${
        item.active === 0 ? 'border-r-2 border-green-500' : 'border-r-0'
      }`} href={item.path}> 
      
             <img src={item.icon} alt="icon" className="w-[24px] h-[24px] mt-[3px]" />

             <h6 
      className={`text-[16px] leading-[24px] font-normal transition-colors duration-300 ${
        item.active === 0 ? 'text-[#16A34A] hover:text-[#16A34A]' : 'text-black hover:text-[#16A34A]'
      }`}
    >
                {item.title}
              </h6>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-24">
        <div className="flex gap-2 mt-4">
          <img src={SettingsIcon} alt="Settings" className="w-[24px] h-[24px]" />
          <h6 className="text-[16px] leading-[24px] font-normal"><a href='/settings'>Settings</a></h6>
        </div>

        <div className="flex gap-2 mt-4">
          <img src={LogoutIcon} alt="Logout" className="w-[24px] h-[24px]" />
          <h6 className="text-[16px] leading-[24px] font-normal text-[#FF3B30]"><a href='/logout'>Logout</a></h6>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

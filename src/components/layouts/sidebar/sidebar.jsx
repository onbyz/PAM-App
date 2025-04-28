import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from "@assets/login/PAM Logo.png";
import ClockIcon from "@assets/icons/clock.svg";
import VesselIcon from "@assets/icons/box.svg";
import PortIcon from "@assets/icons/AnchorSimple.svg";
import UserIcon from "@assets/icons/user-octagon.svg";
import RegisterdUserIcon from "@assets/icons/registered-users.svg";
import SettingsIcon from "@assets/icons/setting.svg";
import LogoutIcon from "@assets/icons/logout.svg";
import GreenClockIcon from "@assets/greenIcons/clock.svg";
import GreenVesselIcon from "@assets/greenIcons/box.svg";
import GreenPortIcon from "@assets/greenIcons/AnchorSimple.svg";
import GreenUserIcon from "@assets/greenIcons/user-octagon.svg";
import GreenRegisterdUserIcon from "@assets/greenIcons/registered-users.svg";

export default function Sidebar() {
  const location = useLocation(); 

  const sidebarTitles = [
    { id: "1", icon: ClockIcon, title: "Schedule Management", link: '/schedule-list', activeIcon: GreenClockIcon },
    { id: "2", icon: VesselIcon, title: "Vessel Management", link: "/vessel-management", activeIcon: GreenVesselIcon },
    { id: "3", icon: PortIcon, title: "Port Management", link: "/port-management", activeIcon: GreenPortIcon },
    { id: "4", icon: UserIcon, title: "User Management", link: "/user-management", activeIcon: GreenUserIcon },
    // { id: "5", icon: RegisterdUserIcon, title: "Registered Users", link: "/registered-users", activeIcon: GreenRegisterdUserIcon },
  ];

  return (
    <div className='w-[270px] h-[1100px] bg-[#FCFCFC] px-6 flex flex-col justify-between'>
      <div>
        <Link to="/">
          <img src={Logo} alt='Logo' className='h-[65px] w-[170px] mt-10' />
        </Link>

        <div className='mt-24'>
          {sidebarTitles.map((item, index) => {
            const isActive = location.pathname.startsWith(item.link);

            return (
              <Link to={item.link} key={item.id} className='flex gap-2 mt-4 items-center'>
                <img 
                  src={isActive ? item.activeIcon : item.icon}
                  alt='icon' 
                  className='w-[24px] h-[24px]' 
                />
                <h5 className={`${isActive ? 'text-[#16A34A]' : 'text-black'}`}>
                  {item.title}
                </h5>
              </Link>
            );
          })}
        </div>
      </div>

      <div className='pb-24'>
        <div className='flex gap-2 mt-4'>
          <img src={SettingsIcon} alt='Settings' className='w-[24px] h-[24px]' />
          <h5>Settings</h5>
        </div>

        <div className='flex gap-2 mt-4'>
          <img src={LogoutIcon} alt='Logout' className='w-[24px] h-[24px]' />
          <h5 className='text-[#FF3B30]'>Logout</h5>
        </div>
      </div>
    </div>
  );
}

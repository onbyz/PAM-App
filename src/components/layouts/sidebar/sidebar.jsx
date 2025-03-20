import React from 'react';
import Logo from "@assets/login/PAM Logo.png";
import ClockIcon from "@assets/icons/clock.svg";
import VesselIcon from "@assets/icons/box.svg";
import PortIcon from "@assets/icons/AnchorSimple.svg";
import UserIcon from "@assets/icons/user-octagon.svg";
import SettingsIcon from "@assets/icons/setting.svg";
import LogoutIcon from "@assets/icons/logout.svg";
import { FaBars } from "react-icons/fa6";

export default function Sidebar() {

    const sidebarTitles = [
        {id : "1", icon: ClockIcon, title : "Schedule Management" },
        {id : "2", icon: VesselIcon, title : "Vessel Management" },
        {id : "3", icon: PortIcon, title : "Port Management" },
        {id : "4", icon: UserIcon, title : "User Management" },
    ]

    return (
        <div>
            <div className='w-[270px] h-[1100px] bg-[#FCFCFC] px-6 flex flex-col justify-between'>
                <div>
                    <a href="/">
                        <img src={Logo} alt='Logo' className='h-[65px] w-[170px]' />
                    </a>

                    {/* <FaBars /> */}
        
                    <div className='mt-24'>
                        {sidebarTitles.map((item, index) => (
                            <div className='flex gap-2 mt-4' key={index}>
                                <img src={item.icon} alt='icon' className='w-[24px] h-[24px] mt-[3px]' />
                                <h6 className={`text-[16px] leading-[24px] font-normal ${index === 0 ? 'text-[#16A34A]' : 'text-black'}`}>
                                    {item.title}
                                </h6>
                            </div>
                        ))}
                    </div>
                </div>
    
                <div className='pb-24'>
                    <div className='flex gap-2 mt-4'>
                        <img src={SettingsIcon} alt='Settings' className='w-[24px] h-[24px]' />
                        <h6 className='text-[16px] leading-[24px] font-normal'>Settings</h6>
                    </div>
        
                    <div className='flex gap-2 mt-4'>
                        <img src={LogoutIcon} alt='Logout' className='w-[24px] h-[24px]' />
                        <h6 className='text-[16px] leading-[24px] font-normal text-[#FF3B30]'>Logout</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React from 'react';
// import BellIcon from "@assets/icons/bell.svg";
// import SearchIcon from "@assets/icons/search.svg";
import Avatar from "@assets/icons/avatar.png";
import { FaChevronDown } from "react-icons/fa6";
import { User } from 'lucide-react';

export default function Header() {
    const user = JSON.parse(localStorage.getItem('user'));
    return (
        <div className='flex justify-between mt-4'>
            <h3 className='leading-[150%]'>Welcome, {user?.firstName}</h3>

            <div className='flex gap-6'>
                {/* <img src={SearchIcon} alt="Icon" className='w-[24px] h-[24px]' /> */}
                {/* <img src={BellIcon} alt="Icon" className='w-[24px] h-[24px]' /> */}

                <div className='flex gap-2'>
                    <div className="bg-gray-100 w-[24px] h-[24px] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                    </div>
                
                    <p className='text-[16px] leading-[24px] flex gap-3 mr-2'>
                        {user?.firstName} {user?.lastName}
                    </p>
                </div>
            </div>
        </div>
    )
}

import React from 'react';
import BellIcon from "@assets/icons/bell.svg";
import SearchIcon from "@assets/icons/search.svg";
import Avatar from "@assets/icons/avatar.png";
import { FaChevronDown } from "react-icons/fa6";

export default function Header() {
    return (
        <div className='flex justify-between'>
            <h3 className='leading-[150%]'>Welcome, Joel</h3>

            <div className='flex gap-6'>
                <img src={SearchIcon} alt="Icon" className='w-[24px] h-[24px]' />
                <img src={BellIcon} alt="Icon" className='w-[24px] h-[24px]' />

                <div className='flex gap-2'>
                    <img src={Avatar} alt="Icon" className='w-[24px] h-[24px]' />
                
                    <p className='text-[16px] leading-[24px] flex gap-3'>
                        Joel Sebastian
                        <FaChevronDown className='w-[12px] h-[24px]' />
                    </p>
                </div>
            </div>
        </div>
    )
}

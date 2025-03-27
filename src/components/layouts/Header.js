// src/components/Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import BellIcon from "../../assets/icons/bell.svg";
import SearchIcon from "../../assets/icons/search.svg";
import Avatar from "../../assets/icons/avatar.png";
import { FaXmark, FaChevronDown, FaCalendar } from "react-icons/fa6";


const Header = ({pageTitle}) => {
  const navigate = useNavigate();
const handleGoBack = () => {
  navigate(-1);  // -1 goes back to the previous page
};
  return (
    <header>
      <div className='flex justify-between mb-20'>
       {/* <h3 className='text-[28px] leading-[150%] font-medium'>Welcome, Joel</h3> */}
       <h1 className='text-h1'>Welcome, Joel</h1>
           

            <div className='flex gap-6'>
              <img src={SearchIcon} alt="Icon" className='w-[24px] h-[24px]' />
              <img src={BellIcon} alt="Icon" className='w-[24px] h-[24px]' />

              <div className='flex gap-2'>
                <img src={Avatar} alt="Icon" className='w-[24px] h-[24px]' />
              
                <p className='text-[16px] leading-[24px] font-normal flex gap-3'>
                  Joel Sebastian
                  <FaChevronDown className='w-[12px] h-[24px]' />
                </p>
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-between border-b-[1px] border-[#B6A9A9] pb-2'>
            {/* <h2 className='text-[26px] leading-[56px] font-medium'>{pageTitle}</h4> */}
            <h2 className='text-h2'>{pageTitle}</h2>

            {/* <button onClick={handleGoBack} className='w-[116px] h-[40px] bg-[#16A34A] rounded-md text-white font-medium text-[14px] flex justify-center items-center gap-2 '> 
              <FaXmark className='mt-[2px]'/>
              Close
            </button> */}
            <button onClick={handleGoBack} className='primary_btn close_btn'> 
              <FaXmark className='mt-[2px]'/>
              Close
            </button>
          </div>
    </header>
  );
};

export default Header;

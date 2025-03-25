import React from 'react'
import { Link } from 'react-router-dom';

export default function Homepage() {
    return (
        <div>
            <div className='flex flex-col justify-center items-center h-screen'>
                <p className='text-[36px] leading-[40px] font-semibold'>Hello World!</p>
                
                <div className='flex gap-10 mt-8'>
                    <Link to='/login' className='hover:text-blue-500 hover:underline text-[20px]'>Login</Link>

                    <Link to='/create-schedule' className='hover:text-blue-500 hover:underline text-[20px]'>Create Schedule</Link>
                </div>  

                <Link to='schedule-list' className='hover:text-blue-500 hover:underline text-[20px] mt-6'>Schedule List</Link>
            </div>
        </div>
    )
}

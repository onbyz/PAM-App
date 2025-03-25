import React from 'react'

export default function Homepage() {
    return (
        <div>
            <div className='flex flex-col justify-center items-center h-screen'>
                <p className='text-[36px] leading-[40px] font-semibold'>Hello World!</p>
                
                <div className='flex gap-10 mt-8'>
                    <a href='/login' className='hover:text-blue-500 hover:underline text-[20px]'>Login</a>

                    <a href='/create-schedule' className='hover:text-blue-500 hover:underline text-[20px]'>Create Schedule</a>
                </div>  

                <a href='schedule-list' className='hover:text-blue-500 hover:underline text-[20px] mt-6'>Schedule List</a>
            </div>
        </div>
    )
}

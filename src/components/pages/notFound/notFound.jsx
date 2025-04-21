import React from 'react';
import NotFoundImg from '@assets/404.png';
import { Link } from 'react-router-dom';

export default function NotFound() {

    return (
        <div className='flex flex-col justify-center items-center gap-4 min-h-screen'>
            
            <img src={NotFoundImg} alt='Banner'/>

            <div>
                <Link to={'/'}>
                    <button class="bg-blue-900 text-white font-bold uppercase px-6 py-2 rounded-full">
                        Go Home
                    </button>
                </Link>
            </div>
        </div>
    );
} 

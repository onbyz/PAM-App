import React from 'react';
import Logo from "../../../assets/login/PAM Logo.png";

export default function Login() {
  return (
    <div className="flex h-full w-[70%] my-[10%] mx-[15%] bg-[#F1F5F6]">
      {/* Left Section - Form */}
      <div className="flex flex-col justify-center items-center w-1/2 p-8">
        <img src={Logo} alt="Pam Cargo Logo" className="w-40 mb-8" />

        <h1 className="text-3xl font-semibold mb-6">Hello, Welcome</h1>

        <form className="w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2" >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="joelsebastian@pamcargo.com"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="****************"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center">
                👁️
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Login →
          </button>

          <p className="mt-4 text-center">
            <a href="/forgot-password" className="text-green-600 hover:underline">
              Forgot Password?
            </a>
          </p>
        </form>
      </div>

      {/* Right Section - Image */}
      <div className="w-1/2 hidden lg:flex items-center justify-center bg-gray-100">
        <img
          src="/cargo-container.png"
          alt="Form Img"
          className="max-w-md"
        />
      </div>
    </div>
  );
} 

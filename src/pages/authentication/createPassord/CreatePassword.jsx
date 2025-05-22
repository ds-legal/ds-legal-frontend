import React from 'react';
import Logo from "../../../assets/logo-color.png";

const CreatePassword = () => {
  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-50 px-4 overflow-hidden'>
      <div className='w-full lg:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md overflow-hidden'>
        {/* Logo */}
        <div className='flex justify-start mb-6'>
          <img src={Logo} alt='logo' className='h-10 w-10' />
        </div>

        {/* Heading */}
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-[4xl] font-semibold text-[#101928] mb-2'>
          Create New Password
        </h1>

        {/* Input */}
        <div className='mb-4'>
          <label className='block text-sm text-[#645D5D] mb-2'>
            Password
          </label>
          <input
            type='email'
            className='lg:w-full w-[70%] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1983D5]'
            placeholder='you@example.com'
          />
        </div>

        {/* Continue Button */}
        <button className='lg:w-full w-[70%] py-3 bg-[#1983D5] text-white font-semibold rounded-full hover:bg-[#1570B5] transition'>
          Continue
        </button>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-6 text-sm text-[#545454]">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;

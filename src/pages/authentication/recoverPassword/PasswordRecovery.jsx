import React, { useState } from 'react';
import { resetPassword } from '../../../api/auth_api';
import PasswordModal from '../../../components/common/PasswordModal';
import LogoColor from '../../../components/common/LogoColor';
import toast from 'react-hot-toast';

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [showModal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setModal(true)
    setLoading(true)
    try {
        const response = await resetPassword(email);
        console.log("response", response)
      if(response.message === "Password reset link sent successfully"){
        setLoading(false)
        setUrl(response.data.reset_link)
        setModal(true)
      }else{
        toast.error(response.detail)
      }  
    } catch (error) {
       console.log("failed")
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-4 sm:py-8'>
      <div className='w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border'>
        {/* Logo */}
        <div className='flex justify-center mb-6 sm:mb-8'>
          <LogoColor />
        </div>
        
        {/* Heading */}
        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 text-center mb-2'>
          Recover Password
        </h1>

        {/* Description */}
        <p className='text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8'>
          Enter your email to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
              placeholder='email@dslegal.com'
              required
            />
          </div>

          {/* Continue Button */}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base'
          >
            {loading ? (
              <div className="spinner border-white"></div>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </div>
      
      {showModal && (
        <PasswordModal
          url={url}
          setModal={setModal}
        />
      )}
    </div>
  );
};

export default PasswordRecovery;

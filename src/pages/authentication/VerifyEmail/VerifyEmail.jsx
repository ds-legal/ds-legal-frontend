import React, { useState } from 'react';
import { verifyEmail } from '../../../api/auth_api';
import PasswordModal from '../../../components/common/PasswordModal';
import LogoColor from '../../../components/common/LogoColor';

const VerifyMail = () => {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [showModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verifyEmail(email);
      if (response.status_code === 200) {
        setUrl(response.data['Email-link']);
        setModal(true);
      }
    } catch (error) {
      console.log('Error verifying email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-4 sm:py-8'>
      <div className='w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border'>
        {/* Logo */}
        <div className='flex justify-center mb-6 sm:mb-8 auth-logo'>
              <div className="auth-logo">
                <LogoColor />
              </div>
        </div>

        {/* Heading */}
        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 text-center mb-2'>
          Verify Your Email
        </h1>

        {/* Description */}
        <p className='text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8'>
          Please enter your email address to receive a verification link.
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
              placeholder='you@example.com'
              required
            />
          </div>

          {/* Submit Button */}
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

      {/* Modal */}
      {showModal && (
        <PasswordModal
          setModal={setModal}
          url={url}
        />
      )}
    </div>
  );
};

export default VerifyMail;

import React, { useEffect, useState } from 'react';
import { changePassword } from '../../../api/auth_api';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import LogoColor from '../../../components/common/LogoColor';

const CreatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordCriteriaMet, setPasswordCriteriaMet] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const extractedToken = queryParams.get('token');
    setToken(extractedToken);
  }, [location.search]);

  useEffect(() => {
    const criteria = [
      /\d/.test(newPassword),                           // has number
      /[A-Z]/.test(newPassword),                        // has uppercase
      /[a-z]/.test(newPassword),                        // has lowercase
      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),       // has special character
      newPassword.length >= 8                           // has minimum length
    ];
    
    const countMet = criteria.filter(Boolean).length;
    setPasswordCriteriaMet(countMet);
  }, [newPassword]);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true)
    try {
      const response = await changePassword({
        new_password: newPassword,
        confirm_password: confirmPassword,
        token: token,
      });

      if (response.status_code === 200) {
         setLoading(false)
        toast.success("Password changed successfully!");
       
        navigate("/login");
      } else {
        toast.error(response.detail);
      }
    } catch (error) {
      toast.error("Failed to change password.");
      console.error("error", error);
    }finally{
       setLoading(false)
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-4 sm:py-8'>
      <div className='w-full max-w-sm sm:max-w-md bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm border'>
        {/* Logo */}
        <div className='flex justify-center mb-6 sm:mb-8 auth-logo'>
          <LogoColor />
        </div>

        {/* Heading */}
        <h1 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 text-center mb-6 sm:mb-8'>
          Create New Password
        </h1>

        {/* New Password */}
        <div className='space-y-4 sm:space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
            <div className='relative'>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
                placeholder='**********'
              />
              <span
                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500'
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>

            {/* Strength Bar */}
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    idx < passwordCriteriaMet ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Strength Rules */}
            <ul className="text-xs sm:text-sm text-gray-600 mt-4 space-y-1">
              <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>one number</li>
              <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>one uppercase letter</li>
              <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>one lowercase letter</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600' : ''}>A special character (!@#$%^&*)</li>
            </ul>
          </div>

          {/* Confirm Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base'
                placeholder='Confirm your new password'
              />
              <span
                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500'
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className='w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6 sm:mt-8 text-sm sm:text-base'
        >
          {loading ? (
            <div className="spinner border-white"></div>
          ) : (
            <span>Next</span>
          )}
        </button>

        {/* Footer links */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;

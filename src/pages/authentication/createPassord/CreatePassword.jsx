import React, { useEffect, useState } from 'react';
import Logo from "../../../assets/logo-color.png";
import { changePassword } from '../../../api/auth_api';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
       setLoading(true)
    }
  };

  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-50 px-4 overflow-hidden'>
      <div className='w-full lg:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md overflow-hidden'>

        {/* Logo */}
        <div className='flex justify-start mb-6'>
          <img src={Logo} alt='logo' className='h-10 w-10' />
        </div>

        {/* Heading */}
        <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-[#101928] mb-6'>
          Create New Password
        </h1>

        {/* New Password */}
        <div className='mb-4'>
          <label className='text-sm text-[#645D5D] mb-2'>New Password</label>
          <div className='relative'>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1983D5] pr-10'
              placeholder='Enter your new password'
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          {/* Strength Bar */}
          <div className="flex justify-start gap-1 mt-2 mb-2">
            {[...Array(5)].map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-4 rounded-full transition-all duration-300 ${
                  idx < passwordCriteriaMet ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Strength Rules */}
          <ul className="text-sm text-gray-500 list-disc ml-5 space-y-1">
            <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>At least one number</li>
            <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>At least one uppercase letter</li>
            <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>At least one lowercase letter</li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-green-600' : ''}>At least one special character</li>
            <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>Minimum of 8 characters</li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div className='mb-6'>
          <label className='text-sm text-[#645D5D] mb-2'>Confirm Password</label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1983D5] pr-10'
              placeholder='Confirm your new password'
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className='w-full py-3 bg-[#1983D5] text-white font-semibold rounded-full hover:bg-[#1570B5] transition'
        >
          {
            loading ?  <div className="spinner border-white"></div> : <><span>Continue</span></>
          }
          
        </button>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-6 text-sm text-[#545454]">
          <span className="cursor-pointer hover:underline">Help</span>
          <span className="cursor-pointer hover:underline">Privacy</span>
          <span className="cursor-pointer hover:underline">Terms</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;

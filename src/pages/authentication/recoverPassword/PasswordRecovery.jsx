import React, { useState } from 'react';
import Logo from "../../../assets/logo-color.png";
import { resetPassword } from '../../../api/auth_api';
import PasswordModal from '../../../components/common/PasswordModal';
import toast from 'react-hot-toast';

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [showModal, setModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    // console.log("email", email)
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
    <div className='h-screen w-full flex items-center justify-center bg-gray-50 px-4 overflow-hidden'>
      <div className='w-full lg:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md overflow-hidden'>
        {/* Logo */}
        <div className='flex justify-start mb-6'>
          <img src={Logo} alt='logo' className='h-10 w-10' />
        </div>
        {/* Heading */}
        <h1 className='text-xl sm:text-2xl md:text-3xl font-semibold text-[#101928] mb-2'>
          Recover Password
        </h1>

        {/* Paragraph */}
        <p className='text-sm sm:text-base text-[#645D5D] mb-6'>
          Enter your email to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='text-sm text-[#645D5D] mb-2'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1983D5]'
              placeholder='you@example.com'
              required
            />
          </div>

          {/* Continue Button */}
          <button
            type='submit'
            className='w-full py-3 bg-[#1983D5] text-white font-semibold rounded-full hover:bg-[#1570B5] transition'
          >
            {
              loading  ?   <div className="spinner border-white"></div> :<>Continue</>
            }
       
          </button>
        </form>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-6 text-sm text-[#545454]">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
      {
        showModal &&(
          <PasswordModal
          url={url}
          setModal={setModal}/>
        )
      }
    </div>
  );
};

export default PasswordRecovery;

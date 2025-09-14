import React from 'react';
import mail from "../../assets/email.png";
import { UseAuth } from '../../store/auth.context';
import { Link, useNavigate, useNavigation } from 'react-router-dom';

const PasswordModal = ({ setModal,url}) => {
    console.log("url", url)
  const { user } = UseAuth();
  const navigation = useNavigate()

  const closeModal = () => {
    setModal(false);
    navigation("/createPassword")
  };
  const redirect =  () => {
    setModal(false);
    navigation("/auth/verify/forget-password")
  }

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white w-[90%] max-w-lg px-6 py-20 rounded-[40px] shadow-xl text-center">

        {/* Close Icon */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Email Icon */}
        <div className="flex justify-center mb-4">
          <img src={mail} alt="Email icon" className="h-16 w-16" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-3 text-[#101928]">Email Sent</h2>

        {/* Message */}
        <h3 className="text-[#101928] mb-2 text-[20px] lg:text-[30px] leading-10">
          We have sent an email verification to your mailbox
        </h3>
        <h5 className="text-[14px] text-[#645D5D] mt-2 mb-2">
          click the link sent to
          <span className="text-[#1983D5]"> snrlawyer@dslegal.com</span>
        </h5>

        {/* OK Button */}
        <Link
          to={url}
          className="bg-[#1983D5] mt-10 text-white text-[16px] w-full flex items-center justify-center px-6 py-4 rounded-[40px] hover:bg-[#1570B5] transition"
          
        >
          Open email
        </Link>

        {/* Footer Text */}
        <h3 className="text-[#645D5D] text-[14px] font-[400] mt-4">
          Didn't receive an email?
          <span onClick={redirect}  className="text-[#1983D5] cursor-pointer font-[500] ml-1">Resend</span>
        </h3>
      </div>
    </div>
  );
};

export default PasswordModal;

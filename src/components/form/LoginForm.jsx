import React, { useState } from 'react';
import logo from "../../assets/logo-color.png";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";
import { UseAuth } from '../../store/auth.context';
import toast from 'react-hot-toast';
import { FastForwardIcon } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {LoginUser } = UseAuth()
  const [Error, setErrors] = useState(false)
  const [isLoading, setILoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async(data) => {
    // console.log("Form data:", data);
     setILoading(true)
    try { 
     const response = await LoginUser(data)
     if(response.status_code === 200){
      setILoading(false)
       toast.success(response.message)
       navigate("/")
       setErrors(false) 
       
     }else{
      setILoading(false)
      toast.error(response.detail)
      setErrors(true) 
     }  

    } catch (error) {
      setILoading(false)
      console.log("failed to login", error)
      
    }finally{
      setILoading(false)
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="w-full h-full px-6 py-6 lg:px-16 lg:py-10 max-w-[600px] mx-auto">
      <img src={logo} alt="logo" className="w-10 h-auto mb-4" />
      <h1 className="text-[28px] lg:text-[48px] text-[#101928] font-[500] leading-[36px] lg:leading-[52px] mb-4">
        Login to continue your legal journey.
      </h1>
      <h5 className="text-[#645D5D] text-[14px] font-[400] mb-6">
        Don’t have an account?{" "}
        <Link className="text-[#1983D5]" to="#">Sign up</Link>
      </h5>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="flex flex-col">
          <label className="text-[14px] font-medium mb-2">Email Address</label>
          <input
            type="email"
            {...register("email")}
            className={`border rounded-[6px] p-2 bg-white w-full py-3 text-sm ${errors.email || Error ? "border-red-500" : "border-[#D0D5DD]"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
            {  Error && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col relative">
          <label className="text-[14px] font-medium mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`border px-2 py-3 text-sm bg-white w-full rounded-md ${errors.password || Error ? "border-red-500" : "border-gray-300"}`}
          />
          <span
            className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
           {Error && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full px-2 py-3 rounded-[40px] text-white text-sm font-semibold transition ${
            hasErrors ? "bg-red-500" : "bg-[#1983D5] hover:bg-[#157BCB]"
          }`}
        >
          {
            isLoading ? (
              <div className="spinner border-white"></div>
            ):(
             <span>Sign In</span>
            )
          }
        
        </button>
      </form>

      {/* Forgot Password */}
      <h5 className="text-center text-[14px] mt-4 text-[#645D5D] font-[400]">
        Forgot Password? <Link to="/password" className="text-[#1983D5]">Reset</Link>
      </h5>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-4 text-gray-500 text-sm font-medium">or</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        className="w-full px-2 py-3 rounded-[40px] bg-white border border-gray-300 flex items-center justify-center gap-2 text-[#101928] text-sm font-semibold hover:bg-gray-50 transition"
      > {}
        <SiGoogle className="h-4 w-4 text-[#DB4437]" />
        Continue with Google
      </button>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-[#545454]">
        <span>Help</span>
        <span>Privacy</span>
        <span>Terms</span>
      </div>
    </div>
  );
};

export default LoginForm;

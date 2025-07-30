import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { UseAuth } from '../../store/auth.context';
import toast from 'react-hot-toast';
import LogoColor from '../common/LogoColor';

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
     setILoading(true)
    try { 
     const response = await LoginUser(data)
     if(response.status_code === 200){
      setILoading(false)
       toast.success(response.message)
       navigate("/dashboard")
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
    <div className="w-full max-w-sm sm:max-w-md px-2 sm:px-4 lg:px-0">
      {/* Logo */}
      <div className="mb-6 sm:mb-8">
        <LogoColor />
      </div>
      
      {/* Heading */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
        Login to continue your legal journey.
      </h1>
      
      {/* Sign up link */}
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
        Don't have an account?{" "}
        <Link className="text-blue-600 hover:underline" to="/signup">Sign Up</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            {...register("email")}
            placeholder="emai@dslegal.com"
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.email || Error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
          )}
          {Error && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            {...register("password")}
            placeholder="********"
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
              errors.password || Error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>
          )}
          {Error && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="spinner border-white"></div>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Forgot Password */}
      <div className="text-center mt-4 sm:mt-6">
        <span className="text-xs sm:text-sm text-gray-600">Forgot Password? </span>
        <Link to="/password" className="text-blue-600 hover:underline text-xs sm:text-sm">Reset</Link>
      </div>

      {/* Divider */}
      <div className="flex items-center my-4 sm:my-6">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm">Or</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-4 sm:w-5 h-4 sm:h-5"
        />
        <span className="text-gray-700 font-medium text-sm sm:text-base">Google</span>
      </button>

      {/* Footer Links */}
      <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
        <a href="#" className="hover:underline">Help</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
      </div>
    </div>
  );
};

export default LoginForm;

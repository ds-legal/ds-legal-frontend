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
  const {LoginUser, handleGoogleSignIn } = UseAuth()
  const [Error, setErrors] = useState(false)
  const [isLoading, setILoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
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

  const handleGoogleSignInClick = async () => {
    setIsGoogleLoading(true);
    try {
      await handleGoogleSignIn();
    } catch (error) {
      toast.error('Failed to sign in with Google');
      console.log('Google sign-in error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10">
      {/* Logo */}
      <div className="mb-8 sm:mb-10 auth-logo">
        <LogoColor />
      </div>
      
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">
        Welcome Back
      </h1>
      
      <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10">
        Login to continue your legal journey
      </p>
      
      {/* Sign up link */}
      <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
        Don't have an account?{" "}
        <Link className="text-blue-600 hover:underline font-medium" to="/signup">Sign Up</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        {/* Email Field */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-3">Email Address</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            {...register("email")}
            placeholder="email@dslegal.com"
            className={`w-full px-4 sm:px-5 py-4 sm:py-5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg ${
              errors.email || Error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm sm:text-base mt-2">{errors.email.message}</p>
          )}
          {Error && (
            <p className="text-red-500 text-sm sm:text-base mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <label className="block text-base font-medium text-gray-700 mb-3">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            {...register("password")}
            placeholder="********"
            className={`w-full px-4 sm:px-5 py-4 sm:py-5 pr-14 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg ${
              errors.password || Error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            className="absolute right-4 top-[52px] cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={24} /> : <FiEye size={24} />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm sm:text-base mt-2">{errors.password.message}</p>
          )}
          {Error && (
            <p className="text-red-500 text-sm sm:text-base mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-base sm:text-lg"
        >
          {isLoading ? (
            <div className="spinner border-white"></div>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Forgot Password */}
      <div className="text-center mt-6 sm:mt-8">
        <span className="text-sm sm:text-base text-gray-600">Forgot Password? </span>
        <Link to="/password" className="text-blue-600 hover:underline text-sm sm:text-base font-medium">Reset</Link>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6 sm:my-8">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="px-4 sm:px-6 text-gray-500 text-sm sm:text-base">Or</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignInClick}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-4 border border-gray-300 py-4 sm:py-5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <div className="spinner border-gray-600"></div>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 sm:w-6 h-5 sm:h-6"
            />
            <span className="text-gray-700 font-medium text-base sm:text-lg">Continue with Google</span>
          </>
        )}
      </button>

      {/* Footer Links */}
      <div className="flex justify-center gap-6 sm:gap-8 mt-8 sm:mt-10 text-sm sm:text-base text-gray-500">
        <a href="#" className="hover:underline">Help</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Terms</a>
      </div>
    </div>
  );
};

export default LoginForm;

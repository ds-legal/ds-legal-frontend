import { useState, useEffect } from "react";
import img1 from "../../../assets/authImg.jpg";
import user from "../../../assets/loginuser.png";
import LogoWhite from "../../../components/common/LogoWhite";
import LogoColor from "../../../components/common/LogoColor";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ArrowLeft, Check, X } from "lucide-react";
import { UseAuth } from "../../../store/auth.context";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
    const [currentStep, setCurrentStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
     const {RegisterUser, handleGoogleSignIn} = UseAuth()
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });
   const navigate = useNavigate()
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case "email":
                if (!value) return "Email is required";
                if (!/\S+@\S+\.\S+/.test(value))
                    return "Please enter a valid email";
                return "";
            case "firstName":
                return !value.trim() ? "First name is required" : "";
            case "lastName":
                return !value.trim() ? "Last name is required" : "";
            case "password":
                if (!value) return "Password is required";
                if (value.length < 8)
                    return "Password must be at least 8 characters";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, formData[name]),
        }));
    };

    const validateStep1 = () => {
        const newTouched = {
            email: true,
            firstName: true,
            lastName: true,
        };
        setTouched(newTouched);

        const newErrors = {
            email: validateField("email", formData.email),
            firstName: validateField("firstName", formData.firstName),
            lastName: validateField("lastName", formData.lastName),
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const isStep1Valid = () => {
        return (
            formData.email.trim() !== "" &&
            formData.firstName.trim() !== "" &&
            formData.lastName.trim() !== "" &&
            !errors.email &&
            !errors.firstName &&
            !errors.lastName
        );
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate password
        const passwordError = validateField("password", formData.password);
        if (passwordError) {
            setErrors((prev) => ({ ...prev, password: passwordError }));
            return;
        }
           setIsSubmitting(true);
         try {
            const response =  await  RegisterUser(formData)
         if(response.status_code === 201){
             setIsSubmitting(false);
            toast.success(response.message);  
            navigate("/verifyEmail")    
         }else{
          toast.error(response.detail);  
         }
            
         } catch (error) {
        console.log("Failed to login") 
         }{
         setIsSubmitting(false)
         }

       
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleGoogleSignInClick = async () => {
        setIsGoogleLoading(true);
        try {
            await handleGoogleSignIn();
        } catch (error) {
            toast.error('Failed to sign up with Google');
            console.log('Google sign-up error:', error);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const passwordChecks = {
        number: /\d/.test(formData.password),
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        special: /[!@#$%^&*]/.test(formData.password),
    };

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: "Very Weak",
        color: "bg-red-500",
        textColor: "text-red-600",
    });

    useEffect(() => {
        const strengthLevels = [
            {
                message: "Very Weak",
                color: "bg-red-500",
                textColor: "text-red-600",
            },
            {
                message: "Weak",
                color: "bg-orange-500",
                textColor: "text-orange-500",
            },
            {
                message: "Moderate",
                color: "bg-yellow-500",
                textColor: "text-yellow-500",
            },
            {
                message: "Strong",
                color: "bg-blue-500",
                textColor: "text-blue-500",
            },
            {
                message: "Very Strong",
                color: "bg-green-500",
                textColor: "text-green-600",
            },
        ];

        const calculateStrength = () => {
            let score = 0;
            if (formData.password.length >= 8) score++;
            if (formData.password.match(/[A-Z]/)) score++;
            if (formData.password.match(/[0-9]/)) score++;
            if (formData.password.match(/[^A-Za-z0-9]/)) score++;

            // Ensure score doesn't exceed array bounds
            score = Math.min(score, strengthLevels.length - 1);
            setPasswordStrength(strengthLevels[score]);
        };

        if (formData.password) calculateStrength();
        else setPasswordStrength(strengthLevels[0]);
    }, [formData.password]);

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Promotional Section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src={img1}
                    className="w-full h-full object-cover"
                    alt="Signup"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
                    {/* Logo */}
                    <div className="mt-6 lg:mt-8">
                        <LogoWhite />
                    </div>
                    
                    {/* Main content */}
                    <div className="flex-1 flex flex-col justify-center">
                        <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-4 lg:mb-6">
                            Streamline your legal practice with DS Legal
                        </h1>
                        <p className="text-gray-200 text-sm sm:text-base lg:text-lg opacity-95 leading-relaxed">
                            A lightweight admin companion for legal teams — manage appointments, tasks and invoices securely and efficiently.
                        </p>
                    </div>
                    
                    {/* Testimonial / highlight */}
                    <div className="bg-black/40 backdrop-blur-sm p-4 lg:p-6 mb-6 lg:mb-8">
                        <p className="text-gray-200 text-sm lg:text-base mb-3 lg:mb-4">
                            Used by attorneys to reduce admin time and keep client data organized and secure.
                        </p>
                        <div className="flex items-center gap-3">
                            <img src={user} alt="user" className="h-10 w-10 lg:h-12 lg:w-12 rounded-full" />
                            <div>
                                <h5 className="text-white font-medium text-sm lg:text-base">Joan Doe</h5>
                                <p className="text-gray-300 text-xs lg:text-sm">CEO, DS Legal</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Pagination dots */}
                    <div className="flex gap-2 mb-6 lg:mb-8">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            </div>
            
            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-4 lg:p-8">
                <div className="w-full max-w-sm sm:max-w-md">
                    {currentStep === 1 ? (
                        <>
                            {/* Logo */}
                            <div className="mb-6 sm:mb-8 auth-logo">
                                <LogoColor />
                            </div>
                            
                            {/* Heading */}
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                                Create Account
                            </h1>
                            
                            {/* Sign in link */}
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                Do you have an account already?{" "}
                                <Link className="text-blue-600 hover:underline" to="/login">
                                    Sign In
                                </Link>
                            </p>

                            <form onSubmit={handleNext} className="space-y-4 sm:space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="Jonsnow@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.email && touched.email && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        autoComplete="given-name"
                                        placeholder="Jon"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                                            errors.firstName
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        autoComplete="family-name"
                                        placeholder="Snow"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                                            errors.lastName
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Next Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isStep1Valid()}
                                    className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {isSubmitting ? (
                                        <div className="spinner border-white"></div>
                                    ) : (
                                        <span>Next</span>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center my-4 sm:my-6">
                                    <div className="flex-grow h-px bg-gray-300" />
                                    <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm">Or</span>
                                    <div className="flex-grow h-px bg-gray-300" />
                                </div>

                                {/* Google Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignInClick}
                                    disabled={isGoogleLoading}
                                    className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGoogleLoading ? (
                                        <div className="spinner border-gray-600"></div>
                                    ) : (
                                        <>
                                            <img
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                alt="Google"
                                                className="w-4 sm:w-5 h-4 sm:h-5"
                                            />
                                            <span className="text-gray-700 font-medium text-sm sm:text-base">Continue with Google</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer Links */}
                            <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500">
                                <a href="#" className="hover:underline">Help</a>
                                <a href="#" className="hover:underline">Privacy</a>
                                <a href="#" className="hover:underline">Terms</a>
                            </div>
                        </>
                    ) : (
                        <div className="w-full">
                            <button
                                onClick={handleBack}
                                className="text-gray-500 hover:text-blue-500 mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                            
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                                Create password
                            </h1>
                            
                            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                                Do you have an account already?{" "}
                                <Link className="text-blue-600 hover:underline" to="/login">
                                    Sign In
                                </Link>
                            </p>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {/* Password Field */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        autoComplete="new-password"
                                        placeholder="**********"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    <span
                                        className="absolute right-3 top-[42px] cursor-pointer text-gray-500"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={18} />}
                                    </span>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Password Strength */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm mb-2">
                                        <span>Strength:</span>
                                        <span className={`font-medium ${passwordStrength.textColor}`}>
                                            {passwordStrength.message}
                                        </span>
                                    </div>

                                    {formData.password && (
                                        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                                            <li className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : ''}`}>
                                                {passwordChecks.number ? <Check size={12} /> : <X size={12} />}
                                                <span>one number</span>
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordChecks.upper ? 'text-green-600' : ''}`}>
                                                {passwordChecks.upper ? <Check size={12} /> : <X size={12} />}
                                                <span>one uppercase letter</span>
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordChecks.lower ? 'text-green-600' : ''}`}>
                                                {passwordChecks.lower ? <Check size={12} /> : <X size={12} />}
                                                <span>one lowercase letter</span>
                                            </li>
                                            <li className={`flex items-center gap-2 ${passwordChecks.special ? 'text-green-600' : ''}`}>
                                                {passwordChecks.special ? <Check size={12} /> : <X size={12} />}
                                                <span>A special character (!@#$%^&*)</span>
                                            </li>
                                        </ul>
                                    )}
                                </div>

                                {/* Terms Agreement */}
                                <div className="flex items-start space-x-3 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={() => setAgreed(!agreed)}
                                        className="mt-1 cursor-pointer flex-shrink-0"
                                        required
                                    />
                                    <span className="leading-tight">
                                        I agree to DS Legal's Consumer{" "}
                                        <a
                                            href="#"
                                            className="text-blue-600 underline"
                                        >
                                            Terms and Usage Policy
                                        </a>{" "}
                                        and acknowledge our{" "}
                                        <a
                                            href="#"
                                            className="text-blue-600 underline"
                                        >
                                            Privacy Policy
                                        </a>
                                    </span>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !agreed}
                                    className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {isSubmitting ? (
                                        <div className="spinner border-white"></div>
                                    ) : (
                                        <span>Next</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Signup;

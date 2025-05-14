import { useState, useEffect } from "react";
import img1 from "../../../assets/authImg.jpg";
import LogoWhite from "../../../components/common/LogoWhite";
import logo from "../../../assets/logo-color.png";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";

function Signup() {
    const [currentStep, setCurrentStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            console.log("Form submitted:", formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
        <div className="grid sm:mx-20 grid-cols-1 px-2 py-6 sm:px-8 sm:py-8 bg-white lg:grid-cols-2 justify-center min-h-screen">
            <div
                className="hidden lg:flex relative w-full p-20 rounded-3xl bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${img1})` }}
            >
                <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
                <div className="relative z-10 h-full flex flex-col">
                    <div className="mb-8">
                        <LogoWhite />
                    </div>
                    <div className="flex-grow flex flex-col justify-center gap-6">
                        <h1 className="font-semibold text-2xl sm:text-5xl text-white leading-tight">
                            Streamline your legal practice with ds Legal
                        </h1>
                        <p className="font-normal text-base text-gray-200 opacity-70">
                            Introducing our innovative legal app, designed to
                            streamline your legal processes with a robust set of
                            features that enhance productivity and inspire new
                            ideas.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap mx-auto items-center justify-center px-4">
                <div className="sm:max-w-md bg-white p-8 rounded-lg">
                    {currentStep === 1 ? (
                        <>
                            <div className="flex justify-left mb-4">
                                <img src={logo} alt="Logo" className="h-8" />
                            </div>
                            <h1 className="font-semibold text-2xl mb-2 sm:mb-4 sm:text-5xl text-black leading-tight">
                                Create Account
                            </h1>
                            <p className="text-sm text-left text-gray-500 mb-4">
                                Do you have an account already?{" "}
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                    Sign In
                                </span>
                            </p>

                            <form onSubmit={handleNext} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label
                                        className="cursor-pointer"
                                        htmlFor="email"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full py-2 px-4 border rounded-md outline-none focus:ring-2 ${
                                            errors.email
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.email && touched.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* First Name */}
                                <div>
                                    <label
                                        className="cursor-pointer"
                                        htmlFor="firstName"
                                    >
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        placeholder="First name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full py-2 px-4 border rounded-md outline-none focus:ring-2 ${
                                            errors.firstName
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label
                                        className="cursor-pointer"
                                        htmlFor="lastName"
                                    >
                                        Last name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        placeholder="Last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full py-2 px-4 border rounded-md outline-none focus:ring-2 ${
                                            errors.lastName
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>

                                {/* Next Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isStep1Valid()}
                                    className="w-full bg-[#1983d5] text-white py-2 rounded-full hover:bg-blue-700 
                                    transition flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin">↻</span>
                                    ) : (
                                        <h6>Next</h6>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-4 my-1">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="text-gray-400 text-sm">
                                        or
                                    </span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>

                                {/* Google */}
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-3 cursor-pointer 
                                    border border-gray-300 py-3 rounded-md hover:bg-gray-100"
                                >
                                    <img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        alt="Google"
                                        className="w-5 h-5"
                                    />
                                    <span className="google">Google</span>
                                </button>
                            </form>

                            {/* Footer Links */}
                            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
                                <a href="#" className="hover:underline">
                                    Help
                                </a>
                                <a href="#" className="hover:underline">
                                    Privacy
                                </a>
                                <a href="#" className="hover:underline">
                                    Terms
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="w-full max-w-md mx-auto">
                            <button
                                onClick={handleBack}
                                className="text-base mb-4 flex gap-2 items-center cursor-pointer text-gray-500 hover:text-blue-500"
                            >
                                <ArrowLeft size={24} /> Back
                            </button>
                            <h1 className="font-semibold text-2xl mb-2 sm:mb-4 sm:text-3xl text-black leading-tight">
                                Create password
                            </h1>
                            <p className="text-sm text-gray-500 mb-6">
                                Do you have an account already?{" "}
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                    Sign In
                                </span>
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Password Field */}
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`w-full p-2 sm:p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Password Strength */}
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>Password strength:</span>
                                        <span
                                            className={`font-medium ${passwordStrength.textColor}`}
                                        >
                                            {passwordStrength.message}
                                        </span>
                                    </div>

                                    {formData.password && (
                                        <ul className="mt-2 text-xs text-gray-600 space-y-1">
                                            <li className="flex items-center gap-1">
                                                {formData.password.length >=
                                                8 ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>
                                                    At least 8 characters
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                {formData.password.match(
                                                    /[A-Z]/
                                                ) ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>
                                                    At least one uppercase
                                                    letter
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                {formData.password.match(
                                                    /[0-9]/
                                                ) ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <span>At least one number</span>
                                            </li>
                                            <li className="flex items-center gap-1">
                                                {formData.password.match(
                                                    /[^A-Za-z0-9]/
                                                ) ? (
                                                    <Check
                                                        className="text-green-500"
                                                        size={14}
                                                    />
                                                ) : (
                                                    <X
                                                        className="text-red-500"
                                                        size={14}
                                                    />
                                                )}
                                                <li
                                                    className={
                                                        passwordChecks.special
                                                            ? "text-blue-600 font-medium"
                                                            : ""
                                                    }
                                                ></li>
                                                <span>
                                                    At least one special
                                                    character
                                                </span>
                                            </li>
                                        </ul>
                                    )}
                                </div>

                                {/* Terms Agreement */}
                                <div className="flex items-start space-x-3 mt-6 text-xs sm:text-sm text-gray-600">
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
                                    className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? "Creating account..."
                                        : "Sign Up"}
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

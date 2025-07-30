import LoginImage from "../../../assets/LoginImage.jpg";
import user from "../../../assets/loginuser.png"
import LoginForm from "../../../components/form/LoginForm";
import LogoWhite from "../../../components/common/LogoWhite";

function Login() {
   
    return (
        <>
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Panel - Promotional Section */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src={LoginImage}
                    className="w-full h-full object-cover"
                    alt="Login"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
                    {/* Logo */}
                    <div className="mt-6 lg:mt-8">
                        <LogoWhite />
                    </div>
                    
                    {/* Main content */}
                    <div className="flex-1 flex flex-col justify-center">
                        <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-4 lg:mb-6">
                            Streamline your legal practice with ds Legal
                        </h1>
                        <p className="text-gray-200 text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
                            Introducing our light-weight admin companion built for legal professionals with features that enhance productivity without the complexities of sensitive data storage.
                        </p>
                    </div>
                    
                    {/* Testimonial */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 lg:p-6 mb-6 lg:mb-8">
                        <p className="text-gray-200 text-sm lg:text-base mb-3 lg:mb-4">
                            Lorem ipsum dolor sit amet consectetur. Et molestie arcu elit ut. Porttitor ut vulputate amet neque nibh.
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
            
            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-3 sm:p-4 lg:p-8">
                <div className="w-full max-w-sm sm:max-w-md">
                    <LoginForm/>
                </div>
            </div>
        </div>
        </>
    );
}

export default Login;

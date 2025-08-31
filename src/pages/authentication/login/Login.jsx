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
                {/* Use a smooth gradient overlay to blend image edges into background */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
                    {/* Logo */}
                    <div className="mt-6 lg:mt-8 auth-logo">
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
                            Trusted by small and mid-size firms to simplify case management and client intake.
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

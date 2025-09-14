import LoginForm from "../../../components/form/LoginForm";

function Login() {
   
    return (
        <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* Full Width Login Form */}
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl px-4 sm:px-6 lg:px-8">
                <LoginForm/>
            </div>
        </div>
        </>
    );
}

export default Login;

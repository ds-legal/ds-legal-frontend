import LoginImage from "../../../assets/LoginImage.jpg";
import user from "../../../assets/loginuser.png"
import LoginForm from "../../../components/form/LoginForm";

function Login() {
    return (
        <>
            <div className="md:w-[80%] w-[100%] h-[100vh]  mx-auto flex items-center justify-center lg:py-0 py-10">
                <div className="grid lg:grid-cols-2 grid-cols-1 w-full lg:h-[95vh] h-full lg:py-1   lg:shadow lg:bg-white rounded-xl ">

                <div className="w-full h-[95vh] lg:flex items-center justify-center p-4 relative hidden ">
                    {/* Image */}
                  <img
                    src={LoginImage}
                    className="max-w-full max-h-full object-contain rounded-xl img"
                    alt="Login"
                    />

                {/* Content on top of image */}
                <div className="absolute inset-0 flex flex-col items-start px-12 py-12 top-6 justify-between z-10">
                    <h3 className="text-white text-[32px] font-[700] logo-text">
                        Ds Legal
                    </h3>
                    <div>
                        <h3 className="text-[40px] text-white font-[600] leading-[50px]">
                            Streamline your legal practice with ds Legal</h3>
                        <p className="text-[18px] text-[#E4DBDB] mt-2">Introducing our light-weight admin companion built for legal professionals with features that enhance productivity without the complexities of sensitive data storage.</p>
                    </div>

                <div className="bg-[#212121] p-6 rounded-md">
                    <p className="text-[#F0E6E6] text-[16px]">Lorem ipsum dolor sit amet consectetur. Et molestie arcu elit ut. Porttitor ut vulputate amet neque nibh.</p>
                    <div className=" flex items-center gap-1 mt-2">
                        <img src={user} alt="user" className="h-12 w-12 rounded-full" />
                        <div>
                            <h5 className="text-[14px] 600 text-white">Joan Doe</h5>
                            <p className="text-[#A29999] text-[14px] 600">CEO, DS Legal</p>

                        </div>

                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="w-full h-[95vh]  flex items-center justify-center">
                      <LoginForm/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;

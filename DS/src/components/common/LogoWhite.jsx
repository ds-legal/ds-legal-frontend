import logo from "../../assets/logo-white.png";
export default function LogoWhite() {
    return (
        <>
            <div className="flex space-x-2 items-center">
                <img src={logo} alt="logo" />
                <h1 className="w-32 h-8 font-bold text-3xl leading-none text-white">
                    Ds Legal
                </h1>
            </div>
        </>
    );
}

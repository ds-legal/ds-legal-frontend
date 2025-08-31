import logo from "../../assets/logo-white.png";

export default function LogoWhite() {
    return (
        <>
            <div className="flex items-center gap-2">
                <img src={logo} alt="DS Legal" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto" />
            </div>
        </>
    );
}

import logo from "../../assets/logo-color.png";

export default function LogoColor() {
    return (
        <>
            <div className="flex items-center gap-2">
                {/* responsive logo sizing: slightly larger on all viewports */}
                <img src={logo} alt="DS Legal" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto" />
            </div>
        </>
    );
}
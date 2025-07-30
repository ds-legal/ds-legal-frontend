import logo from "../../assets/logo-color.png";

export default function LogoColor() {
    return (
        <>
            <div className="flex items-center gap-2">
                <img src={logo} alt="DS Legal" className="h-12 w-auto" />
            </div>
        </>
    );
} 
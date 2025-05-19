const LoadingSpinner = ({ size = "md", color = "primary" }) => {
    // Size classes
    const sizeClasses = {
        sm: "h-5 w-5 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-[5px]",
    };

    // Color classes (Tailwind CSS examples)
    const colorClasses = {
        primary: "border-t-blue-500",
        secondary: "border-t-purple-500",
        light: "border-t-gray-200",
        dark: "border-t-gray-800",
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-solid border-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
            />
        </div>
    );
};

export default LoadingSpinner;

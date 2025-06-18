export function Spinner({ size = "md", className = "" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    }

    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${className}`}
                role="status"
                aria-label="Loading"
            ></div>
        </div>
    )
}
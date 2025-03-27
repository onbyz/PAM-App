
import * as React from "react"


import { cn } from "@/lib/utils"
// placeholder:text-red-500
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 border-input border-b-[1px] border-[#5E6366] px-3 py-1 text-base  transition-colors file:border-0 file:bg-transparent file:text-[18px] file:font-medium file:text-foreground focus-visible:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-[18px]",
        className
      )}
     
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"


export { Input }
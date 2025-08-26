import { cn } from "@/app/lib/utils"
import {ButtonHTMLAttributes} from "react"
 type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>
export const Button = ({children, className, ...props}: ButtonProps) => {
    return (
        <button
        className={cn(
            'bg-blue-600 px-3 py-4 rounded-lg text-gray-50 flex items-center justify-center gap-2 hover:bg-blue-500 transition-all disabled:opacity-50',
            className
        )}
        {...props}
        >
            {children}
        </button>
    )
}
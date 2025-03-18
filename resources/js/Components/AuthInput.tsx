import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { LucideIcon } from "lucide-react";

interface AuthInputProps {
    type?: "password" | "text" | "email" | "number";
    placeholder: string;
    setData: (field: any, value: string | null) => void;
    errors: any;
    className?: string;
    name: string;
    data: {
        [key: string]: any;
    };
    icon: LucideIcon;
}

const AuthInput: React.FC<AuthInputProps> = ({
    data,
    setData,
    type,
    placeholder,
    errors,
    name,
    className,
    icon,
    ...props
}) => {
    const Icon = icon;
    return (
        <div className="relative">
            <Input
                {...props}
                type={type || "text"}
                name={name}
                value={data[name]}
                className={cn("mt-1 block w-full pl-7", className, {
                    "border-red-500 focus:!ring-red-500 focus:border-red-500":
                        errors[name],
                })}
                placeholder={placeholder}
                onChange={(e) => setData(name, e.target.value)}
                autoComplete={name}
            />
            <Icon className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        </div>
    );
};

export default AuthInput;

import { cn } from "@/lib/utils";
import { Image, X } from "lucide-react";
import { FC, useRef, useState } from "react";

interface FileInputProps {
    setData: (field: any, value: File | null) => void;
    errors: any;
    className?: string;
    name: string;
}

const FileInput: FC<FileInputProps> = ({
    setData,
    errors,
    className,
    name,
}) => {
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const inputFile = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () =>
                setPreviewImageUrl(reader.result as string);
            reader.readAsDataURL(file);

            setData(name, file);
        }
    };

    return (
        <div
            className={cn("flex items-center justify-center w-full", className)}
        >
            {!previewImageUrl ? (
                <label
                    htmlFor="dropzone"
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                        {
                            "border-red-500": errors[name],
                        }
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image
                            className={cn("size-8", {
                                "text-red-500": errors[name],
                            })}
                        />
                        <p className="text-sm text-gray-500">
                            <span
                                className={cn("font-semibold", {
                                    "text-red-500": errors[name],
                                })}
                            >
                                Click to upload
                            </span>
                        </p>
                    </div>
                    <input
                        id="dropzone"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={inputFile}
                        onChange={(e) =>
                            handleFileChange(e.target.files?.[0] as File)
                        }
                    />
                </label>
            ) : (
                <div className="flex justify-start w-full">
                    <div className="size-20 border relative rounded-md mt-3 flex justify-center items-center">
                        <button
                            className="absolute -top-3 -right-3 z-10 size-6 bg-red-500 rounded-full text-white flex justify-center items-center"
                            onClick={() => {
                                setData(name, null);
                                setPreviewImageUrl(null);

                                if (inputFile.current) {
                                    inputFile.current.value = "";
                                }
                            }}
                        >
                            <X className="size-4" />
                        </button>
                        <img
                            className="object-cover"
                            src={previewImageUrl}
                            alt="Preview"
                            className="rounded-md"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileInput;

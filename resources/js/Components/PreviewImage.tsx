import { cn } from "@/lib/utils";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface PreviewImageProps {
    imageUrl: string;
    imageAlt: string;
    className?: string;
}

const PreviewImage: React.FC<PreviewImageProps> = ({
    imageUrl,
    imageAlt,
    className,
}) => {
    return (
        <PhotoProvider>
            <PhotoView src={imageUrl}>
                <img
                    className={cn("object-contain cursor-pointer", className)}
                    src={imageUrl}
                    alt={imageAlt}
                />
            </PhotoView>
        </PhotoProvider>
    );
};

export default PreviewImage;

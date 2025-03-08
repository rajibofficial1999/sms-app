import { useState, useEffect } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
    value: string;
    className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    value,
    className,
}) => {
    const [qrCode, setQrCode] = useState<string>("");

    useEffect(() => {
        if (value) {
            QRCode.toDataURL(value)
                .then((url) => setQrCode(url))
                .catch((err) =>
                    console.error("QR Code generation error:", err)
                );
        }
    }, [value]);

    return (
        <>
            {qrCode && <img src={qrCode} alt="QR Code" className={className} />}
        </>
    );
};

export default QRCodeGenerator;

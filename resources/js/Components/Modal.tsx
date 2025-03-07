import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";

interface ModalProps {
    className?: string;
    isOpen?: boolean;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    onClose?: () => void;
    children?: ReactNode;
}

const Modal: FC<ModalProps> = ({
    className,
    isOpen,
    setIsOpen,
    onClose,
    children,
}) => {
    const closeModal = () => {
        onClose && onClose();

        if (setIsOpen) {
            setIsOpen(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal();
                }
            }}
        >
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle className="sr-only">DialogTitle</DialogTitle>
                    <DialogDescription className="sr-only">
                        DialogDescription
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;

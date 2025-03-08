import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "./ui/sheet";

interface SideSheetProps {
    className?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    onClose?: () => void;
}

export function SideSheet({
    children,
    isOpen,
    setIsOpen,
    onClose,
}: SideSheetProps) {
    const closeModal = () => {
        onClose && onClose();

        if (setIsOpen) {
            setIsOpen(false);
        }
    };

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeModal();
                }
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="sr-only">SheetTitle</SheetTitle>
                    <SheetDescription className="sr-only">
                        SheetDescription
                    </SheetDescription>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    );
}

import MaxWidthWrapper from "@/Components/MaxWidthWrapper";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="w-full flex h-screen overflow-hidden">
            <main className="flex-1 overflow-auto">
                <MaxWidthWrapper className="text-center h-full flex justify-center items-center">
                    <div className="max-w-sm w-full mx-auto border px-6 py-2 sm:py-6 rounded-lg shadow shadow-primary/20 text-left">
                        {children}
                    </div>
                </MaxWidthWrapper>
            </main>
        </div>
    );
}

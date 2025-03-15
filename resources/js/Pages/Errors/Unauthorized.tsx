import { buttonVariants } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

const Unauthorized = ({ backTo }: { backTo: string }) => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1>Unauthorized</h1>
                <p>You are not authorized to access this page.</p>
                <p>
                    If you think this is a mistake, please contact the
                    administrator.
                </p>
                <Link
                    href={backTo ?? "/"}
                    className={buttonVariants({ variant: "default" })}
                >
                    Go back
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;

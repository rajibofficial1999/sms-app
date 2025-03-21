import { Link, router, usePage } from "@inertiajs/react";
import { ArrowRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const { url } = usePage();

    const toggleOpen = () => setOpen((prev) => !prev);

    useEffect(() => {
        if (isOpen) toggleOpen();
    }, [url]);

    const closeOnCurrent = (href: string) => {
        if (url === href) {
            toggleOpen();
        }
    };

    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="sm:hidden">
            <Menu
                onClick={toggleOpen}
                className="relative z-50 h-5 w-5 text-zinc-700"
            />

            {isOpen ? (
                <div className="fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full">
                    <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
                        {!isAuth ? (
                            <>
                                <li>
                                    <Link
                                        onClick={() => closeOnCurrent("/login")}
                                        className="flex items-center w-full font-semibold text-green-600"
                                        href="/login"
                                    >
                                        Get started
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </li>
                                <li className="my-3 h-px w-full bg-gray-300" />
                                <li>
                                    <Link
                                        onClick={() => closeOnCurrent("/login")}
                                        className="flex items-center w-full font-semibold"
                                        href="/login"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li className="my-3 h-px w-full bg-gray-300" />
                                <li>
                                    <Link
                                        onClick={() =>
                                            closeOnCurrent("/pricing")
                                        }
                                        className="flex items-center w-full font-semibold"
                                        href="/pricing"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        onClick={() =>
                                            closeOnCurrent("/dashboard")
                                        }
                                        className="flex items-center w-full font-semibold"
                                        href="/dashboard"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="my-3 h-px w-full bg-gray-300" />
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full font-semibold"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default MobileNav;

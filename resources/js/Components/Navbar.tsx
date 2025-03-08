import { Link, usePage } from "@inertiajs/react";
import { MoveRight } from "lucide-react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import UserNavDropdown from "./UserNavDropdown";
import MobileNav from "./MobileNav";

const Navbar = () => {
    const {
        auth: { user },
    } = usePage().props;

    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        <img src="/images/logo.svg" alt="logo" width={150} />
                    </Link>

                    <MobileNav isAuth={!!user} />

                    <div className="hidden items-center space-x-4 sm:flex">
                        <Link
                            href="/pricing"
                            className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            })}
                        >
                            Pricing
                        </Link>
                        {user ? (
                            <UserNavDropdown />
                        ) : (
                            <Link
                                href="/login"
                                as="button"
                                className={buttonVariants({
                                    className:
                                        "h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600",
                                    size: "sm",
                                })}
                            >
                                <span>Get started</span>{" "}
                                <MoveRight className="size-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    );
};

export default Navbar;

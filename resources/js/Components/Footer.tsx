import { Link } from "@inertiajs/react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ApplicationLogo from "./ApplicationLogo";

const Footer = () => {
    return (
        <footer className="shadow-sm bg-gray-800">
            <MaxWidthWrapper className="flex flex-col items-center justify-center text-center">
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <a
                            href="https://flowbite.com/"
                            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
                        >
                            <ApplicationLogo className="h-6 w-auto text-indigo-600" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                                ShareText
                            </span>
                        </a>
                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-400">
                            <li>
                                <FooterLink name="About" href="/" />
                            </li>
                            <li>
                                <FooterLink name="Privacy Policy" href="/" />
                            </li>
                            <li>
                                <FooterLink name="Licensing" href="/" />
                            </li>
                            <li>
                                <FooterLink name="Contact" href="/" />
                            </li>
                        </ul>
                    </div>
                    <hr className="my-6  sm:mx-auto border-gray-700 lg:my-8" />
                    <span className="block text-sm sm:text-center text-gray-50">
                        © 2023{" "}
                        <Link
                            href="https://flowbite.com/"
                            className="text-gray-50"
                        >
                            Flowbite™
                        </Link>
                        . All Rights Reserved.
                    </span>
                </div>
            </MaxWidthWrapper>
        </footer>
    );
};

const FooterLink = ({ name, href }: { name: string; href: string }) => {
    return (
        <Link href={href} className="me-4 md:me-6 text-gray-50">
            {name}
        </Link>
    );
};

export default Footer;

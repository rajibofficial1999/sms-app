import ApplicationLogo from "@/Components/ApplicationLogo";
import { Button } from "@/Components/ui/button";
import { Dialog, Transition } from "@headlessui/react";
import { Link, usePage } from "@inertiajs/react";
import { Menu, UserPlus, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import AppSidebar from "./AppSidebar";
import SidebarMobileMenu from "./SidebarMobileMenu";

const MobileSidebar = () => {
    const [open, setOpen] = useState<boolean>(false);

    const { url } = usePage();

    useEffect(() => {
        setOpen(false);
    }, []);

    return (
        <div className="fixed bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 h-14 px-4">
            <div className="w-full h-full flex justify-between items-center">
                <Link href="/">
                    <ApplicationLogo className="size-7" />
                </Link>
                <button onClick={() => setOpen(true)} className="gap-4">
                    <Menu className="h-6 w-6" />
                </button>
            </div>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="-translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="-translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="h-full w-full flex justify-start max-w-80  bg-white shadow-xl">
                                            <div className="flex h-full flex-col w-full overflow-hidden py-6">
                                                <div className="px-4 sm:px-6">
                                                    <div className="flex items-start justify-end">
                                                        <Dialog.Title className="text-base sr-only font-semibold leading-6 text-gray-900">
                                                            Dialog Title
                                                        </Dialog.Title>
                                                        <div className="ml-3 flex h-7 items-center">
                                                            <button
                                                                type="button"
                                                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                onClick={() =>
                                                                    setOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <span className="sr-only">
                                                                    Close panel
                                                                </span>
                                                                <X
                                                                    className="h-6 w-6"
                                                                    aria-hidden="true"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative mt-3 flex-1">
                                                    {/* Content */}

                                                    {url === "/messaging" ? (
                                                        <>
                                                            <div className="flex justify-between items-center px-4 mt-2">
                                                                <p className="text-xs font-semibold leading-6 text-gray-400">
                                                                    Your chats
                                                                </p>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <UserPlus />
                                                                </Button>
                                                            </div>

                                                            <nav className="flex flex-1 flex-col">
                                                                <AppSidebar />
                                                            </nav>
                                                        </>
                                                    ) : (
                                                        <SidebarMobileMenu />
                                                    )}

                                                    {/* content end */}
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default MobileSidebar;

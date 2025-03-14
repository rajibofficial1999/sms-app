import { Button, buttonVariants } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { ShieldBan } from "lucide-react";

export default function BlockLists({ className = "" }: { className?: string }) {
    const { blockLists } = usePage().props;

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Blocked numbers
                </h2>

                {blockLists.length > 0 ? (
                    <ul className="space-y-3 mt-4">
                        {blockLists.map((list) => (
                            <li
                                key={list.id}
                                className="flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-md">
                                        {list.blocked_number}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {format(list.created_at, "MMM d, yyyy")}
                                    </p>
                                </div>

                                <Link
                                    href={route(
                                        "phone-numbers.unblock",
                                        list?.id
                                    )}
                                    method="post"
                                    as="button"
                                    className={buttonVariants({
                                        variant: "destructive",
                                        size: "sm",
                                        className: "flex gap-0.5",
                                    })}
                                >
                                    <ShieldBan className="size-4" />
                                    <span>Unblock</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-sm">No blocked numbers</p>
                )}
            </header>
        </section>
    );
}

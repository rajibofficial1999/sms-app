import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    data: any;
}

const Pagination: React.FC<PaginationProps> = ({ data }) => {
    return (
        <ul className="inline-flex items-stretch -space-x-px">
            {data.links.map((link: any, index: number) => {
                const isNext = link.label.includes("Next");
                const isPrev = link.label.includes("Previous");
                return (
                    <li key={index}>
                        {isNext || isPrev ? (
                            <Link
                                as="button"
                                href={link.url}
                                disabled={!link.url}
                                className={cn(
                                    "flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700",
                                    {
                                        "rounded-r-lg": isNext,
                                        "rounded-l-lg": isPrev,
                                        "cursor-auto": !link.url,
                                    }
                                )}
                            >
                                <span className="sr-only">
                                    {isNext ? "Next" : "Previous"}
                                </span>
                                {isNext ? (
                                    <ChevronRight className="size-5" />
                                ) : (
                                    <ChevronLeft className="size-5" />
                                )}
                            </Link>
                        ) : (
                            <Link
                                as="button"
                                disabled={
                                    Number(link.label) ===
                                    Number(data.current_page)
                                }
                                href={link.url}
                                className={cn(
                                    "flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700",
                                    {
                                        "cursor-auto text-gray-700 bg-gray-100":
                                            Number(link.label) ===
                                            Number(data.current_page),
                                    }
                                )}
                            >
                                {link.label}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default Pagination;

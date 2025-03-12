import { Button, buttonVariants } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { FC, ReactNode } from "react";
import Pagination from "./Pagination";
import { Link } from "@inertiajs/react";

interface TableProps {
    isActionRequired: boolean;
    headers: string[];
    children: ReactNode;
    data: any;
    filters?: any;
    addItemUrl?: string;
    handleSearch?: (search: string) => void;
    handleFilter?: (value: any) => void;
}

const Table: FC<TableProps> = ({
    isActionRequired = false,
    headers,
    children,
    data,
    filters,
    addItemUrl,
    handleSearch,
    handleFilter,
}) => {
    const showFilters = !!filters;
    const showSearch = !!handleSearch;

    return (
        <div className="mx-auto max-w-screen-xl">
            <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        {showSearch && (
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="size-4" />
                                </div>
                                <Input
                                    id="simple-search"
                                    className="block w-full !pl-10"
                                    placeholder="Search..."
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        {addItemUrl && (
                            <Link
                                href={addItemUrl}
                                className={buttonVariants({
                                    variant: "default",
                                })}
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add
                            </Link>
                        )}
                        {showFilters && (
                            <div className="flex items-center space-x-3 w-full md:w-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            <Filter className="size-5" />
                                            Filter
                                            <ChevronDown className="size-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {filters.map((filter: any) => (
                                            <DropdownMenuItem
                                                asChild
                                                key={filter}
                                            >
                                                <button
                                                    type="button"
                                                    className="cursor-pointer w-full capitalize"
                                                    onClick={() =>
                                                        handleFilter &&
                                                        handleFilter(filter)
                                                    }
                                                >
                                                    {filter}
                                                </button>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                {headers.map((header) => (
                                    <th
                                        key={header}
                                        scope="col"
                                        className="px-4 py-3 text-nowrap"
                                    >
                                        {header}
                                    </th>
                                ))}

                                {isActionRequired && (
                                    <th scope="col" className="px-4 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.length > 0 ? (
                                children
                            ) : (
                                <tr>
                                    <td
                                        colSpan={headers.length}
                                        className="text-center py-5"
                                    >
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <nav
                    className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                    aria-label="Table navigation"
                >
                    <span className="text-sm font-normal text-gray-500">
                        Showing
                        <span className="font-semibold text-gray-900 mx-1">
                            {data.data.length}
                        </span>
                        of
                        <span className="font-semibold text-gray-900 mx-1">
                            {data.total}
                        </span>
                    </span>
                    <Pagination data={data} />
                </nav>
            </div>
        </div>
    );
};

export default Table;

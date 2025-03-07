import { FC } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Link } from "@inertiajs/react";

interface DashboardBreadcrumbProps {
    className?: string;
    items: BreadcrumbItem[];
}

const DashboardBreadcrumb: FC<DashboardBreadcrumbProps> = ({
    className,
    items,
}) => {
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <span
                        key={item.href || index}
                        className="flex items-center"
                    >
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.name}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </span>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DashboardBreadcrumb;

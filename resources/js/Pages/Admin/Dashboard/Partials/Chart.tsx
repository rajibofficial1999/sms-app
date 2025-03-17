import { ChartConfig, ChartContainer } from "@/Components/ui/chart";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface ChartProps {
    children: React.ReactElement<
        any,
        string | React.JSXElementConstructor<any>
    >;
    chartConfig: ChartConfig;
    className?: string;
    title: string;
    description: string;
    cardClassName?: string;
}

const Chart: React.FC<ChartProps> = ({
    children,
    chartConfig,
    className,
    title,
    description,
    cardClassName,
}) => {
    return (
        <Card className={cn("flex flex-col", cardClassName)}>
            <CardHeader className="pb-0">
                <CardTitle className="text-lg text-nowrap truncate">
                    {title}
                </CardTitle>
                <CardDescription className="text-sm italic flex gap-1 items-center text-nowrap truncate">
                    <CalendarDays className="size-4" />
                    <span>{description}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 w-full">
                <ChartContainer config={chartConfig} className={cn(className)}>
                    {children}
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default Chart;

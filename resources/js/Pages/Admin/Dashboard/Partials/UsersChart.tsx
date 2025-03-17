import {
    ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import Chart from "./Chart";
import { cn } from "@/lib/utils";

const chartConfig = {
    users: {
        label: "Users",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface UsersChartProps {
    cardClassName?: string;
    className?: string;
}

export function UsersChart({ cardClassName, className }: UsersChartProps) {
    const { userCharts } = usePage<PageProps<any>>().props;

    return (
        <Chart
            title="Users"
            description={`${userCharts.startDate} - ${userCharts.endDate}`}
            chartConfig={chartConfig}
            cardClassName={cardClassName}
            className={cn("max-h-[300px] w-full", className)}
        >
            <AreaChart
                accessibilityLayer
                data={userCharts.data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                    dataKey="users"
                    type="natural"
                    fill="var(--color-users)"
                    fillOpacity={0.4}
                    stroke="var(--color-users)"
                />
            </AreaChart>
        </Chart>
    );
}

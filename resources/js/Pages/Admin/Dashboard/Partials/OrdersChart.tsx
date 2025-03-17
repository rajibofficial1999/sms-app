import {
    ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import Chart from "./Chart";
import { cn } from "@/lib/utils";

const chartConfig = {
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-2))",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--chart-4))",
    },
    rejected: {
        label: "Rejected",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface OrdersChartProps {
    className?: string;
    cardClassName?: string;
}

export function OrdersChart({ className, cardClassName }: OrdersChartProps) {
    const { orderCharts } = usePage<PageProps<any>>().props;
    return (
        <Chart
            title="Orders"
            description={`${orderCharts.startDate} - ${orderCharts.endDate}`}
            chartConfig={chartConfig}
            cardClassName={cardClassName}
            className={cn("max-h-[300px] w-full", className)}
        >
            <LineChart
                accessibilityLayer
                data={orderCharts.data}
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
                    content={<ChartTooltipContent />}
                />
                <Line
                    dataKey="completed"
                    type="monotone"
                    stroke="var(--color-completed)"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="pending"
                    type="monotone"
                    stroke="var(--color-pending)"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="rejected"
                    type="monotone"
                    stroke="var(--color-rejected)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </Chart>
    );
}

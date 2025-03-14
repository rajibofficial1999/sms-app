import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { usePage } from "@inertiajs/react";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

const chartConfig = {
    sent: {
        label: "Sent",
        color: "hsl(var(--chart-2))",
    },
    received: {
        label: "Received",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const TotalMessage = () => {
    const { totalMessagesChart } = usePage().props;

    const [chartData] = React.useState<TotalMessagesChart[]>(() =>
        totalMessagesChart.map((item) => {
            if (item.name === "sent") {
                item.fill = "var(--color-sent)";
            }
            if (item.name === "received") {
                item.fill = "var(--color-received)";
            }
            return item;
        })
    );

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.messages, 0);
    }, []);

    return (
        <div className="w-full">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={chartData}
                        dataKey="messages"
                        nameKey="name"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {totalVisitors.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Messges
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
    );
};

export default TotalMessage;

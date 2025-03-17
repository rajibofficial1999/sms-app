import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { PageProps } from "@/types";
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
    const { totalMessagesChart } = usePage<PageProps<any>>().props;

    const [chartData] = React.useState(() =>
        totalMessagesChart.map((item: any) => {
            if (item.name === "sent") {
                item.fill = "var(--color-sent)";
            }
            if (item.name === "received") {
                item.fill = "var(--color-received)";
            }
            return item;
        })
    );

    const totalMessges = React.useMemo(() => {
        return chartData.reduce(
            (acc: any, curr: any) => acc + curr.messages,
            0
        );
    }, []);

    return (
        <div className="w-full">
            {totalMessges > 0 ? (
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
                                                    {totalMessges.toLocaleString()}
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
            ) : (
                <div className="w-full h-full flex justify-center items-center">
                    <div className="text-center text-sm text-gray-600">
                        No data
                    </div>
                </div>
            )}
        </div>
    );
};

export default TotalMessage;

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import { usePage } from "@inertiajs/react";

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

const DailyMessagesChart = () => {
    const { messageCharts: chartData } = usePage().props;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Daily messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="max-h-60 w-full"
                    >
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: -20,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 2)}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickCount={3}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Area
                                dataKey="received"
                                type="natural"
                                fill="var(--color-received)"
                                fillOpacity={0.4}
                                stroke="var(--color-received)"
                                stackId="a"
                            />
                            <Area
                                dataKey="sent"
                                type="natural"
                                fill="var(--color-sent)"
                                fillOpacity={0.4}
                                stroke="var(--color-sent)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
};

export default DailyMessagesChart;

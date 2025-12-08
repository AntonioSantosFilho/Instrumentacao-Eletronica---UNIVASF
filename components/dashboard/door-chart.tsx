"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"
import { useMemo } from "react"

interface DoorChartProps {
    data: Array<{ state: string; timestamp: string }>
}

export function DoorChart({ data }: DoorChartProps) {
    const chartData = useMemo(() => {
        return data
            .map((item) => ({
                ...item,
                value: item.state === "open" ? 1 : 0,
                time: new Date(item.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                fullTime: new Date(item.timestamp).toLocaleString("pt-BR"),
                status: item.state === "open" ? "Aberta" : "Fechada",
            }))
            .slice(-50)
    }, [data])

    if (chartData.length === 0) {
        return (
            <Card className="bg-white border-[#D0D3D6] shadow-md">
                <CardHeader className="border-b border-[#D0D3D6]">
                    <CardTitle className="text-[#2E3438]">Histórico da Porta</CardTitle>
                    <CardDescription className="text-[#2E3438]/70">Monitoramento de aberturas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-[#2E3438]/60">
                        Nenhum dado disponível
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white border-[#D0D3D6] shadow-md">
            <CardHeader className="border-b border-[#D0D3D6]">
                <CardTitle className="text-[#2E3438]">Histórico da Porta</CardTitle>
                <CardDescription className="text-[#2E3438]/70">Monitoramento de aberturas nas últimas 24h</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        value: {
                            label: "Estado",
                            color: "hsl(var(--chart-3))",
                        },
                    }}
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#D0D3D6" strokeOpacity={0.3} />
                            <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickLine={false}
                                axisLine={false}
                                ticks={[0, 1]}
                                tickFormatter={(value) => (value === 1 ? "Aberta" : "Fechada")}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                                formatter={(value: number) => [value === 1 ? "Aberta" : "Fechada", "Estado"]}
                            />
                            <Area
                                type="step"
                                dataKey="value"
                                stroke="#F59E0B"
                                fill="#F59E0B"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

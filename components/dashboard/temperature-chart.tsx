"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts"
import { useMemo } from "react"

interface TemperatureChartProps {
  data: Array<{ temperature: number; timestamp: string }>
  minTemp?: number
  maxTemp?: number
}

export function TemperatureChart({ data, minTemp = 2, maxTemp = 8 }: TemperatureChartProps) {
  const chartData = useMemo(() => {
    return data
      .map((item) => ({
        ...item,
        time: new Date(item.timestamp).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fullTime: new Date(item.timestamp).toLocaleString("pt-BR"),
      }))
      .slice(-50) // Últimos 50 pontos para melhor visualização
  }, [data])

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [-5, 15]
    const temps = chartData.map((d) => d.temperature)
    const min = Math.min(...temps, minTemp - 2)
    const max = Math.max(...temps, maxTemp + 2)
    return [Math.floor(min), Math.ceil(max)]
  }, [chartData, minTemp, maxTemp])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Temperatura</CardTitle>
        <CardDescription>
          Monitoramento das últimas 24 horas. Faixa ideal: {minTemp}°C - {maxTemp}°C
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            temperature: {
              label: "Temperatura",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

              {/* Área de temperatura ideal */}
              <ReferenceArea y1={minTemp} y2={maxTemp} fill="hsl(142.1, 76.2%, 36.3%)" fillOpacity={0.1} />

              {/* Linhas de limite */}
              <ReferenceLine
                y={minTemp}
                stroke="hsl(142.1, 76.2%, 36.3%)"
                strokeDasharray="5 5"
                label={{ value: `Min: ${minTemp}°C`, position: "left", fontSize: 10 }}
              />
              <ReferenceLine
                y={maxTemp}
                stroke="hsl(142.1, 76.2%, 36.3%)"
                strokeDasharray="5 5"
                label={{ value: `Max: ${maxTemp}°C`, position: "left", fontSize: 10 }}
              />

              <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                domain={yDomain}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°C`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${value.toFixed(1)}°C`, "Temperatura"]}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

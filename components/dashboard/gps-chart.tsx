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
} from "recharts"
import { useMemo } from "react"

interface GPSChartProps {
  data: Array<{ latitude: number; longitude: number; timestamp: string }>
}

export function GPSChart({ data }: GPSChartProps) {
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

  if (chartData.length === 0) {
    return (
      <Card className="bg-white border-[#D0D3D6] shadow-md">
        <CardHeader className="border-b border-[#D0D3D6]">
          <CardTitle className="text-[#2E3438]">Evolução GPS</CardTitle>
          <CardDescription className="text-[#2E3438]/70">Monitoramento das últimas 24 horas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#2E3438]/60">
            Nenhum dado GPS disponível
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calcular domínios para latitude e longitude
  const latDomain = useMemo(() => {
    const lats = chartData.map((d) => d.latitude)
    const min = Math.min(...lats)
    const max = Math.max(...lats)
    const padding = (max - min) * 0.1 || 0.01
    return [min - padding, max + padding]
  }, [chartData])

  const lngDomain = useMemo(() => {
    const lngs = chartData.map((d) => d.longitude)
    const min = Math.min(...lngs)
    const max = Math.max(...lngs)
    const padding = (max - min) * 0.1 || 0.01
    return [min - padding, max + padding]
  }, [chartData])


  return (
    <Card className="bg-white border-[#D0D3D6] shadow-md">
      <CardHeader className="border-b border-[#D0D3D6]">
        <CardTitle className="text-[#2E3438]">Evolução GPS</CardTitle>
        <CardDescription className="text-[#2E3438]/70">Monitoramento das últimas 24 horas - Coordenadas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            latitude: {
              label: "Latitude",
              color: "hsl(var(--chart-1))",
            },
            longitude: {
              label: "Longitude",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D0D3D6" strokeOpacity={0.3} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="left"
                domain={latDomain}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(4)}
                stroke="#0057B8"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={lngDomain}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toFixed(4)}
                stroke="#6AB7FF"
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(6)}`,
                  name === "latitude" ? "Latitude" : "Longitude",
                ]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="latitude"
                stroke="#0057B8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#0057B8" }}
                name="latitude"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="longitude"
                stroke="#6AB7FF"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#6AB7FF" }}
                name="longitude"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


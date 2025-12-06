"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

interface GPSMapProps {
  location: { latitude: number; longitude: number } | null
  history?: Array<{ latitude: number; longitude: number; timestamp?: string }>
}

export function GPSMap({ location, history = [] }: GPSMapProps) {
  const openInMaps = () => {
    if (location) {
      window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, "_blank")
    }
  }

  return (
    <Card className="bg-white border-[#D0D3D6] shadow-md">
      <CardHeader className="border-b border-[#D0D3D6]">
        <CardTitle className="flex items-center gap-2 text-[#2E3438]">
          <MapPin className="h-5 w-5 text-[#0057B8]" />
          Localização GPS
        </CardTitle>
        <CardDescription className="text-[#2E3438]/70">Rastreamento em tempo real do transporte</CardDescription>
      </CardHeader>
      <CardContent>
        {location ? (
          <div className="space-y-4">
            {/* Mapa placeholder - pode ser substituído por Leaflet ou Google Maps */}
            <div
              className="relative w-full h-[250px] bg-gradient-to-br from-[#6AB7FF]/20 to-[#0057B8]/20 rounded-lg overflow-hidden cursor-pointer group border border-[#D0D3D6]"
              onClick={openInMaps}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="h-12 w-12 mx-auto text-[#0057B8] mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-[#2E3438]">Clique para abrir no Google Maps</p>
                </div>
              </div>

              {/* Grid decorativo */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-muted-foreground/20" />
                  ))}
                </div>
              </div>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#F4F6F8] rounded-lg border border-[#D0D3D6]">
                <p className="text-xs text-[#2E3438]/70 mb-1 font-medium">Latitude</p>
                <p className="font-mono text-sm font-semibold text-[#0057B8]">{location.latitude.toFixed(6)}</p>
              </div>
              <div className="p-3 bg-[#F4F6F8] rounded-lg border border-[#D0D3D6]">
                <p className="text-xs text-[#2E3438]/70 mb-1 font-medium">Longitude</p>
                <p className="font-mono text-sm font-semibold text-[#0057B8]">{location.longitude.toFixed(6)}</p>
              </div>
            </div>

            {/* Histórico de posições */}
            {history.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#2E3438] mb-2">Últimas posições:</p>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {history.slice(0, 5).map((pos, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-[#F4F6F8] rounded border border-[#D0D3D6]">
                      <span className="font-mono text-[#0057B8]">
                        {pos.latitude.toFixed(4)}, {pos.longitude.toFixed(4)}
                      </span>
                      <span className="text-[#2E3438]/70">
                        {new Date(pos.timestamp).toLocaleTimeString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-[#2E3438]/60">
            <MapPin className="h-12 w-12 mb-2 opacity-50 text-[#D0D3D6]" />
            <p className="font-medium">Localização não disponível</p>
            <p className="text-xs mt-1">Aguardando dados do GPS</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

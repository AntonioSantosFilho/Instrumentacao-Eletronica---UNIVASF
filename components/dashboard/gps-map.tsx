"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

interface GPSMapProps {
  location: { latitude: number; longitude: number } | null
  history?: Array<{ latitude: number; longitude: number; timestamp: string }>
}

export function GPSMap({ location, history = [] }: GPSMapProps) {
  const openInMaps = () => {
    if (location) {
      window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, "_blank")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização GPS
        </CardTitle>
        <CardDescription>Rastreamento em tempo real do transporte</CardDescription>
      </CardHeader>
      <CardContent>
        {location ? (
          <div className="space-y-4">
            {/* Mapa placeholder - pode ser substituído por Leaflet ou Google Maps */}
            <div
              className="relative w-full h-[250px] bg-muted rounded-lg overflow-hidden cursor-pointer group"
              onClick={openInMaps}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-emerald-500/10">
                <div className="text-center">
                  <Navigation className="h-12 w-12 mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Clique para abrir no Google Maps</p>
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
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                <p className="font-mono text-sm font-medium">{location.latitude.toFixed(6)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                <p className="font-mono text-sm font-medium">{location.longitude.toFixed(6)}</p>
              </div>
            </div>

            {/* Histórico de posições */}
            {history.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Últimas posições:</p>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {history.slice(0, 5).map((pos, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                      <span className="font-mono">
                        {pos.latitude.toFixed(4)}, {pos.longitude.toFixed(4)}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(pos.timestamp).toLocaleTimeString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MapPin className="h-12 w-12 mb-2 opacity-50" />
            <p>Localização não disponível</p>
            <p className="text-xs mt-1">Aguardando dados do GPS</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

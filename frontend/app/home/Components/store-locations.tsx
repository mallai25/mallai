import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StoreLocation {
  id: string
  name: string
  address: string
  imageUrl: string
}

interface StoreLocationsProps {
  locations: StoreLocation[]
}

export function StoreLocations({ locations }: StoreLocationsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location) => (
        <Card key={location.id} className="overflow-hidden">
          <div className="relative h-40">
            <Image
              src={location.imageUrl}
              alt={location.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{location.name}</CardTitle>
            <CardDescription>
              <MapPin className="inline-block mr-1 h-4 w-4" />
              {location.address}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}


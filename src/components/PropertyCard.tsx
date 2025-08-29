import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart, Phone } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-0 shadow-md">
      <div className="relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {property.type}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button size="icon" variant="ghost" className="bg-background/80 hover:bg-background">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {property.featured && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} Beds
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms} Baths
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.area} sq ft
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-primary">
              ₹{property.price}
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <Phone className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
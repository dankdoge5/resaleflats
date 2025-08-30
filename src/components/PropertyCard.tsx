import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart, Phone } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Property {
  id: string;
  title: string;
  price: number | string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  area?: number; // For backward compatibility
  image_urls?: string[] | null;
  image?: string; // For backward compatibility
  property_type: string;
  type?: string; // For backward compatibility
  featured?: boolean;
  owner_id?: string;
}

interface PropertyCardProps {
  property: Property;
  showSaveButton?: boolean;
}

export const PropertyCard = ({ property, showSaveButton = true }: PropertyCardProps) => {
  const { toggleSaveProperty, isPropertySaved } = useProperties();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSaveProperty = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleSaveProperty(property.id);
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    if (price >= 100) {
      return `${(price / 100).toFixed(1)} Cr`;
    }
    return `${price} L`;
  };

  const getImageUrl = () => {
    if (property.image_urls && property.image_urls.length > 0) {
      return property.image_urls[0];
    }
    if (property.image) {
      return property.image;
    }
    return '/placeholder.svg';
  };

  const getPropertyType = () => {
    return property.property_type || property.type || 'Apartment';
  };

  const getArea = () => {
    return property.area_sqft || property.area || 0;
  };

  const isSaved = user ? isPropertySaved(property.id) : false;
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-0 shadow-md">
      <div className="relative overflow-hidden">
        <img 
          src={getImageUrl()} 
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 text-foreground">
            {getPropertyType()}
          </Badge>
        </div>
        {showSaveButton && (
          <div className="absolute top-3 right-3">
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-background/80 hover:bg-background"
              onClick={handleSaveProperty}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-destructive' : ''}`} />
            </Button>
          </div>
        )}
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
              {getArea()} sq ft
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-primary">
              ₹{formatPrice(property.price)}
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
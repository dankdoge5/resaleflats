import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Heart, Phone, Check } from "lucide-react";
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
  viewMode?: "grid" | "list";
  isSelected?: boolean;
  onSelect?: () => void;
}

export const PropertyCard = ({ property, showSaveButton = true, viewMode = "grid", isSelected = false, onSelect }: PropertyCardProps) => {
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

  const handleViewProperty = () => {
    navigate(`/property/${property.id}`);
  };

  const handleContactOwner = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Implement contact functionality for authenticated users
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

  if (viewMode === "list") {
  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-0 shadow-md ${
      isSelected ? "ring-2 ring-primary" : ""
    }`}>
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Selection Checkbox */}
          {onSelect && (
            <div 
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                isSelected ? "bg-primary border-primary" : "bg-white border-gray-300 hover:border-primary"
              }`}>
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </div>
            </div>
          )}
          
          <div className="relative w-48 h-32 flex-shrink-0" onClick={handleViewProperty}>
              <img 
                src={getImageUrl()} 
                alt={property.title}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              />
              {property.featured && (
                <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors cursor-pointer" onClick={handleViewProperty}>
                    {property.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ₹{formatPrice(property.price)}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                <Badge variant="secondary">
                  {getPropertyType()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  {showSaveButton && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleSaveProperty}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-destructive' : ''}`} />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleViewProperty}>
                    View Details
                  </Button>
                  <Button variant="default" size="sm" className="gap-1" onClick={handleContactOwner}>
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-0 shadow-md cursor-pointer ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div 
          className="absolute top-2 left-2 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected ? "bg-primary border-primary" : "bg-white border-gray-300 hover:border-primary"
          }`}>
            {isSelected && <Check className="h-4 w-4 text-white" />}
          </div>
        </div>
      )}
      
      <div onClick={handleViewProperty}>
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
            <Button variant="outline" size="sm" className="gap-1" onClick={handleContactOwner}>
              <Phone className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
        </CardContent>
      </div>
    </Card>
  );
};
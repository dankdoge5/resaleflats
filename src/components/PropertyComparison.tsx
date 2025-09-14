import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Scale, MapPin, Home, Bed, Bath, Square } from 'lucide-react';
import { Property } from '@/hooks/useProperties';

interface PropertyComparisonProps {
  properties: Property[];
  onRemoveProperty: (propertyId: string) => void;
  onClearAll: () => void;
}

export const PropertyComparison = ({ properties, onRemoveProperty, onClearAll }: PropertyComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (properties.length === 0) return null;

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getImageUrl = (property: Property) => {
    return property.image_urls?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
  };

  const ComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Feature</th>
            {properties.map(property => (
              <th key={property.id} className="text-center p-4 min-w-64">
                <div className="space-y-2">
                  <img 
                    src={getImageUrl(property)} 
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2">{property.title}</h3>
                    <p className="text-lg font-bold text-primary">{formatPrice(property.price)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveProperty(property.id)}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-4 font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">{property.location}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Property Type
            </td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">
                <Badge variant="secondary" className="capitalize">
                  {property.property_type}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium flex items-center">
              <Bed className="h-4 w-4 mr-2" />
              Bedrooms
            </td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">{property.bedrooms}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium flex items-center">
              <Bath className="h-4 w-4 mr-2" />
              Bathrooms
            </td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">{property.bathrooms}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium flex items-center">
              <Square className="h-4 w-4 mr-2" />
              Area (sq ft)
            </td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">{property.area_sqft || 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium">Furnished Status</td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">
                <Badge variant="outline" className="capitalize">
                  {property.furnished_status?.replace('-', ' ')}
                </Badge>
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 font-medium">Price per sq ft</td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4">
                {property.area_sqft ? 
                  `₹${Math.round(property.price / property.area_sqft).toLocaleString()}` : 
                  'N/A'
                }
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 font-medium">Description</td>
            {properties.map(property => (
              <td key={property.id} className="text-center p-4 text-sm text-muted-foreground max-w-xs">
                <div className="line-clamp-3">{property.description}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Floating Compare Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg">
              <Scale className="h-5 w-5 mr-2" />
              Compare ({properties.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Property Comparison</DialogTitle>
              <Button variant="outline" onClick={onClearAll}>
                Clear All
              </Button>
            </DialogHeader>
            <ComparisonTable />
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Compare Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <span className="font-medium">{properties.length} properties selected</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClearAll}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setIsOpen(true)}>
              Compare
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
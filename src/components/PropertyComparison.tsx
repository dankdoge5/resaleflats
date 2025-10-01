import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Scale, MapPin, Home, Bed, Bath, Square } from 'lucide-react';
import { Property } from '@/hooks/useProperties';

interface PropertyComparisonProps {
  propertyIds: string[];
  onClose: () => void;
}

export const PropertyComparison = ({ propertyIds, onClose }: PropertyComparisonProps) => {
  const [properties, setProperties] = useState<Property[]>([]);

  // Mock fetch properties - replace with actual API call
  React.useEffect(() => {
    // In real app, fetch properties by IDs from your API
    const mockProperties: Property[] = propertyIds.map(id => ({
      id,
      title: `Property ${id.slice(0, 8)}...`,
      price: Math.floor(Math.random() * 10000000) + 1000000,
      location: "Sample Location",
      bedrooms: Math.floor(Math.random() * 4) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area_sqft: Math.floor(Math.random() * 1000) + 500,
      property_type: "apartment",
      furnished_status: "furnished",
      description: "Sample property description",
      owner_id: "sample-owner",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_urls: [`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000000)}?w=400`],
    }));
    setProperties(mockProperties);
  }, [propertyIds]);

  const handleRemoveProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleClearAll = () => {
    setProperties([]);
    onClose();
  };

  if (properties.length === 0) return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">No properties selected for comparison.</p>
    </div>
  );

  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getImageUrl = (property: Property) => {
    return property.image_urls?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Property Comparison</h3>
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
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
                    onClick={() => handleRemoveProperty(property.id)}
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
      </CardContent>
    </Card>
  );
};
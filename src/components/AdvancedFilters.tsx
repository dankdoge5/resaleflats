import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
}

const AMENITIES = [
  'Swimming Pool', 'Gym/Fitness Center', '24/7 Security', 'Power Backup', 
  'Lift/Elevator', 'Club House', 'Garden/Park', 'Children Play Area',
  'Intercom', 'Maintenance Staff', 'Water Supply', 'Car Parking'
];

const PROPERTY_AGES = [
  { value: 'new', label: 'New/Under Construction' },
  { value: '0-1', label: '0-1 Years' },
  { value: '1-5', label: '1-5 Years' },
  { value: '5-10', label: '5-10 Years' },
  { value: '10+', label: '10+ Years' }
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

const PROPERTY_TYPES = ['apartment', 'penthouse', 'studio', 'duplex'];
const FURNISHED_STATUS = ['furnished', 'semi-furnished', 'unfurnished'];

export const AdvancedFilters = ({ onFiltersChange }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState({
    priceRange: [6000000, 30000000] as [number, number],
    propertyTypes: [] as string[],
    furnishedStatus: [] as string[],
    amenities: [] as string[],
    ageOfProperty: '',
    parking: false,
    balcony: false,
    city: '',
  });

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const onClearFilters = () => {
    const clearedFilters = {
      priceRange: [6000000, 30000000] as [number, number],
      propertyTypes: [] as string[],
      furnishedStatus: [] as string[],
      amenities: [] as string[],
      ageOfProperty: '',
      parking: false,
      balcony: false,
      city: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };
  const handlePriceChange = (value: [number, number]) => {
    updateFilters({ ...filters, priceRange: value });
  };

  const handlePropertyTypeToggle = (type: string) => {
    const updated = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter(t => t !== type)
      : [...filters.propertyTypes, type];
    updateFilters({ ...filters, propertyTypes: updated });
  };

  const handleFurnishedStatusToggle = (status: string) => {
    const updated = filters.furnishedStatus.includes(status)
      ? filters.furnishedStatus.filter(s => s !== status)
      : [...filters.furnishedStatus, status];
    updateFilters({ ...filters, furnishedStatus: updated });
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilters({ ...filters, amenities: updated });
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 6000000 || filters.priceRange[1] < 30000000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.furnishedStatus.length > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.ageOfProperty) count++;
    if (filters.parking) count++;
    if (filters.balcony) count++;
    if (filters.city) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Advanced Filters</CardTitle>
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary">{getActiveFiltersCount()} active</Badge>
          )}
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={30000000}
            min={6000000}
            step={100000}
            className="w-full"
          />
        </div>

        {/* City */}
        <div>
          <label className="text-sm font-medium mb-2 block">City</label>
          <Select value={filters.city} onValueChange={(value) => updateFilters({ ...filters, city: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cities</SelectItem>
              {CITIES.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Property Type</label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map(type => (
              <Button
                key={type}
                variant={filters.propertyTypes.includes(type) ? "default" : "outline"}
                size="sm"
                onClick={() => handlePropertyTypeToggle(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Furnished Status */}
        <div>
          <label className="text-sm font-medium mb-2 block">Furnished Status</label>
          <div className="flex flex-wrap gap-2">
            {FURNISHED_STATUS.map(status => (
              <Button
                key={status}
                variant={filters.furnishedStatus.includes(status) ? "default" : "outline"}
                size="sm"
                onClick={() => handleFurnishedStatusToggle(status)}
                className="capitalize"
              >
                {status.replace('-', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Property Age */}
        <div>
          <label className="text-sm font-medium mb-2 block">Age of Property</label>
          <Select value={filters.ageOfProperty} onValueChange={(value) => updateFilters({ ...filters, ageOfProperty: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Age</SelectItem>
              {PROPERTY_AGES.map(age => (
                <SelectItem key={age.value} value={age.value}>{age.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Features */}
        <div>
          <label className="text-sm font-medium mb-2 block">Additional Features</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parking"
                checked={filters.parking}
                onCheckedChange={(checked) => updateFilters({ ...filters, parking: checked })}
              />
              <label htmlFor="parking" className="text-sm">Car Parking</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="balcony"
                checked={filters.balcony}
                onCheckedChange={(checked) => updateFilters({ ...filters, balcony: checked })}
              />
              <label htmlFor="balcony" className="text-sm">Balcony</label>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-medium mb-2 block">Amenities</label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {AMENITIES.map(amenity => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <label htmlFor={amenity} className="text-xs">{amenity}</label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
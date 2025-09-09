import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Filter } from "lucide-react";

interface FilterState {
  location: string;
  property_type: string;
  min_price: number;
  max_price: number;
  bedrooms: string;
  bathrooms: string;
  min_area: number;
  max_area: number;
  furnished_status: string;
  amenities: string[];
  age: string;
}

interface AdvancedSearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  initialFilters?: any;
}

export const AdvancedSearchFilters = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  initialFilters = {} 
}: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    location: initialFilters.location || "",
    property_type: initialFilters.property_type || "",
    min_price: initialFilters.min_price || 20,
    max_price: initialFilters.max_price || 500,
    bedrooms: initialFilters.bedrooms || "",
    bathrooms: initialFilters.bathrooms || "",
    min_area: initialFilters.min_area || 500,
    max_area: initialFilters.max_area || 3000,
    furnished_status: initialFilters.furnished_status || "",
    amenities: initialFilters.amenities || [],
    age: initialFilters.age || ""
  });

  const amenitiesList = [
    "Parking", "Security", "Gym", "Swimming Pool", "WiFi", "Power Backup",
    "Lift", "Garden", "Club House", "Children's Play Area", "CCTV", "Maintenance Staff"
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      min_price: values[0],
      max_price: values[1]
    }));
  };

  const handleAreaChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      min_area: values[0],
      max_area: values[1]
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      property_type: "",
      min_price: 20,
      max_price: 500,
      bedrooms: "",
      bathrooms: "",
      min_area: 500,
      max_area: 3000,
      furnished_status: "",
      amenities: [],
      age: ""
    });
  };

  const applyFilters = () => {
    const cleanFilters: any = {};
    
    // Only include non-empty filters
    if (filters.location) cleanFilters.location = filters.location;
    if (filters.property_type) cleanFilters.property_type = filters.property_type;
    if (filters.min_price > 20) cleanFilters.min_price = filters.min_price;
    if (filters.max_price < 500) cleanFilters.max_price = filters.max_price;
    if (filters.bedrooms) cleanFilters.bedrooms = parseInt(filters.bedrooms);
    if (filters.bathrooms) cleanFilters.bathrooms = parseInt(filters.bathrooms);
    if (filters.min_area > 500) cleanFilters.min_area = filters.min_area;
    if (filters.max_area < 3000) cleanFilters.max_area = filters.max_area;
    if (filters.furnished_status) cleanFilters.furnished_status = filters.furnished_status;
    if (filters.amenities.length > 0) cleanFilters.amenities = filters.amenities;
    if (filters.age) cleanFilters.age = filters.age;

    onApplyFilters(cleanFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Location & Property Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Enter city, area, or landmark"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
              />
            </div>
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select value={filters.property_type} onValueChange={(value) => setFilters(prev => ({...prev, property_type: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="independent_house">Independent House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <Label>Price Range (₹ Lakhs)</Label>
            <div className="px-4">
              <Slider
                value={[filters.min_price, filters.max_price]}
                onValueChange={handlePriceChange}
                min={20}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹{filters.min_price}L</span>
                <span>₹{filters.max_price}L</span>
              </div>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Select value={filters.bedrooms} onValueChange={(value) => setFilters(prev => ({...prev, bedrooms: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 BHK</SelectItem>
                  <SelectItem value="2">2 BHK</SelectItem>
                  <SelectItem value="3">3 BHK</SelectItem>
                  <SelectItem value="4">4 BHK</SelectItem>
                  <SelectItem value="5">5+ BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Select value={filters.bathrooms} onValueChange={(value) => setFilters(prev => ({...prev, bathrooms: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Area Range */}
          <div className="space-y-4">
            <Label>Area (sq ft)</Label>
            <div className="px-4">
              <Slider
                value={[filters.min_area, filters.max_area]}
                onValueChange={handleAreaChange}
                min={500}
                max={3000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{filters.min_area} sq ft</span>
                <span>{filters.max_area} sq ft</span>
              </div>
            </div>
          </div>

          {/* Furnished Status & Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Furnished Status</Label>
              <Select value={filters.furnished_status} onValueChange={(value) => setFilters(prev => ({...prev, furnished_status: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnished">Fully Furnished</SelectItem>
                  <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Property Age</Label>
              <Select value={filters.age} onValueChange={(value) => setFilters(prev => ({...prev, age: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Under Construction</SelectItem>
                  <SelectItem value="0-1">0-1 Years</SelectItem>
                  <SelectItem value="1-5">1-5 Years</SelectItem>
                  <SelectItem value="5-10">5-10 Years</SelectItem>
                  <SelectItem value="10+">10+ Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Filters */}
          {(Object.values(filters).some(v => v && (Array.isArray(v) ? v.length > 0 : true))) && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.location && (
                  <Badge variant="secondary">Location: {filters.location}</Badge>
                )}
                {filters.property_type && (
                  <Badge variant="secondary">Type: {filters.property_type}</Badge>
                )}
                {filters.bedrooms && (
                  <Badge variant="secondary">{filters.bedrooms} BHK</Badge>
                )}
                {filters.amenities.map(amenity => (
                  <Badge key={amenity} variant="secondary">{amenity}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Reset All
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
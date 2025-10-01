import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFormData } from '@/hooks/useProperties';
import { toast } from '@/hooks/use-toast';
import { propertySchema } from '@/lib/validations';

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

export const PropertyForm = ({ onSubmit, initialData, loading, mode = 'create' }: PropertyFormProps) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData?.title || '',
    price: initialData?.price || 0,
    location: initialData?.location || '',
    bedrooms: initialData?.bedrooms || 1,
    bathrooms: initialData?.bathrooms || 1,
    area_sqft: initialData?.area_sqft || undefined,
    property_type: initialData?.property_type || 'apartment',
    furnished_status: initialData?.furnished_status || 'unfurnished',
    description: initialData?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = propertySchema.safeParse(formData);
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Invalid Property Data",
        description: validation.error.errors[0].message,
      });
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Add New Property' : 'Edit Property'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Modern 2BHK in Bandra West"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹ Lakhs) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                placeholder="85"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Bandra West, Mumbai"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Select 
                value={formData.bedrooms.toString()} 
                onValueChange={(value) => handleChange('bedrooms', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Select 
                value={formData.bathrooms.toString()} 
                onValueChange={(value) => handleChange('bathrooms', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area_sqft || ''}
                onChange={(e) => handleChange('area_sqft', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="950"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type *</Label>
              <Select 
                value={formData.property_type} 
                onValueChange={(value) => handleChange('property_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="furnished_status">Furnished Status *</Label>
              <Select 
                value={formData.furnished_status} 
                onValueChange={(value) => handleChange('furnished_status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                  <SelectItem value="fully_furnished">Fully Furnished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your property features, amenities, etc."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Update Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
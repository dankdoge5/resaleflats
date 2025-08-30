import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PropertyForm } from './PropertyForm';
import { PropertyFormData, useProperties } from '@/hooks/useProperties';

interface PropertyDialogProps {
  children: React.ReactNode;
  property?: any;
  mode?: 'create' | 'edit';
}

export const PropertyDialog = ({ children, property, mode = 'create' }: PropertyDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createProperty, updateProperty, loading } = useProperties();

  const handleSubmit = async (data: PropertyFormData) => {
    if (mode === 'create') {
      const result = await createProperty(data);
      if (result) {
        setOpen(false);
      }
    } else if (mode === 'edit' && property) {
      const result = await updateProperty(property.id, data);
      if (result) {
        setOpen(false);
      }
    }
  };

  const initialData = property ? {
    title: property.title,
    price: property.price,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area_sqft: property.area_sqft,
    property_type: property.property_type,
    furnished_status: property.furnished_status,
    description: property.description,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Property' : 'Edit Property'}
          </DialogTitle>
        </DialogHeader>
        <PropertyForm
          onSubmit={handleSubmit}
          initialData={initialData}
          loading={loading}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};
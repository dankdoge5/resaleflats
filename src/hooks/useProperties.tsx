import { useState, useEffect } from 'react';
import { db } from '@/integrations/supabase/helpers';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number | null;
  image_urls: string[] | null;
  property_type: string;
  furnished_status: string;
  description: string | null;
  is_active: boolean;
  owner_id?: string;
  created_at: string;
  updated_at: string;
  amenities?: string[] | null;
  property_age?: string | null;
  has_parking?: boolean | null;
  has_balcony?: boolean | null;
}

export interface PropertyFormData {
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  property_type: string;
  furnished_status: string;
  description?: string;
  image_urls?: string[];
  amenities?: string[];
  property_age?: string;
  has_parking?: boolean;
  has_balcony?: boolean;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProperties = async (filters?: {
    location?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    priceRange?: [number, number];
    propertyTypes?: string[];
    furnishedStatus?: string[];
    bedrooms?: number[];
    bathrooms?: number[];
    amenities?: string[];
    ageOfProperty?: string;
    parking?: boolean;
    balcony?: boolean;
    city?: string;
  }) => {
    setLoading(true);
    try {
      let query = db
        .from('public_properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.city) {
        query = query.ilike('location', `%${filters.city}%`);
      }
      if (filters?.property_type) {
        query = query.eq('property_type', filters.property_type);
      }
      if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
        query = query.in('property_type', filters.propertyTypes);
      }
      if (filters?.furnishedStatus && filters.furnishedStatus.length > 0) {
        query = query.in('furnished_status', filters.furnishedStatus);
      }
      if (filters?.priceRange) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      } else {
        if (filters?.min_price) query = query.gte('price', filters.min_price);
        if (filters?.max_price) query = query.lte('price', filters.max_price);
      }
      if (filters?.bedrooms && filters.bedrooms.length > 0) {
        query = query.in('bedrooms', filters.bedrooms);
      }
      if (filters?.bathrooms && filters.bathrooms.length > 0) {
        query = query.in('bathrooms', filters.bathrooms);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];
      if (filters?.amenities && filters.amenities.length > 0) {
        filteredData = filteredData.filter((property: any) => {
          if (!property.amenities || !Array.isArray(property.amenities)) return false;
          return filters.amenities!.every((amenity: string) => property.amenities.includes(amenity));
        });
      }
      if (filters?.ageOfProperty) {
        filteredData = filteredData.filter((property: any) => property.property_age === filters.ageOfProperty);
      }
      if (filters?.parking) {
        filteredData = filteredData.filter((property: any) => property.has_parking === true);
      }
      if (filters?.balcony) {
        filteredData = filteredData.filter((property: any) => property.has_balcony === true);
      }

      setProperties(filteredData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({ title: "Error", description: "Failed to fetch properties", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await db
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUserProperties(data || []);
    } catch (error) {
      console.error('Error fetching user properties:', error);
      toast({ title: "Error", description: "Failed to fetch your properties", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await db
        .from('saved_properties')
        .select(`property_id, properties (*)`)
        .eq('user_id', user.id);
      if (error) throw error;
      const savedProps = data?.map((item: any) => item.properties).filter(Boolean) || [];
      setSavedProperties(savedProps as Property[]);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      toast({ title: "Error", description: "Failed to fetch saved properties", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: PropertyFormData) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create a property", variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const { data, error } = await db
        .from('properties')
        .insert([{ ...propertyData, owner_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      toast({ title: "Success", description: "Property created successfully" });
      await fetchUserProperties();
      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      toast({ title: "Error", description: "Failed to create property", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: string, updates: Partial<PropertyFormData>) => {
    setLoading(true);
    try {
      const { data, error } = await db
        .from('properties')
        .update(updates)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select()
        .single();
      if (error) throw error;
      toast({ title: "Success", description: "Property updated successfully" });
      await fetchUserProperties();
      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      toast({ title: "Error", description: "Failed to update property", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await db
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);
      if (error) throw error;
      toast({ title: "Success", description: "Property deleted successfully" });
      await fetchUserProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({ title: "Error", description: "Failed to delete property", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveProperty = async (propertyId: string) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save properties", variant: "destructive" });
      return;
    }
    try {
      const { data: existing } = await db
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (existing) {
        const { error } = await db.from('saved_properties').delete().eq('user_id', user.id).eq('property_id', propertyId);
        if (error) throw error;
        toast({ title: "Removed", description: "Property removed from saved list" });
      } else {
        const { error } = await db.from('saved_properties').insert([{ user_id: user.id, property_id: propertyId }]);
        if (error) throw error;
        toast({ title: "Saved", description: "Property added to saved list" });
      }
      await fetchSavedProperties();
    } catch (error) {
      console.error('Error toggling save property:', error);
      toast({ title: "Error", description: "Failed to save/unsave property", variant: "destructive" });
    }
  };

  const isPropertySaved = (propertyId: string) => {
    return savedProperties.some(prop => prop.id === propertyId);
  };

  useEffect(() => { fetchProperties(); }, []);
  useEffect(() => { if (user) { fetchUserProperties(); fetchSavedProperties(); } }, [user]);

  return {
    properties, userProperties, savedProperties, loading,
    fetchProperties, fetchUserProperties, fetchSavedProperties,
    createProperty, updateProperty, deleteProperty,
    toggleSaveProperty, isPropertySaved
  };
};

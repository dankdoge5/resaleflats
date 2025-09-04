import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  owner_id: string;
  created_at: string;
  updated_at: string;
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
}

export interface PropertyFilters {
  location?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all active properties
  const fetchProperties = async (filters?: PropertyFilters) => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters?.property_type) {
        query = query.eq('property_type', filters.property_type);
      }
      if (filters?.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters?.max_price) {
        query = query.lte('price', filters.max_price);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's properties
  const fetchUserProperties = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserProperties(data || []);
    } catch (error) {
      console.error('Error fetching user properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved properties
  const fetchSavedProperties = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          property_id,
          properties (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const savedProps = data?.map(item => item.properties).filter(Boolean) || [];
      setSavedProperties(savedProps as Property[]);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new property
  const createProperty = async (propertyData: PropertyFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a property",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          ...propertyData,
          owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      await fetchUserProperties();
      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update property
  const updateProperty = async (id: string, updates: Partial<PropertyFormData>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .eq('owner_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      await fetchUserProperties();
      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const deleteProperty = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)
        .eq('owner_id', user?.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      
      await fetchUserProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save/unsave property
  const toggleSaveProperty = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save properties",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already saved
      const { data: existing } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (existing) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        
        toast({
          title: "Removed",
          description: "Property removed from saved list",
        });
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_properties')
          .insert([{
            user_id: user.id,
            property_id: propertyId
          }]);

        if (error) throw error;
        
        toast({
          title: "Saved",
          description: "Property added to saved list",
        });
      }
      
      await fetchSavedProperties();
    } catch (error) {
      console.error('Error toggling save property:', error);
      toast({
        title: "Error",
        description: "Failed to save/unsave property",
        variant: "destructive",
      });
    }
  };

  // Check if property is saved
  const isPropertySaved = (propertyId: string) => {
    return savedProperties.some(prop => prop.id === propertyId);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProperties();
      fetchSavedProperties();
    }
  }, [user]);

  return {
    properties,
    userProperties,
    savedProperties,
    loading,
    fetchProperties,
    fetchUserProperties,
    fetchSavedProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    toggleSaveProperty,
    isPropertySaved
  };
};
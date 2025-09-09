import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PropertyAnalytics {
  property_id: string;
  views: number;
  inquiries: number;
  saves: number;
  last_viewed: string;
}

interface DashboardStats {
  total_properties: number;
  total_views: number;
  total_inquiries: number;
  total_saves: number;
  this_month_views: number;
  this_month_inquiries: number;
}

export const useAnalytics = () => {
  const [propertyAnalytics, setPropertyAnalytics] = useState<PropertyAnalytics[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Track property view
  const trackPropertyView = async (propertyId: string) => {
    if (!propertyId) return;
    
    try {
      // In a real app, you would send this to an analytics service
      // For now, we'll just log it
      console.log('Property view tracked:', propertyId);
      
      // You could store this in a separate analytics table
      // await supabase.from('property_views').insert({
      //   property_id: propertyId,
      //   viewer_id: user?.id,
      //   viewed_at: new Date().toISOString()
      // });
    } catch (error) {
      console.error('Error tracking property view:', error);
    }
  };

  // Track property inquiry
  const trackPropertyInquiry = async (propertyId: string, inquiryType: string = 'contact') => {
    if (!propertyId) return;
    
    try {
      console.log('Property inquiry tracked:', propertyId, inquiryType);
      
      // Store inquiry analytics
      // await supabase.from('property_inquiries').insert({
      //   property_id: propertyId,
      //   inquirer_id: user?.id,
      //   inquiry_type: inquiryType,
      //   inquired_at: new Date().toISOString()
      // });
    } catch (error) {
      console.error('Error tracking property inquiry:', error);
    }
  };

  // Get property analytics for owner
  const getPropertyAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user's properties
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', user.id);

      if (propError) throw propError;

      if (properties) {
        // Generate mock analytics data
        const analytics: PropertyAnalytics[] = properties.map((prop) => ({
          property_id: prop.id,
          views: Math.floor(Math.random() * 100) + 10,
          inquiries: Math.floor(Math.random() * 20) + 1,
          saves: Math.floor(Math.random() * 15) + 1,
          last_viewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }));
        
        setPropertyAnalytics(analytics);
      }
    } catch (error) {
      console.error('Error getting property analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get dashboard statistics
  const getDashboardStats = async () => {
    if (!user) return;
    
    try {
      // Get user's properties count
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      // Generate mock stats
      const stats: DashboardStats = {
        total_properties: totalProperties || 0,
        total_views: Math.floor(Math.random() * 1000) + 100,
        total_inquiries: Math.floor(Math.random() * 50) + 10,
        total_saves: Math.floor(Math.random() * 75) + 15,
        this_month_views: Math.floor(Math.random() * 200) + 20,
        this_month_inquiries: Math.floor(Math.random() * 15) + 3,
      };
      
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
    }
  };

  // Get popular properties (public)
  const getPopularProperties = async () => {
    try {
      // In a real app, you would sort by actual view counts
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .limit(10);

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting popular properties:', error);
      return [];
    }
  };

  // Get trending searches
  const getTrendingSearches = () => {
    // Mock trending searches
    return [
      { query: '2 BHK Mumbai', count: 1250 },
      { query: '3 BHK Bangalore', count: 980 },
      { query: 'Villa Gurgaon', count: 756 },
      { query: '1 BHK Pune', count: 623 },
      { query: 'Penthouse Delhi', count: 445 }
    ];
  };

  useEffect(() => {
    if (user) {
      getPropertyAnalytics();
      getDashboardStats();
    }
  }, [user]);

  return {
    propertyAnalytics,
    dashboardStats,
    loading,
    trackPropertyView,
    trackPropertyInquiry,
    getPropertyAnalytics,
    getDashboardStats,
    getPopularProperties,
    getTrendingSearches
  };
};
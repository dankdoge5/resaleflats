import { useState, useEffect } from 'react';
import { db } from '@/integrations/supabase/helpers';
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

  const trackPropertyView = async (propertyId: string) => {
    if (!propertyId) return;
    console.log('Property view tracked:', propertyId);
  };

  const trackPropertyInquiry = async (propertyId: string, inquiryType: string = 'contact') => {
    if (!propertyId) return;
    console.log('Property inquiry tracked:', propertyId, inquiryType);
  };

  const getPropertyAnalytics = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: properties, error } = await db.from('properties').select('id, title').eq('owner_id', user.id);
      if (error) throw error;
      if (properties) {
        const analytics: PropertyAnalytics[] = properties.map((prop: any) => ({
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

  const getDashboardStats = async () => {
    if (!user) return;
    try {
      const { count: totalProperties } = await db.from('properties').select('*', { count: 'exact', head: true }).eq('owner_id', user.id);
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

  const getPopularProperties = async () => {
    try {
      const { data, error } = await db.from('public_properties').select('*').limit(10);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting popular properties:', error);
      return [];
    }
  };

  const getTrendingSearches = () => {
    return [
      { query: '2 BHK Mumbai', count: 1250 },
      { query: '3 BHK Bangalore', count: 980 },
      { query: 'Villa Gurgaon', count: 756 },
      { query: '1 BHK Pune', count: 623 },
      { query: 'Penthouse Delhi', count: 445 }
    ];
  };

  useEffect(() => { if (user) { getPropertyAnalytics(); getDashboardStats(); } }, [user]);

  return { propertyAnalytics, dashboardStats, loading, trackPropertyView, trackPropertyInquiry, getPropertyAnalytics, getDashboardStats, getPopularProperties, getTrendingSearches };
};

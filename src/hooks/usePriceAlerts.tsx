import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface PriceAlert {
  id: string;
  user_id: string;
  property_id: string;
  target_price: number;
  alert_type: 'below' | 'above';
  is_active: boolean;
  notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export const usePriceAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data || []) as PriceAlert[]);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch price alerts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (
    propertyId: string,
    targetPrice: number,
    alertType: 'below' | 'above'
  ) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to create price alerts',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          property_id: propertyId,
          target_price: targetPrice,
          alert_type: alertType,
        })
        .select()
        .single();

      if (error) throw error;

      setAlerts((prev) => [data as PriceAlert, ...prev]);
      toast({
        title: 'Success',
        description: 'Price alert created successfully',
      });
      return data;
    } catch (error) {
      console.error('Error creating price alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create price alert',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
      toast({
        title: 'Success',
        description: 'Price alert deleted successfully',
      });
      return true;
    } catch (error) {
      console.error('Error deleting price alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete price alert',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('price_alerts')
        .update({ is_active: isActive })
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, is_active: isActive } : alert
        )
      );
      toast({
        title: 'Success',
        description: `Price alert ${isActive ? 'enabled' : 'disabled'}`,
      });
      return true;
    } catch (error) {
      console.error('Error toggling price alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update price alert',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAlertForProperty = (propertyId: string) => {
    return alerts.find((alert) => alert.property_id === propertyId && alert.is_active);
  };

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  return {
    alerts,
    loading,
    createAlert,
    deleteAlert,
    toggleAlert,
    getAlertForProperty,
    fetchAlerts,
  };
};

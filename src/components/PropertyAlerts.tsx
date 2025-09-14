import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Eye, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PropertyAlert {
  id: string;
  property_id: string;
  user_id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  property?: {
    title: string;
    price: number;
    location: string;
    image_urls: string[];
  };
}

export const PropertyAlerts = () => {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAlerts();
      subscribeToAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_alerts')
        .select(`
          *,
          property:properties(title, price, location, image_urls)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToAlerts = () => {
    if (!user) return;

    const channel = supabase
      .channel('property-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_alerts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          fetchAlerts(); // Refetch to get property details
          toast({
            title: "New Property Alert",
            description: payload.new.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('property_alerts')
        .update({ is_read: true })
        .eq('id', alertId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAlerts(alerts =>
        alerts.map(alert =>
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('property_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAlerts(alerts => alerts.filter(alert => alert.id !== alertId));
      
      toast({
        title: "Alert Deleted",
        description: "The alert has been removed."
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = alerts.filter(alert => !alert.is_read).map(alert => alert.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('property_alerts')
        .update({ is_read: true })
        .in('id', unreadIds)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAlerts(alerts =>
        alerts.map(alert => ({ ...alert, is_read: true }))
      );

      toast({
        title: "All alerts marked as read",
        description: `${unreadIds.length} alerts marked as read.`
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'new_property': return 'bg-green-500';
      case 'price_drop': return 'bg-blue-500';
      case 'saved_search': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'new_property': return '🏠';
      case 'price_drop': return '📉';
      case 'saved_search': return '🔍';
      default: return '🔔';
    }
  };

  if (!user) return null;

  const unreadCount = alerts.filter(alert => !alert.is_read).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Property Alerts
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Eye className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6">
            <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No alerts yet</p>
            <p className="text-sm text-muted-foreground">
              Save searches to get notified about new properties
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.is_read ? 'bg-muted/50' : 'bg-background'
                } ${!alert.is_read ? 'border-primary/20' : ''}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.is_read ? 'bg-muted-foreground' : getAlertTypeColor(alert.alert_type)
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`text-sm ${alert.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {getAlertIcon(alert.alert_type)} {alert.message}
                      </p>
                      
                      {alert.property && (
                        <div className="mt-2 p-2 bg-muted/50 rounded border">
                          <div className="flex items-center gap-2">
                            {alert.property.image_urls?.[0] && (
                              <img
                                src={alert.property.image_urls[0]}
                                alt={alert.property.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">
                                {alert.property.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {alert.property.location}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {formatPrice(alert.property.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {!alert.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
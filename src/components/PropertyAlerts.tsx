import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Eye, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();

  const formatPrice = (price: number) => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Property Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Property alerts coming soon</p>
          <p className="text-sm text-muted-foreground">
            Save searches to get notified about new properties
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2, ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PropertyInfo {
  id: string;
  title: string;
  price: number;
  location: string;
}

const PriceAlerts = () => {
  const { alerts, loading, deleteAlert, toggleAlert } = usePriceAlerts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [propertiesInfo, setPropertiesInfo] = useState<Record<string, PropertyInfo>>({});

  useEffect(() => {
    const fetchPropertiesInfo = async () => {
      if (alerts.length === 0) return;

      const propertyIds = [...new Set(alerts.map(alert => alert.property_id))];
      const { data } = await supabase
        .from('public_properties')
        .select('id, title, price, location')
        .in('id', propertyIds);

      if (data) {
        const infoMap: Record<string, PropertyInfo> = {};
        data.forEach(prop => {
          infoMap[prop.id] = prop as PropertyInfo;
        });
        setPropertiesInfo(infoMap);
      }
    };

    fetchPropertiesInfo();
  }, [alerts]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Login Required</h1>
              <p className="text-muted-foreground">Please login to manage your price alerts</p>
            </div>
            <Button onClick={() => navigate('/login')} className="gap-2">
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/properties')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Price Alerts</h1>
          </div>
          <p className="text-muted-foreground">
            {alerts.length === 0
              ? "You haven't set up any price alerts yet"
              : `${alerts.length} ${alerts.length === 1 ? 'alert' : 'alerts'} configured`}
          </p>
        </div>

        {loading && alerts.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-32" />
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Price Alerts</h2>
            <p className="text-muted-foreground mb-6">
              Set up alerts to get notified when property prices change
            </p>
            <Button onClick={() => navigate('/properties')} variant="default" className="gap-2">
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const property = propertiesInfo[alert.property_id];
              const priceDiff = property ? property.price - alert.target_price : 0;
              const isTriggered =
                property &&
                ((alert.alert_type === 'below' && property.price <= alert.target_price) ||
                  (alert.alert_type === 'above' && property.price >= alert.target_price));

              return (
                <Card key={alert.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {alert.alert_type === 'below' ? (
                              <TrendingDown className="h-5 w-5 text-success" />
                            ) : (
                              <TrendingUp className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {property?.title || 'Loading...'}
                            </h3>
                            {property && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {property.location}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={isTriggered ? 'default' : 'secondary'}>
                                {alert.alert_type === 'below' ? 'Below' : 'Above'} ₹
                                {alert.target_price}L
                              </Badge>
                              {property && (
                                <Badge variant="outline">
                                  Current: ₹{property.price}L
                                </Badge>
                              )}
                              {isTriggered && (
                                <Badge variant="default" className="bg-success">
                                  Alert Triggered!
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {property && priceDiff !== 0 && (
                          <div className="ml-8 text-sm text-muted-foreground">
                            {Math.abs(priceDiff) > 0 && (
                              <span>
                                {priceDiff > 0 ? '₹' + priceDiff.toFixed(1) + 'L above' : '₹' + Math.abs(priceDiff).toFixed(1) + 'L below'} target
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  properties: Array<{
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
  }>;
  onPropertyClick?: (propertyId: string) => void;
}

export const PropertyMap = ({ properties, onPropertyClick }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [tokenError, setTokenError] = useState('');

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [77.5946, 12.9716], // Bangalore coordinates as default
        zoom: 11,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for properties (simplified locations for demo)
      const cityCoordinates: { [key: string]: [number, number] } = {
        'Mumbai': [72.8777, 19.0760],
        'Bangalore': [77.5946, 12.9716],
        'Delhi': [77.1025, 28.7041],
      };

      properties.forEach((property, index) => {
        const city = property.location.split(',').pop()?.trim() || 'Bangalore';
        let coords = cityCoordinates[city] || [77.5946, 12.9716];
        
        // Add slight offset for multiple properties in same city
        coords = [
          coords[0] + (Math.random() - 0.5) * 0.1,
          coords[1] + (Math.random() - 0.5) * 0.1
        ];

        const marker = new mapboxgl.Marker({
          color: '#8B5CF6',
        })
          .setLngLat(coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
                  <p class="text-xs text-gray-600 mb-1">${property.location}</p>
                  <p class="text-sm font-bold text-primary">₹${property.price}L</p>
                  <p class="text-xs text-gray-500">${property.bedrooms}BHK • ${property.bathrooms} Bath</p>
                </div>
              `)
          )
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          if (onPropertyClick) {
            onPropertyClick(property.id);
          }
        });
      });

      setShowTokenInput(false);
      setTokenError('');
    } catch (error) {
      setTokenError('Invalid Mapbox token. Please check your token and try again.');
      console.error('Mapbox initialization error:', error);
    }
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      setTokenError('Please enter a Mapbox token');
      return;
    }
    initializeMap(mapboxToken);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center space-y-4">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Enable Map View</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your Mapbox public token to view properties on a map.
            Get your free token at{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
          />
          {tokenError && (
            <p className="text-sm text-destructive">{tokenError}</p>
          )}
          <Button onClick={handleTokenSubmit} className="w-full">
            Enable Map View
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-border shadow-md">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

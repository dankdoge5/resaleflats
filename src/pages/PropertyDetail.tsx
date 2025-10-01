import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContactRequestDialog } from "@/components/ContactRequestDialog";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  Car,
  Shield,
  Wifi,
  Dumbbell,
  Waves
} from "lucide-react";

interface PropertyDetail {
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
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleSaveProperty, isPropertySaved } = useProperties();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading property...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
            <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${price} L`;
  };

  const images = property.image_urls || [];
  const amenities = ['Parking', 'Security', 'Gym', 'Swimming Pool', 'WiFi', 'Power Backup'];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-96 object-cover"
                    />
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Property Info */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        ₹{formatPrice(property.price)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleSaveProperty(property.id)}
                      >
                        <Heart className={`h-4 w-4 ${isPropertySaved(property.id) ? 'fill-current text-destructive' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <Badge variant="secondary" className="gap-1">
                      <Bed className="h-3 w-3" />
                      {property.bedrooms} Bedrooms
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Bath className="h-3 w-3" />
                      {property.bathrooms} Bathrooms
                    </Badge>
                    {property.area_sqft && (
                      <Badge variant="secondary" className="gap-1">
                        <Square className="h-3 w-3" />
                        {property.area_sqft} sq ft
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {property.property_type}
                    </Badge>
                    <Badge variant="outline">
                      {property.furnished_status}
                    </Badge>
                  </div>
                </div>

                {property.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                  </>
                )}

                <Separator />
                
                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.map((amenity, index) => {
                      const IconComponent = {
                        'Parking': Car,
                        'Security': Shield,
                        'Gym': Dumbbell,
                        'Swimming Pool': Waves,
                        'WiFi': Wifi,
                        'Power Backup': Shield
                      }[amenity] || Shield;

                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
                <div className="space-y-3">
                  <ContactRequestDialog
                    propertyId={property.id}
                    propertyOwnerId={property.owner_id}
                    propertyTitle={property.title}
                  >
                    <Button className="w-full gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Owner
                    </Button>
                  </ContactRequestDialog>
                  
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </Button>
                  
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Visit
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Property listed on {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* EMI Calculator */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">EMI Calculator</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Property Price:</span>
                    <span className="font-semibold">₹{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Down Payment (20%):</span>
                    <span className="font-semibold">₹{formatPrice(property.price * 0.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loan Amount:</span>
                    <span className="font-semibold">₹{formatPrice(property.price * 0.8)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-primary">
                    <span className="font-semibold">Estimated EMI:</span>
                    <span className="font-semibold">₹{Math.round(property.price * 0.8 * 100000 * 0.009 / (1 - Math.pow(1 + 0.009, -240))).toLocaleString()}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Detailed Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
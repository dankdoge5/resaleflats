import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  Calendar,
  Star,
  ArrowLeft
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { properties, toggleSaveProperty, isPropertySaved } = useProperties();
  const [property, setProperty] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (property && user) {
      setIsSaved(isPropertySaved(property.id));
    }
  }, [property, user, isPropertySaved]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (properties.length > 0 && id) {
      const foundProperty = properties.find(p => p.id === id);
      if (foundProperty) {
        setProperty(foundProperty);
      } else {
        navigate('/properties');
      }
    }
  }, [properties, id, navigate]);

  const handleSaveProperty = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to save properties.",
      });
      return;
    }

    await toggleSaveProperty(property.id);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
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

  const images = [property.image, property.image, property.image]; // Mock multiple images

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/properties')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={images[activeImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      activeImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    <div className="text-2xl font-bold text-primary">{property.price}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={isSaved ? "default" : "outline"} 
                      size="icon"
                      onClick={handleSaveProperty}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.area} sq ft</div>
                    <div className="text-sm text-muted-foreground">Area</div>
                  </div>
                  <div className="text-center">
                    <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">1</div>
                    <div className="text-sm text-muted-foreground">Parking</div>
                  </div>
                </div>

                <Separator className="my-6" />

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-6">
                    <p className="text-muted-foreground leading-relaxed">
                      This beautiful {property.type} property offers modern amenities and a prime location. 
                      Perfect for families looking for comfort and convenience. The property features 
                      high-quality finishes, spacious rooms, and excellent connectivity to major landmarks.
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="amenities" className="mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      {['Air Conditioning', 'Balcony', 'Gym', 'Swimming Pool', 'Security', 'Garden'].map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location" className="mt-6">
                    <p className="text-muted-foreground mb-4">
                      Located in the heart of {property.location}, this property offers excellent connectivity 
                      to schools, hospitals, shopping centers, and public transportation.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Distance to Metro:</span>
                        <span className="text-sm font-medium">0.5 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Distance to Airport:</span>
                        <span className="text-sm font-medium">15 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Distance to Mall:</span>
                        <span className="text-sm font-medium">2 km</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold">John Doe</div>
                    <div className="text-sm text-muted-foreground">Property Agent</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Property ID:</span>
                  <span className="text-sm font-medium">{property.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm font-medium">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Listed:</span>
                  <span className="text-sm font-medium">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Views:</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
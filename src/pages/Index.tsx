import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Shield, 
  Users, 
  Star,
  CheckCircle,
  Home,
  MapPin,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-apartments.jpg";
import apartmentInterior from "@/assets/apartment-interior.jpg";
import apartmentKitchen from "@/assets/apartment-kitchen.jpg";

const Index = () => {
  const { user } = useAuth();
  const { properties, loading } = useProperties();
  const navigate = useNavigate();
  const [filteredProperties, setFilteredProperties] = useState(properties);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const handleSearch = (filters: any) => {
    // This will be handled by the useProperties hook automatically
    console.log('Search filters:', filters);
  };
  const featuredProperties = [
    {
      id: "1",
      title: "Modern 2BHK in Bandra West",
      price: "55 Lakhs",
      location: "Bandra West, Mumbai",
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      image: apartmentInterior,
      property_type: "apartment",
      type: "2BHK",
      featured: true
    },
    {
      id: "2",
      title: "Spacious 3BHK in Koramangala",
      price: "75 Lakhs", 
      location: "Koramangala, Bangalore",
      bedrooms: 3,
      bathrooms: 3,
      area: 1350,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "3",
      title: "Cozy 1BHK in Andheri",
      price: "38 Lakhs",
      location: "Andheri East, Mumbai", 
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      image: apartmentInterior,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "4",
      title: "Comfortable 2BHK in Whitefield",
      price: "48 Lakhs",
      location: "Whitefield, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "5",
      title: "Modern 3BHK in Indiranagar",
      price: "82 Lakhs",
      location: "Indiranagar, Bangalore",
      bedrooms: 3,
      bathrooms: 2,
      area: 1400,
      image: apartmentInterior,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "6",
      title: "Affordable 1BHK in Electronic City",
      price: "32 Lakhs",
      location: "Electronic City, Bangalore",
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "7",
      title: "Spacious 2BHK in HSR Layout",
      price: "58 Lakhs",
      location: "HSR Layout, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      image: apartmentInterior,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "8",
      title: "Premium 3BHK in Jayanagar",
      price: "78 Lakhs",
      location: "Jayanagar, Bangalore",
      bedrooms: 3,
      bathrooms: 3,
      area: 1500,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "9",
      title: "Compact 1BHK in Marathahalli",
      price: "35 Lakhs",
      location: "Marathahalli, Bangalore",
      bedrooms: 1,
      bathrooms: 1,
      area: 580,
      image: apartmentInterior,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "10",
      title: "Beautiful 2BHK in Bellandur",
      price: "52 Lakhs",
      location: "Bellandur, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1000,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "11",
      title: "Elegant 3BHK in Sarjapur Road",
      price: "68 Lakhs",
      location: "Sarjapur Road, Bangalore",
      bedrooms: 3,
      bathrooms: 2,
      area: 1350,
      image: apartmentInterior,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "12",
      title: "Cozy 1BHK in BTM Layout",
      price: "36 Lakhs",
      location: "BTM Layout, Bangalore",
      bedrooms: 1,
      bathrooms: 1,
      area: 620,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "13",
      title: "Luxurious 2BHK in JP Nagar",
      price: "62 Lakhs",
      location: "JP Nagar, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1150,
      image: apartmentInterior,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "14",
      title: "Spacious 3BHK in Banashankari",
      price: "72 Lakhs",
      location: "Banashankari, Bangalore",
      bedrooms: 3,
      bathrooms: 3,
      area: 1450,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "15",
      title: "Affordable 1BHK in Yelahanka",
      price: "30 Lakhs",
      location: "Yelahanka, Bangalore",
      bedrooms: 1,
      bathrooms: 1,
      area: 550,
      image: apartmentInterior,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "16",
      title: "Modern 2BHK in Hebbal",
      price: "54 Lakhs",
      location: "Hebbal, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1080,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "17",
      title: "Premium 3BHK in Malleshwaram",
      price: "85 Lakhs",
      location: "Malleshwaram, Bangalore",
      bedrooms: 3,
      bathrooms: 3,
      area: 1550,
      image: apartmentInterior,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "18",
      title: "Compact 1BHK in Ramamurthy Nagar",
      price: "34 Lakhs",
      location: "Ramamurthy Nagar, Bangalore",
      bedrooms: 1,
      bathrooms: 1,
      area: 590,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "19",
      title: "Stylish 2BHK in RT Nagar",
      price: "50 Lakhs",
      location: "RT Nagar, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1020,
      image: apartmentInterior,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "20",
      title: "Spacious 3BHK in Rajajinagar",
      price: "76 Lakhs",
      location: "Rajajinagar, Bangalore",
      bedrooms: 3,
      bathrooms: 2,
      area: 1420,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "3BHK"
    },
    {
      id: "21",
      title: "Budget 1BHK in Hoodi",
      price: "28 Lakhs",
      location: "Hoodi, Bangalore",
      bedrooms: 1,
      bathrooms: 1,
      area: 540,
      image: apartmentInterior,
      property_type: "apartment",
      type: "1BHK"
    },
    {
      id: "22",
      title: "Comfortable 2BHK in Kalyan Nagar",
      price: "56 Lakhs",
      location: "Kalyan Nagar, Bangalore",
      bedrooms: 2,
      bathrooms: 2,
      area: 1120,
      image: apartmentKitchen,
      property_type: "apartment",
      type: "2BHK"
    },
    {
      id: "23",
      title: "Elegant 3BHK in Sahakara Nagar",
      price: "70 Lakhs",
      location: "Sahakara Nagar, Bangalore",
      bedrooms: 3,
      bathrooms: 3,
      area: 1380,
      image: apartmentInterior,
      property_type: "apartment",
      type: "3BHK"
    }
  ];

  const stats = [
    { icon: Home, label: "Properties Listed", value: "25,000+" },
    { icon: Users, label: "Happy Customers", value: "15,000+" },
    { icon: MapPin, label: "Cities Covered", value: "50+" },
    { icon: Star, label: "Average Rating", value: "4.8/5" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Modern apartments"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  #1 Resale Property Platform
                </Badge>
                <h1 className="text-5xl font-bold text-foreground leading-tight">
                  Find Your Perfect
                  <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> Resale Home</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Discover thousands of verified resale apartments from trusted sellers. 
                  No broker hassles, transparent pricing, verified listings.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="gap-2" onClick={() => navigate('/properties')}>
                  <Home className="h-5 w-5" />
                  Browse Properties
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => user ? navigate('/dashboard') : navigate('/signup')}
                >
                  {user ? 'My Dashboard' : 'List Your Property'}
                </Button>
              </div>
              
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-muted-foreground">Verified Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success" />
                  <span className="text-muted-foreground">Secure Transactions</span>
                </div>
              </div>
            </div>
            
            <div className="lg:flex justify-center hidden">
              <div className="bg-background/20 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search */}
      <section className="lg:hidden px-4 -mt-10 relative z-10">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-background rounded-xl p-6 shadow-md">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {properties.length > 0 ? 'Latest Properties' : 'Featured Properties'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {properties.length > 0 
                ? 'Browse the latest resale apartments from verified sellers'
                : 'Handpicked premium resale apartments from verified sellers across top cities'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-muted rounded h-4 w-3/4"></div>
                    <div className="bg-muted rounded h-4 w-1/2"></div>
                    <div className="bg-muted rounded h-4 w-1/4"></div>
                  </div>
                </div>
              ))
            ) : properties.length > 0 ? (
              properties.slice(0, 6).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
          
          <div className="text-center">
            <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate('/properties')}>
              View All Properties
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose ResaleFlats.in?
            </h2>
            <p className="text-lg text-muted-foreground">
              India's most trusted platform for resale apartments
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-md border-0 text-center">
              <CardContent className="p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Verified Listings</h3>
                <p className="text-muted-foreground">
                  Every property is verified by our expert team to ensure authenticity and accuracy
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0 text-center">
              <CardContent className="p-8">
                <div className="bg-success/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Best Prices</h3>
                <p className="text-muted-foreground">
                  Direct deals with owners mean better prices and no broker commissions
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-0 text-center">
              <CardContent className="p-8">
                <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
                <p className="text-muted-foreground">
                  Dedicated support team to guide you through your property journey
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of happy homeowners who found their perfect resale apartment with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate('/properties')}>
                Start Searching Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => user ? navigate('/dashboard') : navigate('/signup')}
              >
                {user ? 'Go to Dashboard' : 'List Your Property'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-primary to-primary-glow p-2 rounded-lg">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">ResaleFlats.in</h3>
                <p className="text-xs text-muted-foreground">Find Your Perfect Home</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 ResaleFlats.in. All rights reserved. 
              Made with ❤️ for Indian homebuyers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

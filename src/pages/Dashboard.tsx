import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Heart, 
  Search, 
  Bell, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Square
} from "lucide-react";

const Dashboard = () => {
  const savedProperties = [
    {
      id: "1",
      title: "Modern 2BHK in Bandra West",
      location: "Bandra West, Mumbai",
      price: "85 Lakhs",
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      image: "/placeholder.svg"
    },
    {
      id: "2", 
      title: "Spacious 3BHK in Koramangala",
      location: "Koramangala, Bangalore",
      price: "1.2 Crores",
      bedrooms: 3,
      bathrooms: 3,
      area: 1200,
      image: "/placeholder.svg"
    }
  ];

  const myListings = [
    {
      id: "1",
      title: "Luxury 3BHK in Powai",
      location: "Powai, Mumbai",
      price: "1.5 Crores",
      status: "Active",
      views: 245,
      inquiries: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header isLoggedIn={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Manage your properties and find your dream home</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">12</p>
                  <p className="text-sm text-muted-foreground">Saved Properties</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-success/10 p-3 rounded-lg">
                  <Home className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">My Listings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Search className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Active Searches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <Bell className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5</p>
                  <p className="text-sm text-muted-foreground">New Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="searches">Searches</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Saved Properties</h2>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Find More
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <Card key={property.id} className="shadow-md border-0 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 bg-background/80"
                    >
                      <Heart className="h-4 w-4 fill-current text-destructive" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.area} sq ft
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{property.price}</span>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">My Listings</h2>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Button>
            </div>
            
            <div className="space-y-4">
              {myListings.map((listing) => (
                <Card key={listing.id} className="shadow-md border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{listing.title}</h3>
                          <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location}
                        </div>
                        <div className="text-xl font-bold text-primary">₹{listing.price}</div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {listing.views} views
                          </div>
                          <div>
                            {listing.inquiries} inquiries
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="searches" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Saved Searches</h2>
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle>2BHK in Mumbai</CardTitle>
                <CardDescription>Budget: ₹50L - ₹80L • Updated 2 hours ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">23 new properties match your criteria</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Results</Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Account Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md border-0">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Edit Profile</Button>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-0">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your alert settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Manage Alerts</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyDialog } from "@/components/PropertyDialog";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const { user, loading } = useAuth();
  const { userProperties, savedProperties, deleteProperty, loading: propertiesLoading } = useProperties();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      await deleteProperty(propertyId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header isLoggedIn={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
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
                   <p className="text-2xl font-bold text-foreground">{savedProperties.length}</p>
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
                   <p className="text-2xl font-bold text-foreground">{userProperties.length}</p>
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
              {savedProperties.length > 0 ? (
                savedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    showSaveButton={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No saved properties yet. Start browsing to save your favorites!</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
                    Browse Properties
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">My Listings</h2>
              <PropertyDialog mode="create">
                <Button variant="hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Listing
                </Button>
              </PropertyDialog>
            </div>
            
            <div className="space-y-4">
              {userProperties.length > 0 ? (
                userProperties.map((listing) => (
                  <Card key={listing.id} className="shadow-md border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{listing.title}</h3>
                            <Badge variant={listing.is_active ? 'default' : 'secondary'}>
                              {listing.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {listing.location}
                          </div>
                          <div className="text-xl font-bold text-primary">
                            ₹{listing.price >= 100 ? `${(listing.price / 100).toFixed(1)} Cr` : `${listing.price} L`}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              0 views
                            </div>
                            <div>
                              0 inquiries
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <PropertyDialog mode="edit" property={listing}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PropertyDialog>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteProperty(listing.id)}
                              disabled={propertiesLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
                  <PropertyDialog mode="create">
                    <Button variant="hero">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Listing
                    </Button>
                  </PropertyDialog>
                </div>
              )}
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
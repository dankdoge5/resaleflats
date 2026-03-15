import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { useContactRequests } from "@/hooks/useContactRequests";
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
  MessageCircle,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const, color: "text-yellow-600" },
  approved: { label: "Approved", icon: CheckCircle, variant: "default" as const, color: "text-green-600" },
  denied: { label: "Denied", icon: XCircle, variant: "destructive" as const, color: "text-destructive" },
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { userProperties, savedProperties, deleteProperty, loading: propertiesLoading } = useProperties();
  const { myRequests, receivedRequests, updateContactRequestStatus, loading: contactLoading } = useContactRequests();
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

  const pendingReceived = receivedRequests.filter(r => r.status === 'pending').length;

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
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
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
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{myRequests.length}</p>
                  <p className="text-sm text-muted-foreground">Sent Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <Inbox className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingReceived}</p>
                  <p className="text-sm text-muted-foreground">Pending Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="received" className="relative">
              Received
              {pendingReceived > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingReceived}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Saved Properties</h2>
              <Button variant="outline" onClick={() => navigate('/properties')}>
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
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/properties')}>
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
                            ₹{listing.price} L
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
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

          {/* Sent Contact Requests */}
          <TabsContent value="sent" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Sent Contact Requests</h2>
              <Button variant="outline" onClick={() => navigate('/messages')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </div>
            
            <div className="space-y-4">
              {myRequests.length > 0 ? (
                myRequests.map((request) => {
                  const config = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <Card key={request.id} className="shadow-md border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-semibold">
                                {request.property?.title || 'Property'}
                              </h3>
                              <Badge variant={config.variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            {request.property?.location && (
                              <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                {request.property.location}
                              </div>
                            )}
                            {request.message && (
                              <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3 mt-2">
                                {request.message}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Sent {format(new Date(request.created_at), 'MMM d, yyyy · h:mm a')}
                            </p>
                          </div>
                          {request.status === 'approved' && (
                            <Button size="sm" onClick={() => navigate('/messages')}>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No contact requests sent yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/properties')}>
                    Browse Properties
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Received Contact Requests */}
          <TabsContent value="received" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Received Inquiries</h2>
            
            <div className="space-y-4">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request) => {
                  const config = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <Card key={request.id} className="shadow-md border-0">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-semibold">
                                {request.property?.title || 'Property'}
                              </h3>
                              <Badge variant={config.variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground">
                              From: <strong>{request.requester_profile?.full_name || 'Unknown User'}</strong>
                            </p>
                            {request.message && (
                              <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3">
                                {request.message}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Received {format(new Date(request.created_at), 'MMM d, yyyy · h:mm a')}
                            </p>
                          </div>
                          {request.status === 'pending' && (
                            <div className="flex gap-2 shrink-0">
                              <Button
                                size="sm"
                                onClick={() => updateContactRequestStatus(request.id, 'approved')}
                                disabled={contactLoading}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateContactRequestStatus(request.id, 'denied')}
                                disabled={contactLoading}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Deny
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inquiries received yet.</p>
                </div>
              )}
            </div>
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
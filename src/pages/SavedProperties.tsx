import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Heart, Home, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const SavedProperties = () => {
  const { savedProperties, loading, fetchSavedProperties } = useProperties();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Login Required</h1>
              <p className="text-muted-foreground">Please login to view your saved properties</p>
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/properties')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Saved Properties</h1>
          </div>
          <p className="text-muted-foreground">
            {savedProperties.length === 0 
              ? "You haven't saved any properties yet"
              : `${savedProperties.length} ${savedProperties.length === 1 ? 'property' : 'properties'} saved`
            }
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64 mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-muted rounded h-6 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                  <div className="bg-muted rounded h-4 w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : savedProperties.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="bg-muted/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Saved Properties</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and save properties you're interested in
            </p>
            <Button onClick={() => navigate('/properties')} variant="default" className="gap-2">
              <Home className="h-4 w-4" />
              Browse Properties
            </Button>
          </div>
        ) : (
          // Properties Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SavedSearch {
  id: string;
  name: string;
  search_criteria: any;
  notifications_enabled: boolean;
  created_at: string;
  user_id: string;
}

interface SavedSearchesProps {
  currentFilters: any;
  onLoadSearch: (criteria: any) => void;
}

export const SavedSearches = ({ currentFilters, onLoadSearch }: SavedSearchesProps) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
    }
  }, [user]);

  const fetchSavedSearches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async () => {
    if (!user || !searchName.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('saved_searches')
        .insert({
          name: searchName,
          search_criteria: currentFilters,
          user_id: user.id,
          notifications_enabled: true
        });

      if (error) throw error;

      toast({
        title: "Search Saved",
        description: "Your search criteria has been saved successfully."
      });

      setSearchName('');
      setIsOpen(false);
      fetchSavedSearches();
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: "Error",
        description: "Failed to save search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Search Deleted",
        description: "Saved search has been deleted."
      });

      fetchSavedSearches();
    } catch (error) {
      console.error('Error deleting search:', error);
      toast({
        title: "Error",
        description: "Failed to delete search. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleNotifications = async (searchId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ notifications_enabled: enabled })
        .eq('id', searchId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSavedSearches(searches => 
        searches.map(search => 
          search.id === searchId 
            ? { ...search, notifications_enabled: enabled }
            : search
        )
      );

      toast({
        title: enabled ? "Notifications Enabled" : "Notifications Disabled",
        description: `You will ${enabled ? 'now' : 'no longer'} receive alerts for this search.`
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const getSearchSummary = (criteria: any) => {
    const parts = [];
    if (criteria.city) parts.push(criteria.city);
    if (criteria.propertyTypes?.length > 0) parts.push(criteria.propertyTypes.join(', '));
    if (criteria.priceRange && (criteria.priceRange[0] > 0 || criteria.priceRange[1] < 50000000)) {
      const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
      };
      parts.push(`${formatPrice(criteria.priceRange[0])} - ${formatPrice(criteria.priceRange[1])}`);
    }
    return parts.join(' • ') || 'All properties';
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Saved Searches</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Save Current Search
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Search</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter search name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <div className="text-sm text-muted-foreground">
                Current search: {getSearchSummary(currentFilters)}
              </div>
              <Button 
                onClick={saveSearch} 
                disabled={!searchName.trim() || isSaving}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Save Search'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading saved searches...</div>
      ) : savedSearches.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No saved searches yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {savedSearches.map(search => (
            <Card key={search.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{search.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getSearchSummary(search.search_criteria)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Saved {new Date(search.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant={search.notifications_enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleNotifications(search.id, !search.notifications_enabled)}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLoadSearch(search.search_criteria)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSearch(search.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
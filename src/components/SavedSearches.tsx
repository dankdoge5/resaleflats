import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  const [searchName, setSearchName] = useState('');
  const { user } = useAuth();

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
                  onClick={() => {
                    setSearchName('');
                    setIsOpen(false);
                  }}
                  disabled={!searchName.trim()}
                  className="w-full"
                >
                  Save Search (Coming Soon)
                </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="text-center py-6">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Saved searches coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
};
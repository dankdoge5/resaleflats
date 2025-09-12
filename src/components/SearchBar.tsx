import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useProperties } from "@/hooks/useProperties";

interface SearchBarProps {
  onSearch?: (filters: any) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const { fetchProperties } = useProperties();

  const handleSearch = () => {
    const filters: any = {};
    
    if (location) filters.location = location;
    if (propertyType) filters.property_type = propertyType;
    if (budget) {
      if (budget === "100-") {
        // ₹1Cr+ case
        filters.min_price = 10000000; // 1 crore
      } else {
        const [min, max] = budget.split('-').map(b => b ? parseFloat(b) * 100000 : null); // Convert lakhs to actual amount
        if (min) filters.min_price = min;
        if (max) filters.max_price = max;
      }
    }

    if (onSearch) {
      onSearch(filters);
    } else {
      fetchProperties(filters);
    }
  };
  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Enter location..." 
            className="pl-10 border-border/50 focus:border-primary/50"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="border-border/50 focus:border-primary/50">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="independent_house">Independent House</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="penthouse">Penthouse</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={budget} onValueChange={setBudget}>
          <SelectTrigger className="border-border/50 focus:border-primary/50">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Budget" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20-40">₹20L - ₹40L</SelectItem>
            <SelectItem value="40-60">₹40L - ₹60L</SelectItem>
            <SelectItem value="60-80">₹60L - ₹80L</SelectItem>
            <SelectItem value="80-100">₹80L - ₹1Cr</SelectItem>
            <SelectItem value="100-">₹1Cr+</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="hero" size="lg" className="gap-2" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          Search Properties
        </Button>
      </div>
    </div>
  );
};
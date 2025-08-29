import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Enter location..." 
            className="pl-10 border-border/50 focus:border-primary/50"
          />
        </div>
        
        <Select>
          <SelectTrigger className="border-border/50 focus:border-primary/50">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1bhk">1 BHK</SelectItem>
            <SelectItem value="2bhk">2 BHK</SelectItem>
            <SelectItem value="3bhk">3 BHK</SelectItem>
            <SelectItem value="4bhk">4+ BHK</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
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
            <SelectItem value="100+">₹1Cr+</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="hero" size="lg" className="gap-2">
          <Search className="h-4 w-4" />
          Search Properties
        </Button>
      </div>
    </div>
  );
};
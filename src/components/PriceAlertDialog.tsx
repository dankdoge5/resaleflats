import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bell } from 'lucide-react';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';

interface PriceAlertDialogProps {
  propertyId: string;
  currentPrice: number;
  propertyTitle: string;
  children?: React.ReactNode;
}

export const PriceAlertDialog = ({
  propertyId,
  currentPrice,
  propertyTitle,
  children,
}: PriceAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(currentPrice * 0.9); // Default 10% below
  const [alertType, setAlertType] = useState<'below' | 'above'>('below');
  const { createAlert, loading } = usePriceAlerts();

  const handleSubmit = async () => {
    const result = await createAlert(propertyId, targetPrice, alertType);
    if (result) {
      setOpen(false);
      setTargetPrice(currentPrice * 0.9);
      setAlertType('below');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            Set Price Alert
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>
            Get notified when the price of "{propertyTitle}" changes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Price</Label>
            <div className="text-2xl font-bold text-primary">₹{currentPrice}L</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-price">Target Price (in Lakhs)</Label>
            <Input
              id="target-price"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              placeholder="Enter target price"
              step="0.1"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Alert When Price Is</Label>
            <RadioGroup value={alertType} onValueChange={(value: any) => setAlertType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="below" id="below" />
                <Label htmlFor="below" className="font-normal cursor-pointer">
                  Below target price
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="above" id="above" />
                <Label htmlFor="above" className="font-normal cursor-pointer">
                  Above target price
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground">
              You'll be notified when the property price goes{' '}
              <span className="font-semibold text-foreground">
                {alertType === 'below' ? 'below' : 'above'} ₹{targetPrice}L
              </span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !targetPrice}>
            {loading ? 'Creating...' : 'Create Alert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

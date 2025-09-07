import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useContactRequests } from '@/hooks/useContactRequests';

interface ContactRequestDialogProps {
  children: React.ReactNode;
  propertyId: string;
  propertyOwnerId: string;
  propertyTitle: string;
}

export const ContactRequestDialog = ({ 
  children, 
  propertyId, 
  propertyOwnerId, 
  propertyTitle 
}: ContactRequestDialogProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { createContactRequest, loading } = useContactRequests();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await createContactRequest(propertyId, propertyOwnerId, message);
    if (success) {
      setMessage('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Send a contact request for: <strong>{propertyTitle}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              The property owner will be able to see your contact information only if they approve your request.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell the owner why you're interested in this property..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
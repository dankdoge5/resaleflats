import { useState, useEffect } from 'react';
import { db } from '@/integrations/supabase/helpers';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface ContactRequest {
  id: string;
  property_id: string;
  requester_id: string;
  property_owner_id: string;
  message: string | null;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  updated_at: string;
  property?: { title: string; location: string };
  requester_profile?: { full_name: string; phone: string };
}

export const useContactRequests = () => {
  const [loading, setLoading] = useState(false);
  const [myRequests, setMyRequests] = useState<ContactRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const { user } = useAuth();

  const createContactRequest = async (propertyId: string, propertyOwnerId: string, message?: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Required", description: "Please log in to contact property owners." });
      return false;
    }
    setLoading(true);
    try {
      const { error } = await db.from('contact_requests').insert({
        property_id: propertyId, requester_id: user.id, property_owner_id: propertyOwnerId, message: message || null,
      });
      if (error) {
        if (error.code === '23505') {
          toast({ variant: "destructive", title: "Request Already Sent", description: "You have already sent a contact request for this property." });
        } else { throw error; }
        return false;
      }
      toast({ title: "Contact Request Sent", description: "Your contact request has been sent to the property owner." });
      await fetchMyRequests();
      return true;
    } catch (error) {
      console.error('Error creating contact request:', error);
      toast({ variant: "destructive", title: "Request Failed", description: "Failed to send contact request. Please try again." });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateContactRequestStatus = async (requestId: string, status: 'approved' | 'denied') => {
    if (!user) return false;
    setLoading(true);
    try {
      const { error } = await db.from('contact_requests').update({ status }).eq('id', requestId).eq('property_owner_id', user.id);
      if (error) throw error;
      toast({ title: status === 'approved' ? "Request Approved" : "Request Denied", description: `Contact request has been ${status}.` });
      await fetchReceivedRequests();
      return true;
    } catch (error) {
      console.error('Error updating contact request:', error);
      toast({ variant: "destructive", title: "Update Failed", description: "Failed to update request status. Please try again." });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await db.from('contact_requests').select(`*, property:properties(title, location)`).eq('requester_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setMyRequests(data as ContactRequest[] || []);
    } catch (error) {
      console.error('Error fetching my requests:', error);
    }
  };

  const fetchReceivedRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await db.from('contact_requests').select(`*, property:properties(title, location), requester_profile:profiles!contact_requests_requester_id_fkey(full_name)`).eq('property_owner_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setReceivedRequests((data as any) || []);
    } catch (error) {
      console.error('Error fetching received requests:', error);
    }
  };

  const getApprovedContactInfo = async (contactRequestId: string) => {
    if (!user) return null;
    try {
      const { data, error } = await db.rpc('get_approved_contact_info', { contact_request_id: contactRequestId });
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting contact info:', error);
      return null;
    }
  };

  useEffect(() => { if (user) { fetchMyRequests(); fetchReceivedRequests(); } }, [user]);

  return { loading, myRequests, receivedRequests, createContactRequest, updateContactRequestStatus, fetchMyRequests, fetchReceivedRequests, getApprovedContactInfo };
};

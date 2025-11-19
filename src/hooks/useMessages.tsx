import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Message {
  id: number;
  thread_id: number;
  sender_id: string;
  content: string;
  created_at: string;
  metadata?: any;
}

export interface MessageThread {
  id: number;
  created_by: string;
  created_at: string;
  title: string | null;
  participants?: any[];
  last_message?: Message;
}

export const useMessages = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = async () => {
    if (!user) return;

    try {
      // Fetch threads where user is a participant
      const { data: threadData, error: threadError } = await supabase
        .from('message_threads')
        .select(`
          *,
          thread_participants!inner(user_id)
        `)
        .eq('thread_participants.user_id', user.id)
        .order('created_at', { ascending: false });

      if (threadError) throw threadError;

      // Fetch last message for each thread
      const threadsWithMessages = await Promise.all(
        (threadData || []).map(async (thread) => {
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('thread_id', thread.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...thread,
            last_message: messages?.[0] || null,
          };
        })
      );

      setThreads(threadsWithMessages);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load message threads',
      });
    } finally {
      setLoading(false);
    }
  };

  const createThread = async (title: string, participantIds: string[]) => {
    if (!user) return null;

    try {
      // Create thread
      const { data: thread, error: threadError } = await supabase
        .from('message_threads')
        .insert({
          created_by: user.id,
          title,
        })
        .select()
        .single();

      if (threadError) throw threadError;

      // Add participants (including creator)
      const allParticipants = [user.id, ...participantIds.filter(id => id !== user.id)];
      const { error: participantError } = await supabase
        .from('thread_participants')
        .insert(
          allParticipants.map((userId) => ({
            thread_id: thread.id,
            user_id: userId,
          }))
        );

      if (participantError) throw participantError;

      await fetchThreads();
      return thread;
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create conversation',
      });
      return null;
    }
  };

  const sendMessage = async (threadId: number, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase.from('messages').insert({
        thread_id: threadId,
        sender_id: user.id,
        content,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send message',
      });
      return false;
    }
  };

  const fetchMessages = async (threadId: number) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const subscribeToThread = (threadId: number, onMessage: (message: Message) => void) => {
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          onMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    fetchThreads();
  }, [user]);

  return {
    threads,
    loading,
    createThread,
    sendMessage,
    fetchMessages,
    subscribeToThread,
    refreshThreads: fetchThreads,
  };
};

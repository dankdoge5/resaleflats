import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useMessages, Message } from '@/hooks/useMessages';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface MessageThreadProps {
  threadId: number;
  threadTitle: string;
}

export const MessageThread = ({ threadId, threadTitle }: MessageThreadProps) => {
  const { user } = useAuth();
  const { sendMessage, fetchMessages, subscribeToThread } = useMessages();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await fetchMessages(threadId);
      setMessages(data);
    };

    loadMessages();

    // Subscribe to new messages
    const unsubscribe = subscribeToThread(threadId, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return unsubscribe;
  }, [threadId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(threadId, newMessage.trim());
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="text-xl font-semibold">{threadTitle}</h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm break-words">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {format(new Date(message.created_at), 'h:mm a')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

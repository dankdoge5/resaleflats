import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageThread } from '@/components/MessageThread';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const { threads, loading } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with property owners and buyers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          {/* Thread List */}
          <Card className="col-span-1 p-4 overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start a conversation from a property listing
                </p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedThreadId === thread.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <p className="font-medium truncate">
                      {thread.title || 'Untitled Conversation'}
                    </p>
                    {thread.last_message && (
                      <p
                        className={`text-sm truncate mt-1 ${
                          selectedThreadId === thread.id
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {thread.last_message.content}
                      </p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        selectedThreadId === thread.id
                          ? 'text-primary-foreground/60'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {format(new Date(thread.created_at), 'MMM d, yyyy')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Message Thread */}
          <Card className="col-span-1 md:col-span-2 overflow-hidden">
            {selectedThread ? (
              <MessageThread
                threadId={selectedThread.id}
                threadTitle={selectedThread.title || 'Conversation'}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;

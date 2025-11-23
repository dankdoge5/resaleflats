import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageThread } from '@/components/MessageThread';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft, Search } from 'lucide-react';
import { format } from 'date-fns';

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const { threads, loading } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter threads based on search term
  const filteredThreads = useMemo(() => {
    if (!searchTerm.trim()) return threads;

    const search = searchTerm.toLowerCase();
    return threads.filter((thread) => {
      // Search by title/property name
      if (thread.title?.toLowerCase().includes(search)) return true;

      // Search by participant name
      if (thread.participants?.some((p) => p.full_name?.toLowerCase().includes(search))) return true;

      // Search by date
      const formattedDate = format(new Date(thread.created_at), 'MMM d, yyyy').toLowerCase();
      if (formattedDate.includes(search)) return true;

      // Search by last message content
      if (thread.last_message?.content.toLowerCase().includes(search)) return true;

      return false;
    });
  }, [threads, searchTerm]);

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

  const selectedThread = filteredThreads.find((t) => t.id === selectedThreadId);

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
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by property, participant, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No conversations found' : 'No conversations yet'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? 'Try a different search term' : 'Start a conversation from a property listing'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto">
                {filteredThreads.map((thread) => (
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

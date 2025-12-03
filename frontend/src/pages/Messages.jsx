import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import { Send, RefreshCw } from 'lucide-react';
import { getInitials, formatDate } from '../lib/utils';

export default function Messages() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    // Check if user ID is in URL params
    const userId = searchParams.get('user');
    if (userId) {
      fetchMessages(userId);
    }
  }, [searchParams]);

  // Auto-refresh messages every 3 seconds when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation);
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [selectedConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setRefreshing(true);
      const { data } = await api.get('/messages/conversations');
      console.log('Fetched conversations:', data);
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data);
      setSelectedConversation(userId);
      // Mark as read
      await api.put(`/messages/${userId}/read`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      console.log('Sending message to:', selectedConversation);
      const { data } = await api.post('/messages', {
        receiverId: selectedConversation,
        content: newMessage,
      });
      console.log('Message sent:', data);
      setMessages([...messages, data]);
      setNewMessage('');
      // Refresh conversations list to show this conversation
      console.log('Refreshing conversations...');
      await fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (message) => {
    if (!user || !message?.sender || !message?.receiver) return null;
    return message.sender._id === user._id ? message.receiver : message.sender;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Conversations</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchConversations}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 px-4">
                  <p className="font-semibold mb-2">No conversations yet</p>
                  <p className="text-sm">
                    To start a conversation, go to a contract and click the "Message" button.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  if (!otherUser) return null;
                  
                  return (
                    <div
                      key={conv._id}
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                        selectedConversation === otherUser._id ? 'bg-accent' : ''
                      }`}
                      onClick={() => fetchMessages(otherUser._id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={otherUser.avatar} />
                          <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{otherUser.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>
              {selectedConversation ? 'Chat' : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            ) : (
              <>
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    if (!user || !message?.sender) return null;
                    const isOwn = message.sender._id === user._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}
                          >
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={loading}
                    />
                    <Button type="submit" disabled={loading || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

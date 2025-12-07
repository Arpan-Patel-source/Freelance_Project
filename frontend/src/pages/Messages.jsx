import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import useAuthStore from '../store/useAuthStore';
import api from '../lib/api';
import { Send, RefreshCw, Paperclip, X, File, Image as ImageIcon, Video, FileText, Download } from 'lucide-react';
import { getInitials, formatDate } from '../lib/utils';

export default function Messages() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState({ url: '', name: '' });
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
      setMessages(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
      setSelectedConversation(userId);
      // Mark as read
      await api.put(`/messages/${userId}/read`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation) return;

    setLoading(true);
    try {
      console.log('Sending message to:', selectedConversation);

      // Prepare attachments data
      // Prepare attachments data (now just links)
      const attachmentsData = attachments.map(file => ({
        name: file.name,
        fileType: 'link', // All drive attachments are treated as links
        url: file.url
      }));

      const { data } = await api.post('/messages', {
        receiverId: selectedConversation,
        content: newMessage,
        attachments: attachmentsData
      });

      console.log('Message sent:', data);
      setMessages([...messages, data]);
      setNewMessage('');
      setAttachments([]);

      // Refresh conversations list to show this conversation
      console.log('Refreshing conversations...');
      await fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Add Link Attachment
  const addLinkAttachment = () => {
    if (!linkInput.url || !linkInput.name) return;

    setAttachments([...attachments, {
      name: linkInput.name,
      url: linkInput.url,
      fileType: 'link'
    }]);

    setLinkInput({ url: '', name: '' });
    setShowLinkInput(false);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Get file type category
  const getFileType = (mimeType) => {
    if (!mimeType) return 'file';
    if (mimeType === 'link') return 'link'; // Handle our new link type
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getOtherUser = (message) => {
    if (!user || !message?.sender || !message?.receiver) return null;
    return message.sender._id === user._id ? message.receiver : message.sender;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="grid lg:grid-cols-3 gap-6 h-[85vh]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col h-full">
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
          <CardContent className="p-0 flex-1 flex flex-col min-h-0">
            <div className="divide-y flex-1 overflow-y-auto">
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
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${selectedConversation === otherUser._id ? 'bg-accent' : ''
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
        <Card className="lg:col-span-2 flex flex-col h-full">
          <CardHeader>
            <CardTitle>
              {selectedConversation ? 'Chat' : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
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
                          className={`max-w-[70%] rounded-lg p-3 ${isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                            }`}
                        >
                          {message.content && (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}

                          {/* Display Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className={`space-y-2 ${message.content ? 'mt-2' : ''}`}>
                              {message.attachments.map((attachment, idx) => (
                                <div key={idx} className="mt-2">
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 p-2 rounded border ${isOwn
                                      ? 'bg-primary-foreground/10 hover:bg-primary-foreground/20'
                                      : 'bg-background hover:bg-accent'
                                      }`}
                                  >
                                    <FileText className="h-4 w-4" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{attachment.name}</p>
                                      <p className="text-[10px] opacity-70 truncate">{attachment.url}</p>
                                    </div>
                                    <Download className="h-3 w-3 opacity-50" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                          <p
                            className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
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
                <form onSubmit={sendMessage} className="p-4 border-t space-y-2">
                  {/* Link Input Dialog */}
                  {showLinkInput && (
                    <div className="p-3 bg-muted rounded mb-2 space-y-2 border">
                      <p className="text-sm font-semibold">Add Google Drive Link</p>
                      <Input
                        placeholder="Link Name (e.g., Project Specs)"
                        value={linkInput.name}
                        onChange={(e) => setLinkInput({ ...linkInput, name: e.target.value })}
                        size="sm"
                      />
                      <Input
                        placeholder="https://drive.google.com/..."
                        value={linkInput.url}
                        onChange={(e) => setLinkInput({ ...linkInput, url: e.target.value })}
                        size="sm"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowLinkInput(false);
                            setLinkInput({ url: '', name: '' });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={addLinkAttachment}
                          disabled={!linkInput.url || !linkInput.name}
                        >
                          Add Link
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Attachment Preview (Links) */}
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-2 bg-muted rounded mb-2">
                      {attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-background px-3 py-2 rounded border"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div className="flex flex-col max-w-[150px]">
                            <span className="text-xs font-medium truncate">{file.name}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{file.url}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="hover:bg-destructive/10 rounded p-1"
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={showLinkInput ? "secondary" : "outline"}
                      size="icon"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                      disabled={loading}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if ((newMessage.trim() || attachments.length > 0) && !loading) {
                            sendMessage(e);
                          }
                        }
                      }}
                      disabled={loading}
                    />
                    <Button
                      type="submit"
                      disabled={loading || (!newMessage.trim() && attachments.length === 0)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div >
  );
}

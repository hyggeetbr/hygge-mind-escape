
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat sessions
  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  // Create a new chat session
  const createNewSession = async (firstMessage: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // Generate a title from the first message (first 50 chars)
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 50) + '...' 
        : firstMessage;

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: title
        })
        .select()
        .single();

      if (error) throw error;

      const newSession = data as ChatSession;
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      
      return newSession.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  // Save a message to the current session
  const saveMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role,
          content
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage = data as ChatMessage;
      setMessages(prev => [...prev, newMessage]);

      // Update session's updated_at timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      // Refresh sessions to update order
      loadSessions();
      
      return newMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        title: "Error",
        description: "Failed to save message",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }

      toast({
        title: "Success",
        description: "Conversation deleted",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  // Start a new conversation
  const startNewConversation = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  return {
    sessions,
    currentSessionId,
    messages,
    isLoading,
    loadMessages,
    createNewSession,
    saveMessage,
    deleteSession,
    startNewConversation,
    setMessages
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load chat sessions
  const loadSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading sessions:', error);
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    if (!user) return;

    try {
      setCurrentSessionId(sessionId);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      // Type assertion to ensure proper typing
      const typedMessages: ChatMessage[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at
      }));

      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Create new session
  const createNewSession = async (firstMessage: string) => {
    if (!user) return null;

    try {
      // Generate title from first message (first 50 chars)
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 50) + '...'
        : firstMessage;

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: user.id,
            title: title
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return null;
      }

      await loadSessions(); // Refresh sessions list
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  // Save message to database
  const saveMessage = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            role: role,
            content: content
          }
        ]);

      if (error) {
        console.error('Error saving message:', error);
        return;
      }

      // Update session's updated_at timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      await loadSessions(); // Refresh sessions to update order
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting session:', error);
        return;
      }

      // If we deleted the current session, clear it
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }

      await loadSessions(); // Refresh sessions list
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  // Load sessions when user changes
  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
      setCurrentSessionId(null);
      setMessages([]);
    }
  }, [user]);

  return {
    sessions,
    currentSessionId,
    messages,
    loadMessages,
    createNewSession,
    saveMessage,
    deleteSession,
    startNewConversation,
    setMessages
  };
};

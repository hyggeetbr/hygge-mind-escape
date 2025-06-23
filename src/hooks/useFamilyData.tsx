
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface FamilyMember {
  id: string;
  username: string;
  avatar_url?: string;
  meditation_minutes: number;
  yoga_minutes: number;
  reading_minutes: number;
  streak_count: number;
}

export interface CommunityUser {
  id: string;
  username: string;
  avatar_url?: string;
}

export const useFamilyData = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  const loadFamilyMembers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: familyRelations, error } = await supabase
        .from('user_families')
        .select('family_member_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading family relations:', error);
        return;
      }

      if (!familyRelations || familyRelations.length === 0) {
        setFamilyMembers([]);
        return;
      }

      const familyMemberIds = familyRelations.map(relation => relation.family_member_id);

      const { data: memberProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, username, avatar_url, meditation_minutes, yoga_minutes, reading_minutes, streak_count')
        .in('id', familyMemberIds);

      if (profilesError) {
        console.error('Error loading family member profiles:', profilesError);
        return;
      }

      const familyMembersData = (memberProfiles || []).map(profile => ({
        id: profile.id,
        username: profile.username || 'User',
        avatar_url: profile.avatar_url,
        meditation_minutes: profile.meditation_minutes || 0,
        yoga_minutes: profile.yoga_minutes || 0,
        reading_minutes: profile.reading_minutes || 0,
        streak_count: profile.streak_count || 0
      }));

      setFamilyMembers(familyMembersData);
    } catch (error) {
      console.error('Error loading family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCommunityUsers = async (searchTerm: string) => {
    if (!user || !searchTerm.trim()) {
      setCommunityUsers([]);
      return;
    }

    try {
      setSearchLoading(true);

      // Get current family member IDs to exclude them from search
      const { data: familyRelations } = await supabase
        .from('user_families')
        .select('family_member_id')
        .eq('user_id', user.id);

      const excludeIds = [user.id, ...(familyRelations || []).map(r => r.family_member_id)];

      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${searchTerm}%`)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(10);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      const searchResults = (users || [])
        .filter(user => user.username) // Only show users with usernames
        .map(user => ({
          id: user.id,
          username: user.username || 'User',
          avatar_url: user.avatar_url
        }));

      setCommunityUsers(searchResults);
    } catch (error) {
      console.error('Error searching community users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const addFamilyMember = async (memberId: string) => {
    if (!user) return false;

    try {
      setAddingMember(true);
      
      const { error } = await supabase
        .from('user_families')
        .insert([
          {
            user_id: user.id,
            family_member_id: memberId
          }
        ]);

      if (error) {
        console.error('Error adding family member:', error);
        return false;
      }

      // Force reload family members immediately
      await loadFamilyMembers();
      setCommunityUsers([]);
      return true;
    } catch (error) {
      console.error('Error adding family member:', error);
      return false;
    } finally {
      setAddingMember(false);
    }
  };

  const removeFamilyMember = async (memberId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_families')
        .delete()
        .eq('user_id', user.id)
        .eq('family_member_id', memberId);

      if (error) {
        console.error('Error removing family member:', error);
        return false;
      }

      await loadFamilyMembers();
      return true;
    } catch (error) {
      console.error('Error removing family member:', error);
      return false;
    }
  };

  const sendNudge = async (recipientId: string, message: string) => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    if (!message.trim()) {
      console.error('Message is empty');
      return false;
    }

    try {
      console.log('Starting nudge send process...');
      console.log('Sender ID:', user.id);
      console.log('Recipient ID:', recipientId);
      console.log('Message:', message.trim());

      // Insert the nudge
      const { data: nudgeData, error: nudgeError } = await supabase
        .from('nudges')
        .insert([
          {
            sender_id: user.id,
            recipient_id: recipientId,
            message: message.trim()
          }
        ])
        .select()
        .single();

      if (nudgeError) {
        console.error('Error inserting nudge:', nudgeError);
        return false;
      }

      console.log('Nudge inserted successfully:', nudgeData);

      // The notification should be created automatically by the trigger
      // Let's verify it was created
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .select('*')
        .eq('nudge_id', nudgeData.id)
        .single();

      if (notificationError) {
        console.error('Error checking notification creation:', notificationError);
        // Don't return false here since the nudge was created successfully
        // The notification might take a moment to appear due to trigger timing
      } else {
        console.log('Notification created successfully:', notification);
      }

      return true;
    } catch (error) {
      console.error('Unexpected error sending nudge:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadFamilyMembers();
    }
  }, [user]);

  return {
    familyMembers,
    communityUsers,
    loading,
    searchLoading,
    addingMember,
    loadFamilyMembers,
    searchCommunityUsers,
    addFamilyMember,
    removeFamilyMember,
    sendNudge
  };
};

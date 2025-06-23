
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFamilyData } from '@/hooks/useFamilyData';
import { AddFamilyMemberDialog } from './AddFamilyMemberDialog';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const FamilyMembersView = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { familyMembers, loading, removeFamilyMember } = useFamilyData();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading family members...</p>
      </div>
    );
  }

  const getUsernameForHeader = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Your';
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-white text-2xl font-light">{getUsernameForHeader()}'s Family</h2>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Family Members List */}
      {familyMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <p className="text-black text-lg font-medium mb-2">
              No family members yet
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Add community members to your family to track their progress together
            </p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Family Member
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {member.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-medium text-lg">{member.username}</h3>
                    <p className="text-white/70 text-sm">Streak: {member.streak_count} days</p>
                  </div>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Family Member</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.username} from your family? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => removeFamilyMember(member.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Meditation</p>
                    <p className="text-white text-xl font-semibold">{member.meditation_minutes}</p>
                    <p className="text-white/70 text-xs">minutes</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Yoga</p>
                    <p className="text-white text-xl font-semibold">{member.yoga_minutes}</p>
                    <p className="text-white/70 text-xs">minutes</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Reading</p>
                    <p className="text-white text-xl font-semibold">{member.reading_minutes}</p>
                    <p className="text-white/70 text-xs">minutes</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Family Member Dialog */}
      <AddFamilyMemberDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
};

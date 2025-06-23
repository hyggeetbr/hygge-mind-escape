
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFamilyData } from '@/hooks/useFamilyData';
import { AddFamilyMemberDialog } from './AddFamilyMemberDialog';
import { NudgeDialog } from './NudgeDialog';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2, Heart } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const FamilyMembersView = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNudgeDialog, setShowNudgeDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; username: string } | null>(null);
  const { familyMembers, loading, addingMember, removeFamilyMember, sendNudge } = useFamilyData();

  const handleAddMemberSuccess = () => {
    setShowAddDialog(false);
    setShowSuccessDialog(true);
  };

  const handleNudgeClick = (member: { id: string; username: string }) => {
    setSelectedMember(member);
    setShowNudgeDialog(true);
  };

  const handleSendNudge = async (message: string) => {
    if (!selectedMember) return false;
    return await sendNudge(selectedMember.id, message);
  };

  if (loading || addingMember) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
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
                    <p className="text-black text-sm font-medium">Streak: {member.streak_count} days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Nudge Button */}
                  <Button
                    onClick={() => handleNudgeClick(member)}
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-pink-400 hover:bg-pink-500/20"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  
                  {/* Delete Button */}
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
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-black">Remove Family Member</AlertDialogTitle>
                        <AlertDialogDescription className="text-black">
                          Are you sure you want to remove {member.username} from your family? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-black bg-white border-gray-300 hover:bg-gray-100">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => removeFamilyMember(member.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Stats Grid - Fixed consistent background */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-black text-xs uppercase tracking-wide mb-1 font-medium">Meditation</p>
                    <p className="text-black text-xl font-semibold">{member.meditation_minutes}</p>
                    <p className="text-black text-xs font-medium">minutes</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-black text-xs uppercase tracking-wide mb-1 font-medium">Yoga</p>
                    <p className="text-black text-xl font-semibold">{member.yoga_minutes}</p>
                    <p className="text-black text-xs font-medium">minutes</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-black text-xs uppercase tracking-wide mb-1 font-medium">Reading</p>
                    <p className="text-black text-xl font-semibold">{member.reading_minutes}</p>
                    <p className="text-black text-xs font-medium">minutes</p>
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
        onSuccess={handleAddMemberSuccess}
      />

      {/* Nudge Dialog */}
      <NudgeDialog
        open={showNudgeDialog}
        onClose={() => setShowNudgeDialog(false)}
        recipientName={selectedMember?.username || ''}
        onSendNudge={handleSendNudge}
      />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-black text-center">Success!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-black">
              User has been successfully added to the family! Refresh the page to see your family members.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

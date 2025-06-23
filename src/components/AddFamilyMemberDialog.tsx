
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFamilyData, CommunityUser } from '@/hooks/useFamilyData';
import { Search, Plus } from 'lucide-react';

interface AddFamilyMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddFamilyMemberDialog = ({ open, onClose, onSuccess }: AddFamilyMemberDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { communityUsers, searchLoading, searchCommunityUsers, addFamilyMember } = useFamilyData();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    searchCommunityUsers(value);
  };

  const handleAddMember = async (member: CommunityUser) => {
    const success = await addFamilyMember(member.id);
    if (success) {
      setSearchTerm('');
      onSuccess?.();
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-medium text-black">Add Family Member</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-white text-black placeholder:text-gray-500 border-gray-300"
            />
          </div>

          {/* Search Results */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {searchLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Searching...</p>
              </div>
            ) : communityUsers.length > 0 ? (
              communityUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900">{user.username}</span>
                  </div>
                  <Button
                    onClick={() => handleAddMember(user)}
                    size="sm"
                    className="bg-white text-black border border-gray-300 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to family
                  </Button>
                </div>
              ))
            ) : searchTerm ? (
              <div className="text-center py-4">
                <p className="text-gray-600">No users found with username "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Start typing to search for community members</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

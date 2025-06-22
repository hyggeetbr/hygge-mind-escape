
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UsernameDialogProps {
  open: boolean;
  onClose: () => void;
  onUsernameSet: (username: string) => void;
  isFirstTime?: boolean;
  currentUsername?: string;
}

export const UsernameDialog = ({ 
  open, 
  onClose, 
  onUsernameSet, 
  isFirstTime = false,
  currentUsername = ''
}: UsernameDialogProps) => {
  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          username: username.trim(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving username:', error);
        toast({
          title: "Error",
          description: "Failed to save username. Please try again.",
          variant: "destructive",
        });
        return;
      }

      onUsernameSet(username.trim());
      onClose();
      toast({
        title: "Success",
        description: isFirstTime ? "Welcome to the community!" : "Username updated successfully!",
      });
    } catch (error) {
      console.error('Error saving username:', error);
      toast({
        title: "Error",
        description: "Failed to save username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isFirstTime ? undefined : onClose}>
      <DialogContent className="sm:max-w-md bg-white" hideCloseButton={isFirstTime}>
        <DialogHeader>
          <DialogTitle className="text-black">
            {isFirstTime ? 'Welcome to the Community!' : 'Change Username'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-black block mb-2">
              {isFirstTime ? 'Choose your username:' : 'Enter new username:'}
            </label>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-gray-300 focus:border-purple-500 bg-white text-black placeholder:text-gray-500"
            />
            {isFirstTime && (
              <p className="text-sm text-gray-600 mt-1">
                This is how other users will see you in the community.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            {!isFirstTime && (
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-300 text-black hover:bg-gray-50"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!username.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

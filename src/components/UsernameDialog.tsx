
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

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
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check username availability
  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim() || usernameToCheck === currentUsername) {
      setIsAvailable(null);
      return;
    }

    setCheckingAvailability(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', usernameToCheck.trim())
        .single();

      if (error && error.code === 'PGRST116') {
        // No user found with this username, it's available
        setIsAvailable(true);
      } else if (data) {
        // Username already exists
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setIsAvailable(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Debounce username checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username.trim() && username !== currentUsername) {
        checkUsernameAvailability(username);
      } else {
        setIsAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, currentUsername]);

  const handleSave = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    if (username !== currentUsername && isAvailable === false) {
      toast({
        title: "Error",
        description: "This username is already taken",
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
            
            {/* Username availability indicator */}
            <div className="mt-2 min-h-[20px]">
              {checkingAvailability && (
                <p className="text-sm text-gray-600">Checking availability...</p>
              )}
              {!checkingAvailability && isAvailable === true && (
                <div className="flex items-center text-green-600 text-sm font-bold">
                  <Check className="w-4 h-4 mr-1" />
                  Username is available
                </div>
              )}
              {!checkingAvailability && isAvailable === false && (
                <p className="text-sm text-red-600 font-medium">Username is already taken</p>
              )}
              {isFirstTime && !username && (
                <p className="text-sm text-gray-600 mt-1">
                  This is how other users will see you in the community.
                </p>
              )}
            </div>
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
              disabled={!username.trim() || loading || (username !== currentUsername && isAvailable !== true)}
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

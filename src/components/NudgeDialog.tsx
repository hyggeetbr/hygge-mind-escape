
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Star, Sparkles } from 'lucide-react';

interface NudgeDialogProps {
  open: boolean;
  onClose: () => void;
  recipientName: string;
  onSendNudge: (message: string) => Promise<boolean>;
}

export const NudgeDialog = ({ open, onClose, recipientName, onSendNudge }: NudgeDialogProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    const success = await onSendNudge(message);
    if (success) {
      setMessage('');
      onClose();
    }
    setSending(false);
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-black text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Send a Nudge to {recipientName}
            <Heart className="w-5 h-5 text-red-500" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-black text-sm mb-2">
              ✨ Add your personal note to your nudge! ✨
            </p>
            <p className="text-gray-600 text-xs">
              💪 Motivate them • 🌟 Encourage them • ❤️ Show you care
            </p>
          </div>
          
          <Textarea
            placeholder="Hey! Just wanted to check in and see how your wellness journey is going today! 🌱 You've got this! 💪"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white text-black placeholder:text-gray-500 border-gray-300 min-h-[100px]"
            maxLength={500}
          />
          
          <div className="text-right text-xs text-gray-500">
            {message.length}/500 characters
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 text-black border-gray-300 hover:bg-gray-100"
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {sending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Send Nudge
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Paperclip, Smile, X, Image } from 'lucide-react';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, image?: File) => Promise<boolean>;
}

const EMOJI_LIST = ['😊', '😍', '🥰', '😎', '🤗', '🙌', '👏', '💪', '❤️', '🔥', '✨', '🌟', '🎉', '🙏', '💯'];

export const CreatePostDialog = ({ open, onClose, onSubmit }: CreatePostDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addEmoji = (emoji: string) => {
    setDescription(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    console.log('Submitting post with:', { title, description, hasImage: !!selectedImage });
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(title, description, selectedImage || undefined);
      console.log('Post submission result:', success);
      
      if (success) {
        setTitle('');
        setDescription('');
        setSelectedImage(null);
        setImagePreview(null);
        setShowEmojis(false);
        onClose();
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedImage(null);
    setImagePreview(null);
    setShowEmojis(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-black block mb-2">Title</label>
            <Input
              placeholder="What's your post about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-gray-300 focus:border-purple-500 bg-white text-black placeholder:text-gray-500"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <Button
                onClick={removeImage}
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Description Input */}
          <div>
            <label className="text-sm font-medium text-black block mb-2">
              {selectedImage ? "Say something about this picture..." : "Description"}
            </label>
            <Textarea
              placeholder={selectedImage ? "Share your thoughts..." : "What's on your mind?"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] border-gray-300 focus:border-purple-500 resize-none bg-white text-black placeholder:text-gray-500"
            />
          </div>

          {/* Emoji Picker */}
          {showEmojis && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="grid grid-cols-8 gap-2">
                {EMOJI_LIST.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-gray-200 p-2 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              >
                <Image className="h-4 w-4 mr-1" />
                Photo
              </Button>
              
              <Button
                onClick={() => setShowEmojis(!showEmojis)}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              >
                <Smile className="h-4 w-4 mr-1" />
                Emoji
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleClose}
                variant="outline"
                size="sm"
                className="border-gray-300 text-black hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim() || isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                size="sm"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

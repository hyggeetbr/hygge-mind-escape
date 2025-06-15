
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

type Article = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  estimated_read_minutes: number | null;
};

interface ReadingDialogProps {
  open: boolean;
  isReading: boolean;
  selectedArticle: Article | null;
  readingSeconds: number;
  sessionLoading: boolean;
  onFinishReading: () => void;
  onCancel: () => void;
}

const ReadingDialog: React.FC<ReadingDialogProps> = ({
  open,
  isReading,
  selectedArticle,
  readingSeconds,
  sessionLoading,
  onFinishReading,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-xl bg-white/90">
        <DialogHeader>
          <DialogTitle className="text-black">
            {selectedArticle?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 items-center">
          {selectedArticle && (
            <>
              <div className="mb-2 text-hygge-earth/70 text-center">{selectedArticle.summary}</div>
              <iframe
                src={selectedArticle.url}
                title={selectedArticle.title}
                className="w-full h-60 max-w-lg rounded border"
                style={{ minHeight: 200 }}
              />
              <div className="font-mono text-hygge-moss text-lg mb-1">
                Time: <span>{Math.floor(readingSeconds / 60)}:{("0" + (readingSeconds % 60)).slice(-2)}</span>
              </div>
              <Button
                onClick={onFinishReading}
                className="w-full bg-white text-black border border-hygge-stone"
                variant="plain"
                disabled={sessionLoading}
              >
                {sessionLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Finish & Save"}
              </Button>
              <DialogClose asChild>
                <button
                  className="text-xs text-hygge-sky underline mt-2"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </DialogClose>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingDialog;

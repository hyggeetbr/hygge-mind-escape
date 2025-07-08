
interface SwipeHintProps {
  show: boolean;
}

const SwipeHint = ({ show }: SwipeHintProps) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-pulse z-10">
      Swipe up for next
    </div>
  );
};

export default SwipeHint;

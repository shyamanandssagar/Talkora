import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <button
      onClick={handleVideoCall}
      className="btn btn-success btn-sm text-white gap-2 flex-shrink-0"
    >
      <VideoIcon className="size-4" />
      Call
    </button>
  );
}

export default CallButton;
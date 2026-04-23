import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const INPUT_STYLES = `
  /* 1. Remove focus rings and blue highlights */
  .str-chat__input-flat-wrapper:focus,
  .str-chat__input-flat-wrapper:focus-within,
  .str-chat__message-textarea:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: #e5e7eb !important;
  }

  /* 2. Main Pill Container */
  .str-chat__input-flat-wrapper {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important; 
    background: #f3f4f6 !important;
    border-radius: 9999px !important;
    padding: 0 1.25rem !important;
    min-height: 48px !important;
    max-height: 48px !important;
    border: 1px solid #e5e7eb !important;
    position: relative !important;
    overflow: hidden !important;
  }

  /* 3. Textarea Wrapper & Alignment */
  .str-chat__input-flat--textarea-wrapper {
    flex: 1 !important;
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
  }

  .rta.str-chat__textarea {
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
    background: transparent !important;
  }

  .str-chat__message-textarea {
    width: 100% !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    resize: none !important;
    padding: 13px 0 !important; /* Secret for vertical text centering */
    font-size: 0.95rem !important;
    line-height: 1.2 !important;
    display: block !important;
  }

  /* 4. Icon Positioning (File Uploader) */
  .str-chat__fileupload-wrapper,
  .str-chat__input-flat-fileupload {
    position: static !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 0 4px !important;
    height: 100% !important;
    transform: none !important;
  }

  .rfu-file-upload-button {
    display: flex !important;
    align-items: center !important;
  }

  /* 5. THE FIX: Force Send Button to Center */
  .str-chat__send-button {
    display: flex !important;
    align-items: center !important; /* Vertical center */
    justify-content: center !important;
    height: 100% !important;
    margin: 0 0 0 8px !important; /* Reset all margins, only 8px left */
    padding: 0 !important;
    background: transparent !important;
    align-self: center !important; /* Force override any parent alignment */
  }

  .str-chat__send-button-wrapper {
     display: flex !important;
     align-items: center !important;
  }

  .str-chat__send-button svg {
    fill: #3b82f6 !important;
    display: block !important;
    margin: 0 !important; /* Prevent internal svg margins from pushing it down */
  }

  /* 6. Hide default tooltips */
  .str-chat__tooltip {
    display: none !important;
  }
`;
const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser(
          { id: authUser._id, name: authUser.fullName, image: authUser.profilePic },
          tokenData.token
        );
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat.");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({ text: `I've started a video call. Join me here: ${callUrl}` });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-4rem)] bg-base-200 flex items-center justify-center px-4 sm:px-6 py-4">
      <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1400px] h-full bg-white rounded-2xl shadow-lg border border-base-300/40 overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full flex overflow-hidden">
              <Window>
                <div className="flex flex-col h-full">

                  {/* Header */}
                  <div className="flex items-center bg-white border-b border-gray-200 px-5 py-3">
                    <div className="flex-1">
                      <ChannelHeader />
                    </div>
                    <CallButton handleVideoCall={handleVideoCall} />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto min-h-0 bg-white">
                    <MessageList />
                  </div>

                  {/* Input */}
                  <div className="bg-white border-t border-gray-200 px-5 py-3">
                    <style>{INPUT_STYLES}</style>
                    <MessageInput focus />
                  </div>

                </div>
              </Window>
              <Thread />
            </div>
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { useThemeStore } from "../store/useThemeStore";

const FriendsPage = () => {
  const { theme } = useThemeStore();

  const {
    data: friends = [],
    isLoading,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div data-theme={theme} className="p-4 sm:p-6 lg:p-8 min-h-screen bg-base-100">
      <div className="container mx-auto">

        
        <div className="mb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">
            Network
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
            Your Friends
          </h2>
          <p className="text-sm text-base-content/50 mt-1">
            People you’ve connected with
          </p>
        </div>

        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default FriendsPage;
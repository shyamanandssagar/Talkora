import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { useThemeStore } from "../store/useThemeStore";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const { theme } = useThemeStore();

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

useEffect(() => {
  const outgoingIds = new Set();

  if (outgoingFriendReqs?.outgoingRequests?.length > 0) {
    outgoingFriendReqs.outgoingRequests.forEach((req) => {
      outgoingIds.add(req.recipient._id);
    });
  }

  setOutgoingRequestsIds(outgoingIds);
}, [outgoingFriendReqs]);

  return (
    <div data-theme={theme} className="p-4 sm:p-6 lg:p-8 min-h-screen bg-base-100">
      <div className="container mx-auto space-y-12">

        {/* ── Your Friends ── */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">
                Network
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
                Your Friends
              </h2>
            </div>
            <Link
              to="/notifications"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-200 hover:bg-primary hover:text-primary-content border border-base-300 hover:border-primary text-sm font-semibold text-base-content/70 transition-all duration-200"
            >
              <UsersIcon className="w-4 h-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
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
        </section>

        
        <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

        {/* ── Meet New Learners ── */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30 mb-1">
                Discover
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
                Meet New Learners
              </h2>
              <p className="text-sm text-base-content/50 mt-1">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-base-200 border border-base-300/50">
              <span className="text-3xl mb-3">🌍</span>
              <h3 className="font-bold text-base-content mb-1">No recommendations yet</h3>
              <p className="text-sm text-base-content/50">Check back later for new language partners!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="group relative bg-base-200 rounded-2xl border border-base-300/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                  >
                    
                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="p-5 space-y-4">
                      
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-primary/15 group-hover:ring-primary/35 ring-offset-1 ring-offset-base-200 transition-all duration-300">
                            <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base-content truncate">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPinIcon className="w-3 h-3 text-base-content/35 flex-shrink-0" />
                              <span className="text-xs text-base-content/40 truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-[11px] font-semibold border border-secondary/15">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-base-300/60 text-base-content/60 text-[11px] font-semibold border border-base-300">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      
                      {user.bio && (
                        <p className="text-sm text-base-content/55 leading-relaxed line-clamp-2">{user.bio}</p>
                      )}

                      
                      <button
                        className={`
                          w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                          transition-all duration-200
                          ${hasRequestBeenSent
                            ? "bg-base-300/60 text-base-content/40 cursor-not-allowed border border-base-300"
                            : "bg-primary/10 hover:bg-primary text-primary hover:text-primary-content border border-primary/20 hover:border-primary hover:shadow-md hover:shadow-primary/20"
                          }
                        `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="w-4 h-4" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default HomePage;

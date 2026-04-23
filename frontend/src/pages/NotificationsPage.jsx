import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { useThemeStore } from "../store/useThemeStore";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div data-theme={theme} className="h-full bg-base-100 flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl w-full flex flex-col flex-1">

        
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <BellIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">
              Activity
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-base-content leading-none">
                Notifications
              </h1>
              {(incomingRequests.length + acceptedRequests.length) > 0 && (
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-content text-xs font-black">
                  {incomingRequests.length + acceptedRequests.length}
                </span>
              )}
            </div>
          </div>
        </div>

        
        <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent mb-6" />

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm text-base-content/40 font-medium">Loading notifications…</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-6">
            
            {incomingRequests.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <UserCheckIcon className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-base-content/50">
                    Friend Requests
                  </h2>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20">
                    {incomingRequests.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="group relative bg-base-200 rounded-2xl border border-base-300/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                    >
                      
                      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="p-4 flex items-center gap-4">
                        
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/15 group-hover:ring-primary/35 ring-offset-1 ring-offset-base-200 transition-all duration-300">
                            <img
                              src={request.sender.profilePic || "/avatar.png"}
                              alt={request.sender.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-base-content truncate">
                            {request.sender.fullName}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary text-[10px] font-semibold border border-secondary/15">
                              Native: {request.sender.nativeLanguage || "N/A"}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-base-300/60 text-base-content/55 text-[10px] font-semibold border border-base-300">
                              Learning: {request.sender.learningLanguage || "N/A"}
                            </span>
                          </div>
                        </div>

                        
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary text-primary hover:text-primary-content border border-primary/20 hover:border-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isAccepting || isRejecting}
                          >
                            <CheckIcon className="w-3.5 h-3.5" />
                            Accept
                          </button>
                          <button
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-error/8 hover:bg-error text-error hover:text-error-content border border-error/20 hover:border-error transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => rejectRequestMutation(request._id)}
                            disabled={isAccepting || isRejecting}
                          >
                            <XIcon className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Divider between sections */}
            {incomingRequests.length > 0 && acceptedRequests.length > 0 && (
              <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />
            )}

            {/* ── Accepted / New Connections ── */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <BellIcon className="w-4 h-4 text-success" />
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-base-content/50">
                    New Connections
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="group relative bg-base-200 rounded-2xl border border-base-300/50 hover:border-success/20 hover:shadow-lg hover:shadow-success/5 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-success/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="p-4 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-success/20 ring-offset-1 ring-offset-base-200">
                            <img
                              src={notification.recipient.profilePic || "/avatar.png"}
                              alt={notification.recipient.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Success checkmark badge */}
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center ring-2 ring-base-200">
                            <CheckIcon className="w-2.5 h-2.5 text-success-content" strokeWidth={3} />
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-base-content truncate">
                            {notification.recipient.fullName}
                          </h3>
                          <p className="text-xs text-base-content/50 mt-0.5">
                            {notification.recipient.fullName} accepted your friend request
                          </p>
                          <p className="text-[10px] text-base-content/30 flex items-center gap-1 mt-1">
                            <ClockIcon className="w-3 h-3" />
                            Recently
                          </p>
                        </div>

                        {/* Badge */}
                        <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-success/10 text-success text-xs font-bold border border-success/20">
                          <MessageSquareIcon className="w-3 h-3" />
                          New Friend
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Empty State ── */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <NoNotificationsFound />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

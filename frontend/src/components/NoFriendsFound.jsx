import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
          <UsersIcon className="w-9 h-9 text-primary/60" />
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-base-200 ring-2 ring-base-100 flex items-center justify-center text-xs">
          ✨
        </span>
      </div>
      <h3 className="text-lg font-bold text-base-content mb-1">No friends yet</h3>
      <p className="text-sm text-base-content/50 text-center max-w-xs leading-relaxed">
        Connect with language partners below to start practicing together!
      </p>
    </div>
  );
};

export default NoFriendsFound;

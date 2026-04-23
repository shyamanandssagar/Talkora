import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="group relative bg-base-200 hover:bg-base-200 rounded-2xl p-4 border border-base-300/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">

      {/* Top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* User info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/15 group-hover:ring-primary/35 ring-offset-1 ring-offset-base-200 transition-all duration-300">
            <img src={friend.profilePic} alt={friend.fullName} className="w-full h-full object-cover" />
          </div>
          {/* Online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success ring-2 ring-base-200">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
          </span>
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-base-content truncate">{friend.fullName}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <p className="text-[11px] text-base-content/40 font-medium">Language Partner</p>
            {friend.gender && (
              <>
                <span className="text-base-content/20 text-[11px]">·</span>
                <span className={`text-[11px] font-semibold ${
                  friend.gender.toLowerCase() === "male"
                    ? "text-blue-400"
                    : friend.gender.toLowerCase() === "female"
                    ? "text-pink-400"
                    : "text-base-content/50"
                }`}>
                  {friend.gender.toLowerCase() === "male" ? "♂" : friend.gender.toLowerCase() === "female" ? "♀" : "⚧"} {friend.gender}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Language badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-[11px] font-semibold border border-secondary/15">
          {getLanguageFlag(friend.nativeLanguage)}
          Native: {friend.nativeLanguage}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-base-300/60 text-base-content/60 text-[11px] font-semibold border border-base-300">
          {getLanguageFlag(friend.learningLanguage)}
          Learning: {friend.learningLanguage}
        </span>
      </div>

      {/* Message button */}
      <Link
        to={`/chat/${friend._id}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-content text-sm font-semibold border border-primary/20 hover:border-primary transition-all duration-200 group/btn"
      >
        <MessageCircleIcon className="w-4 h-4" />
        Message
      </Link>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

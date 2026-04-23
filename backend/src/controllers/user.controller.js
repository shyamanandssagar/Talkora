const User = require("../models/User.model");
const FriendRequest = require("../models/FriendRequest.model");



const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { _id: { $nin: currentUser.friends || [] } }, // exclude friends
        { isOnboarded: true } // only onboarded users
      ]
    }).select("-password");

    res.status(200).json(
      recommendedUsers
    );

  } catch (error) {
    console.error("Error in getRecommendedUsers controller:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};





const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id) 
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json(
      user.friends
    );

  } catch (error) {
    console.error("Error in getMyFriends controller:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};






const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id; 
    const { id: recipientId } = req.params;

    //  Prevent sending request to yourself
    if (myId.equals(recipientId)) {
      return res.status(400).json({
        success: false,
        message: "You can't send friend request to yourself",
      });
    }

    // Check recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }

    //  Already friends check
    const isAlreadyFriend = recipient.friends?.some((id) =>
      id.equals(myId)
    );

    if (isAlreadyFriend) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists",
      });
    }

    //  Create new friend request
    const newRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent",
      request: newRequest,
    });

  } catch (error) {
    console.error("Error in sendFriendRequest:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



const acceptFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id; 
    const { id: requestId } = req.params;

    //  Find friend request
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // Check if current user is recipient
    if (!request.recipient.equals(myId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this request",
      });
    }

    //  Check if already accepted
    if (request.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Request already accepted",
      });
    }

    //  Update request status
    request.status = "accepted";
    await request.save();

    //  Add each other as friends 
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.recipient }, // avoids duplicates
    });

    await User.findByIdAndUpdate(request.recipient, {
      $addToSet: { friends: request.sender },
    });

    res.status(200).json({
      success: true,
      message: "Friend request accepted",
    });

  } catch (error) {
    console.error("Error in acceptFriendRequest:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const myId = req.user._id; 

    const incomingReqs = await FriendRequest.find({
      recipient: myId,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: myId,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({
      success: true,
      incomingReqs,
      acceptedReqs,
    });

  } catch (error) {
    console.log(
      "Error in getPendingFriendRequests controller",
      error.message
    );

    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getOutgoingFriendReqs = async (req, res) => {
  try {
    const myId = req.user._id; 

    const outgoingRequests = await FriendRequest.find({
      sender: myId,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );

    res.status(200).json({
      success: true,
      outgoingRequests,
    });

  } catch (error) {
    console.log(
      "Error in getOutgoingFriendReqs controller",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const rejectFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // Only recipient can reject
    if (!request.recipient.equals(myId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this request",
      });
    }

    // Delete request
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });

  } catch (error) {
    console.error("Error in rejectFriendRequest:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports={getRecommendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequests,getOutgoingFriendReqs,rejectFriendRequest}
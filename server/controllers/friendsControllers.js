const Friends = require("../models/friendsModel");
const User = require("../models/userModel");

exports.getYourFollowers = async (req, res) => {
  const { userId } = req.body;

  try {
    const friends = await Friends.findOne({ userId });
    if (!friends) throw new Error("Friends not found");

    res.json({ followers: friends.followers });
  } catch (err) {
    console.log(err);
    res.status(404).json(err.toString());
  }
};

exports.getYourFollowings = async (req, res) => {
  const { userId } = req.body;

  try {
    const friends = await Friends.findOne({ userId });
    if (!friends) throw new Error("Friends not found");

    res.json({ followings: friends.followings });
  } catch (err) {
    console.log(err);
    res.status(404).json(err.toString());
  }
};

exports.followFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const friends = await Friends.findOne({ userId });

    const friendInfo = await User.findOne({ _id: friendId });
    if (!friendInfo) throw new Error("User not Found");

    const newFriend = {
      friendId,
      name: friendInfo.name,
      image: friendInfo.image,
      status: "sent",
    };

    if (!friends) {
      await new Friends({
        userId,
        followings: [newFriend],
      }).save();
    } else {
      const isAlreadyFollow = friends.followings.filter(
        (obj) => obj.friendId.toString() === friendId
      );
      if (isAlreadyFollow.length !== 0) throw new Error("Already follow");

      await Friends.update({ userId }, { $push: { followings: newFriend } });
    }

    const updatedFriends = await Friends.findOne({ userId });
    res.json({ friends: updatedFriends });
  } catch (err) {
    console.error(err);
    res.status(400).json(err.toString());
  }
};

exports.unfollowFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const friends = await Friends.findOne({
      userId,
      "followings.friendId": friendId,
    });
    if (!friends) throw new Error("Not following");

    await Friends.update({ userId }, { $pull: { followings: { friendId } } });

    const updatedFriends = await Friends.findOne({ userId });
    res.json({ friends: updatedFriends });
  } catch (err) {
    console.error(err);
    res.status(400).json(err.toString());
  }
};
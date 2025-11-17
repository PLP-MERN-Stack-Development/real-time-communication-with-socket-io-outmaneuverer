import Message from "../Models/message.js";
import User from "../Models/User.js";
import cloudinary from "../Lib/Cloudinary.js";
import { io, userSocketMap } from "../Lib/socket.js";


//get all users except the logged in users
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: userId } }).selct(
          "-password"
        );

        //Count number of messages not seen
        const unseenMessages = {}
        const promises = filterUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.json({
            success: true,
            users: filterUsers,
            unseenMessages
        })

      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      }
}

//get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })
        await Message.updateMany({
            senderId: selectedUserId,
            receiverId: myId
        }, {seen: true})
        res.json({
            success: true,
            messages
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen: true});
        res.json({success: true, message: "Message marked as seen"});
    } catch (error) {
       console.error(error.message);
       res.status(500).json({ message: "Internal Server Error" }); 
    }
}

//Send message to the selected users
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        
        let imageUrl = '';
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({ senderId, receiverId, text, image: imageUrl });

        res.json({ success: true, newMessage });

        // Emit the new message to the receiver socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}




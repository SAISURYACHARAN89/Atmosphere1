const { Message, Chat } = require('../models');

// Get all messages in a chat
exports.getMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { limit = 20, skip = 0 } = req.query;

        const messages = await Message.find({ chat: chatId })
            .populate('sender', 'username displayName avatarUrl')
            .sort({ createdAt: 1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        // Mark messages as read for current user
        await Chat.findByIdAndUpdate(
            chatId,
            { $set: { [`unreadCounts.${req.user._id}`]: 0 } }
        );

        res.json({ messages });
    } catch (err) {
        next(err);
    }
};

// Send a new message
exports.sendMessage = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const message = new Message({
            chat: chatId,
            sender: req.user._id,
            body: content,
        });

        await message.save();
        
        // Populate sender data before returning
        await message.populate('sender', 'displayName email avatarUrl');

        // Get the chat to find other participants
        const chat = await Chat.findById(chatId).populate('participants', '_id');
        
        // Update the lastMessage field in the chat and increment unread counts for other users
        const unreadCounts = { ...chat.unreadCounts || {} };
        chat.participants.forEach(participant => {
            const participantId = participant._id.toString();
            if (participantId !== req.user._id.toString()) {
                unreadCounts[participantId] = (unreadCounts[participantId] || 0) + 1;
            } else {
                unreadCounts[participantId] = 0; // Sender's count is 0
            }
        });

        await Chat.findByIdAndUpdate(chatId, { 
            lastMessage: message._id,
            unreadCounts
        });

        res.status(201).json({ message });
    } catch (err) {
        next(err);
    }
};
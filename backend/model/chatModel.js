import mongoose from 'mongoose';


const ChatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    messages: [
        {
            sender: { type: String, enum: ['user', 'ai'], required: true }, // Sender type
            content: { type: String, required: true }, // Message content
            timestamp: { type: Date, default: Date.now }, // Timestamp for the message
        },
    ],
}, { timestamps: true });


const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;


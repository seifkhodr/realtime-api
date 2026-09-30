import conversationSchema from '../schema/conversation.schema';
import mongoose from 'mongoose';

const conversationModel = mongoose.model('Conversation' , conversationSchema);

export default conversationModel;
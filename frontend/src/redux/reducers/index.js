import { combineReducers } from 'redux';
import {
    selectedConversationReducer,
    messagesReducer,
    conversationsReducer,
    displayedConversationsReducer
} from './conversationReducer';

const rootReducer = combineReducers({
    conversations: conversationsReducer,
    displayedConversations: displayedConversationsReducer,
    messages: messagesReducer,
    selectedConversation: selectedConversationReducer
});

export default rootReducer;
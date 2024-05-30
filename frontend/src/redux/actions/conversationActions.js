import { ActionTypes } from "../constants/actionTypes";

export const setSelectedConversation = (conversation) => {
    return {
        type: ActionTypes.SET_SELECTED_CONVERSATION,
        payload: conversation
    }
};

export const setMessages = (messages) => {
    return {
        type: ActionTypes.SET_MESSAGES,
        payload: messages
    }
};

export const setConversations = (conversations) => {
    return {
        type: ActionTypes.SET_CONVERSATIONS,
        payload: conversations
    }
};

export const setDisplayedConversations = (displayedConversations) => {
    return {
        type: ActionTypes.SET_DISPLAYED_CONVERSATIONS,
        payload: displayedConversations
    }
};
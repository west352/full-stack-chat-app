import { ActionTypes } from "../constants/actionTypes";

export const selectedConversationReducer = (state = null, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_SELECTED_CONVERSATION:
            return payload ? { ...payload } : null;
        default:
            return state;
    }
}

export const messagesReducer = (state = [], { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_MESSAGES:
            return [...payload];
        default:
            return state;
    }
};

export const conversationsReducer = (state = [], { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_CONVERSATIONS:
            return [...payload];
        default:
            return state;
    }
};

export const displayedConversationsReducer = (state = [], { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_DISPLAYED_CONVERSATIONS:
            return [...payload];
        default:
            return state
    }
};
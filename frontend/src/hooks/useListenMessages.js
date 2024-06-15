import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import notification from '../assets/sounds/notification.mp3';
import { setMessages } from '../redux/actions/conversationActions';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../context/AuthContext';

const useListenMessages = () => {
    const { socket } = useSocketContext();
    let messages = useSelector((state) => state.messages);
    const selectedConversation = useSelector((state) => state.selectedConversation);
    const { authUser } = useAuthContext();
    const dispatch = useDispatch();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const newMessageSID = newMessage.senderId;
            const newMessageRID = newMessage.receiverId;
            if (authUser._id === newMessageRID && newMessageSID === selectedConversation._id) {
                newMessage.shouldShake = true;
                const sound = new Audio(notification);
                sound.play();
                dispatch(setMessages([...messages, newMessage]));
            }
        });
        // clean up function to remove listener so sounds won't play multiple times
        return () => socket?.off("newMessage");
    }, [socket, messages, dispatch, authUser._id, selectedConversation._id]);
}

export default useListenMessages;
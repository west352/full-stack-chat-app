import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import notification from '../assets/sounds/notification.mp3';
import { setMessages } from '../redux/actions/conversationActions';
import { useSelector, useDispatch } from 'react-redux';

const useListenMessages = () => {
    const { socket } = useSocketContext();
    let messages = useSelector((state) => state.messages);
    const senderId = messages[0]?.senderId;
    const receiverId = messages[0]?.receiverId;
    const dispatch = useDispatch();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const newMessageSID = newMessage.senderId;
            const newMessageRID = newMessage.receiverId;
            if (newMessageSID === receiverId && newMessageRID === senderId) {
                newMessage.shouldShake = true;
                const sound = new Audio(notification);
                sound.play();
                dispatch(setMessages([...messages, newMessage]));
            }
        });
        return () => socket?.off("newMessage");
    }, [socket, messages, dispatch, senderId, receiverId]);
}

export default useListenMessages;
import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import notification from '../assets/sounds/notification.mp3';
import { setMessages } from '../redux/actions/conversationActions';
import { useSelector, useDispatch } from 'react-redux';

const useListenMessages = () => {
    const { socket } = useSocketContext();
    let messages = useSelector((state) => state.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notification);
            sound.play();
            dispatch(setMessages([...messages, newMessage]));
        });
        return () => socket?.off("newMessage");
    }, [socket, messages, dispatch]);
}

export default useListenMessages;
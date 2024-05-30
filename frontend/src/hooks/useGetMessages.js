import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages } from '../redux/actions/conversationActions';
import toast from 'react-hot-toast';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    let selectedConversation = useSelector((state) => state.selectedConversation);
    let messages = useSelector((state) => state.messages);
    const dispatch = useDispatch();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/messages/${selectedConversation._id}`);
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                dispatch(setMessages(data));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (selectedConversation?._id) {
            getMessages();
        }
    }, [dispatch, selectedConversation._id])

    return { loading, messages };
}

export default useGetMessages;
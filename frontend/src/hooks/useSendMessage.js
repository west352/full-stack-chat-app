import { useState } from "react";
import { setMessages } from "../redux/actions/conversationActions";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    let messages = useSelector((state) => state.messages);
    let selectedConversation = useSelector((state) => state.selectedConversation);
    const dispatch = useDispatch();

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            dispatch(setMessages([...messages, data]));
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, sendMessage };
};
export default useSendMessage;
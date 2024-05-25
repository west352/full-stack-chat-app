import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import useConversation from "../zustand/useConversation";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const { setConversations, displayedConversations, setDisplayedConversations } = useConversation();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("api/users");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data);
                setDisplayedConversations(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getConversations();
    }, [setConversations, setDisplayedConversations]);

    return { loading, displayedConversations };
}

export default useGetConversations;
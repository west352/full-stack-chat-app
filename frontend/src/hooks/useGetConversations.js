import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { setConversations, setDisplayedConversations } from "../redux/actions/conversationActions";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    let displayedConversations = useSelector((state) => state.displayedConversations);
    const dispatch = useDispatch();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch("api/users");
                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                dispatch(setConversations(data));
                dispatch(setDisplayedConversations(data));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getConversations();
    }, [dispatch]);

    return { loading, displayedConversations };
}

export default useGetConversations;
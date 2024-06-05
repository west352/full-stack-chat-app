import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from "react-icons/ti";
import { setSelectedConversation } from '../../redux/actions/conversationActions';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthContext } from '../../context/AuthContext';

const MessageContainer = () => {
    let selectedConversation = useSelector((state) => state.selectedConversation);
    const dispatch = useDispatch();

    useEffect(() => {
        // clean up function (unmounts component)
        return () => dispatch(setSelectedConversation(null));
    }, [dispatch]);
    return (
        <div className='md:w-full flex flex-col'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    {/* Header */}
                    <div className='bg-slate-500 px-4 py-2 mb-2'>
                        <span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>
                            {selectedConversation.firstName + " " + selectedConversation.lastName}
                        </span>
                    </div>

                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome {authUser.firstName + " " + authUser.lastName} 👋</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};

export default MessageContainer
import { useSocketContext } from "../../context/SocketContext";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedConversation } from "../../redux/actions/conversationActions";

const Conversation = ({ conversation, emoji, lastIdx }) => {
    let selectedConversation = useSelector((state) => state.selectedConversation);
    const dispatch = useDispatch();
    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);
    return (
        <>
            <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
                            ${isSelected ? "bg-sky-500" : ""}`}
                onClick={() => dispatch(setSelectedConversation(conversation))}>
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 rounded-full'>
                        <img
                            src={conversation.profilePic}
                            alt='user avatar'
                        />
                    </div>
                </div>

                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className='font-bold text-gray-200'>{conversation.firstName + " " + conversation.lastName}</p>
                        <span className='text-xl'>{emoji}</span>
                    </div>
                </div>
            </div>

            {!lastIdx && <div className='divider my-0 py-0 h-1'></div>}
        </>
    );
};

export default Conversation
import { useAuthContext } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { extractTime } from '../../utils/extractTime';
import { IoIosLink } from "react-icons/io";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    let selectedConversation = useSelector((state) => state.selectedConversation);
    const fromMe = message.senderId === authUser._id;
    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    let bubbleColor = fromMe ? 'bg-blue-500' : 'bg-slate-500';
    const formattedTime = extractTime(message.createdAt);
    const shakeClass = message.shouldShake ? "shake" : "";

    const fileLink = message.file;
    const originalFileName = message.originalFileName;
    let fileLinkComponent;
    if (fileLink && originalFileName) {
        const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "svg", "webp"];
        const fileType = originalFileName.split(".")[1];
        if (imageTypes.includes(fileType)) {
            fileLinkComponent = (
                <a href={fileLink} target="_blank" rel="noopener noreferrer" className="flex justify-end">
                    <img src={fileLink} alt="image sent" className="cursor-pointer w-9/12 object-cover" />
                </a>
            );
            bubbleColor = "";
        } else {
            fileLinkComponent = (<a className='flex underline underline-offset-8'
                href={fileLink}
                target="_blank"
                rel="noopener noreferrer">
                <IoIosLink />
                {originalFileName}
            </a>);
        }
    }

    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='Tailwind CSS chat bubble component'
                        src={profilePic} />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleColor} pb-2 ${shakeClass}`}>
                {message.message ? message.message : fileLinkComponent}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
        </div>
    );
};

export default Message
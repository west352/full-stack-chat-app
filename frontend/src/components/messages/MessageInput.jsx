import { useState } from 'react';
import { BsSendFill } from "react-icons/bs";
import { FaUpload } from "react-icons/fa6";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { loading, sendMessage } = useSendMessage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
    }
    return (
        <form className='px-4 my-3 flex' onSubmit={handleSubmit}>
            <div className='w-11/12'>
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
                    placeholder='Send a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <button type='submit' className='inset-y-0 end-0 flex items-center ps-2 pe-2'>
                {loading ? <div className='loading loading-spinner'></div> : <BsSendFill />}
            </button>
            <button className='inset-y-0 end-0 flex items-center'>
                {loading ? <div className='loading loading-spinner'></div> : <FaUpload />}
            </button>
        </form>
    );
};

export default MessageInput
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import { IoMdChatbubbles } from "react-icons/io";

const Sidebar = () => {
    return (
        <div className='md:w-[500px] border-r border-slate-500 p-4 flex flex-col'>
            <div className='flex justify-start pb-3'>
                <IoMdChatbubbles className='w-10 h-10 text-sky-500 inline pr-2' />
                <h3 className='text-3xl font-semibold text-center text-gray-300'>
                    ChatApp
                </h3>
            </div>
            <SearchInput />
            <div className='divider px-3'></div>
            <Conversations />
            <LogoutButton />
        </div>
    )
}

export default Sidebar
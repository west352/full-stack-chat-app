import { useState } from 'react';
import { IoSearchSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { setDisplayedConversations } from '../../redux/actions/conversationActions';
import toast from 'react-hot-toast';

const SearchInput = () => {
    const [search, setSearch] = useState("");
    let conversations = useSelector((state) => state.conversations);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) {
            dispatch(setDisplayedConversations(conversations));
            return;
        }
        const filteredConversations = conversations.filter((c) => {
            const fullname = (c.firstName + " " + c.lastName).toLowerCase();
            return fullname.includes(search.toLocaleLowerCase());
        });
        if (filteredConversations) {
            dispatch(setDisplayedConversations(filteredConversations));
            setSearch("");
        } else {
            toast.error("No such user found!");
        }
    }

    return (
        <form className='flex items-center gap-2' onSubmit={handleSubmit}>
            <input type="text"
                placeholder='Search...'
                className='input input-bordered rounded-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
                <IoSearchSharp className='w-6 h-6 outline-none' />
            </button>
        </form>
    )
}

export default SearchInput
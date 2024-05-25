import useGetConversations from '../../hooks/useGetConversations'
import Conversation from './Conversation'
import { getRandomEmoji } from '../../utils/emojis';

const Conversations = () => {
    const { loading, displayedConversations } = useGetConversations();

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {displayedConversations?.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    emoji={getRandomEmoji()}
                    lastIdx={idx === displayedConversations.length - 1}
                />
            ))}

            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
        </div>
    )
}

export default Conversations
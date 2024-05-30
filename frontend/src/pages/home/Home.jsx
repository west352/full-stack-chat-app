import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";

const Home = () => {
    return (
        <div className='flex sm:h-[450px] md:h-[650px] rounded-lg overflow-hidden bg-neutral text-neutral-content shadow-xl'>
            <Sidebar />
            <MessageContainer />
        </div>
    );
};
export default Home;
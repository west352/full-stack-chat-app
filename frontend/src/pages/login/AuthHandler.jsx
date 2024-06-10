import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';

const AuthHandler = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuthContext();

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch("api/auth/verify");

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                localStorage.setItem("chat-user", JSON.stringify(data));
                setAuthUser(data);
                navigate("/");
            } catch (error) {
                navigate("/login");
                toast.error(error.message);
            }
        }
        verify();
    }, [navigate, setAuthUser]);

    return <div>
        <span className='loading loading-spinner loading-lg'></span>
    </div>;
};

export default AuthHandler;

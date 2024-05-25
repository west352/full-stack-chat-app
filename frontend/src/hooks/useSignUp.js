import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';

const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ firstName, lastName, email, username, password, confirmPassword, gender }) => {
        const isSuccessful = handleInputErrors({ firstName, lastName, email, username, password, confirmPassword, gender });
        if (!isSuccessful) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, username, password, confirmPassword, gender })
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            //set local storage
            localStorage.setItem("chat-user", JSON.stringify(data));
            //set context after user is authenticated
            setAuthUser(data);

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { loading, signup };
}

export default useSignUp;

function handleInputErrors({ firstName, lastName, email, username, password, confirmPassword, gender }) {
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all the fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }
    return true;
}
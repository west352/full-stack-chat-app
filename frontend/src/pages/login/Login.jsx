import { Link } from 'react-router-dom';
import { useState } from 'react';
import useLogin from '../../hooks/useLogin';
import { IoMdChatbubbles } from "react-icons/io";
import googleIcon from "../../assets/svg/neutral/web_neutral_sq_SI.svg";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    }

    const auth = async () => {
        window.open("https://full-stack-chat-app-4amt.onrender.com/api/auth/google", "_self");
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto shadow-xl'>
            <div className='card w-96 bg-neutral text-neutral-content p-6 rounded-lg'>
                <div className='flex justify-center'>
                    <IoMdChatbubbles className='w-10 h-10 text-sky-500 inline pr-2' />
                    <h1 className='text-3xl font-semibold text-center text-gray-300'>
                        Login
                        <span className='text-blue-500'> ChatApp</span>
                    </h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Username</span>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter username'
                            className='w-full input input-bordered h-10'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='w-full input input-bordered h-10'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Link to='/signup' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                        {"Don't"} have an account?
                    </Link>
                    <div>
                        <button className='btn btn-block btn-sm mt-2' disabled={loading}>
                            {loading ? <span className='loading loading-spinner'></span> : "Login"}
                        </button>
                    </div>
                </form>
                <button className='justify-center pt-4 inline-flex w-1/2' type="button" onClick={() => auth()}>
                    <img src={googleIcon} alt="Sign in with Google" />
                </button>
            </div>
        </div>
    )
}

export default Login
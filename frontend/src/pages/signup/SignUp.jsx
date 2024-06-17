import GenderCheckbox from "./GenderCheckbox";
import { Link } from 'react-router-dom';
import { useState } from "react";
import useSignUp from "../../hooks/useSignUp";

const SignUp = () => {

    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });

    const { loading, signup } = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
    }

    const handleCheckboxChange = (gender) => {
        setInputs({ ...inputs, gender });
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto shadow-xl'>
            <div className='card w-96 bg-neutral text-neutral-content p-6 rounded-lg'>
                <h1 className='text-3xl font-semibold text-center text-gray-300'>
                    Sign Up <span className='text-blue-500'> ChatApp</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>First Name</span>
                        </label>
                        <input type='text' className='w-full input input-bordered  h-10'
                            value={inputs.firstName}
                            onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })} />
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Last Name</span>
                        </label>
                        <input type='text' className='w-full input input-bordered  h-10'
                            value={inputs.lastName}
                            onChange={(e) => setInputs({ ...inputs, lastName: e.target.value })} />
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Email</span>
                        </label>
                        <input type='text' className='w-full input input-bordered  h-10'
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })} />
                    </div>

                    <div>
                        <label className='label p-2 '>
                            <span className='text-base label-text'>Username</span>
                        </label>
                        <input type='text' className='w-full input input-bordered h-10'
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })} />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='w-full input input-bordered h-10'
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Confirm Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            className='w-full input input-bordered h-10'
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>

                    <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

                    <Link to='/login' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' href='#'>
                        Already have an account?
                    </Link>

                    <div>
                        <button className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading}>
                            {loading ? <span className='loading loading-spinner'></span> : "Sign up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default SignUp;
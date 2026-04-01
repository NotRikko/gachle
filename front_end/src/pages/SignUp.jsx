import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: '',
    });
    const [errorData, setErrorData] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorData(null);
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.created === false) {
                setErrorData(data.errors);
            } else if (data.created === true) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getError = (field) => {
        if (!errorData) return null;
        const error = errorData.find((e) => e.path === field);
        return error ? (
            <p className="text-red-500 text-sm mt-1">{error.msg}</p>
        ) : null;
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-stone-200">
            <div className="flex flex-col justify-evenly items-center text-center bg-white border border-gray-300 rounded-xl px-12 py-10 w-[30vw] min-w-[500px] h-[80vh] max-sm:w-[80vw] max-sm:min-w-0 max-sm:px-6">
                
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold m-0">Join Gachle</h1>
                    <p className="text-gray-500 text-sm">Keep track of your scores</p>
                    <p className="text-sm">
                        Already have an account?{' '}
                        <Link to='/login' className="text-teal-500 hover:underline">
                            Log in.
                        </Link>
                    </p>
                </div>

                <form className="flex flex-col w-full gap-4 text-left" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="user_name" className="text-sm font-medium">Username</label>
                        <input
                            type='text'
                            name='user_name'
                            id='user_name'
                            required
                            value={formData.user_name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        {getError('user_name')}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input
                            type='email'
                            name='email'
                            id='email'
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        {getError('email')}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        {getError('password')}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm_password" className="text-sm font-medium">Confirm Password</label>
                        <input
                            type='password'
                            name='confirm_password'
                            id='confirm_password'
                            required
                            className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <button
                        type='submit'
                        className="mt-2 bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 rounded cursor-pointer transition-colors"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-xs text-gray-400">
                    Thank you for joining the Gachle community.
                </p>
            </div>
        </div>
    );
}

export default SignUp;
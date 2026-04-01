import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../UserProvder';

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();
    const { isLoggedIn, handleLoginStatus, handleUser } = useUser();
    const [formData, setFormData] = useState({
        user_name: '',
        password: '',
        remember_me: false,
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.user_name,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (data.authenticated) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                handleLoginStatus();
                handleUser(data.user);
                navigate('/');
            } else {
                setError(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong, please try again');
        }
    };

    if (isLoggedIn) {
        navigate('/');
        return null;
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-stone-200">
            <div className="flex flex-col justify-evenly items-center text-center bg-white border border-gray-300 rounded-xl px-12 py-10 w-[30vw] min-w-[500px] h-[70vh] max-sm:w-[80vw] max-sm:min-w-0 max-sm:px-6">

                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold m-0">Welcome back</h1>
                    <p className="text-gray-500 text-sm">Sign in to track your scores</p>
                    <p className="text-sm">
                        Don't have an account?{' '}
                        <Link to='/signup' className="text-teal-500 hover:underline">
                            Sign up.
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form className="flex flex-col w-full gap-4 text-left" onSubmit={handleSubmit}>
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

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
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type='checkbox'
                            name='remember_me'
                            id='remember_me'
                            checked={formData.remember_me}
                            onChange={handleInputChange}
                            className="accent-teal-400"
                        />
                        <label htmlFor="remember_me" className="text-sm">Remember me</label>
                    </div>

                    <button
                        type='submit'
                        className="mt-2 bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 rounded cursor-pointer transition-colors"
                    >
                        Login
                    </button>
                </form>

                <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <p className="cursor-pointer hover:underline">Forgot your username?</p>
                    <p className="cursor-pointer hover:underline">Forgot your password?</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
import { useState } from 'react';
import { useUser } from '../UserProvder';

const API_URL = import.meta.env.VITE_API_URL;

function UserCard() {
    const [editingField, setEditingField] = useState(null);
    const [apiURL, setApiURL] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState('');
    const { user, setUser, handleLogout } = useUser();

    const handleEdit = (field, fieldApiURL) => {
        setIsEditing(true);
        setEditingField(field);
        setApiURL(fieldApiURL);
        setFormData(null);
    }

    const handleFormData = (e) => {
        setFormData(e.target.value);
    }

    const handleFileData = (e) => {
        setFormData(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData) {
            if (editingField === 'Profile Picture') {
                await handleFileSubmit(formData);
            } else {
                await handleTextSubmit(formData);
            }
        } else {
            console.log('No new data');
        }
    }

    const handleTextSubmit = async (newData) => {
        const response = await fetch(apiURL, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ newData })
        });
        if (response.ok) {
            const updatedUser = await response.json();
            setUser(updatedUser);
            handleLogout();
        } else {
            console.log('Failed to update');
        }
    }

    const handleFileSubmit = async (newFile) => {
        const formData = new FormData();
        formData.append('image', newFile);

        const response = await fetch(apiURL, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
        } else {
            console.log('Failed to update profile picture');
        }
    }

    return (
        <div className="flex flex-col items-center">
            {isEditing ? (
                <form
                    className="flex flex-col items-center w-[60%] mt-[12%] mr-[5%] gap-2"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor={editingField}>Change {editingField}</label>
                    {editingField === 'Profile Picture' ? (
                        <input
                            type='file'
                            accept='image/*'
                            name={editingField}
                            onChange={handleFileData}
                        />
                    ) : (
                        <input
                            type="text"
                            name={editingField}
                            value={formData || ''}
                            onChange={handleFormData}
                            className="border border-black rounded px-2 py-1 w-full"
                        />
                    )}
                    <button
                        type='submit'
                        className="border border-black rounded px-4 py-1 cursor-pointer hover:bg-gray-100"
                    >
                        Submit
                    </button>
                </form>
            ) : (
                <div className="flex flex-col items-center mt-[12%] mr-[5%]">
                    <img
                        src={user.image}
                        alt={user.user_name}
                        className="border-2 border-black rounded-xl w-[65%] min-h-[200px] object-cover"
                    />
                    <div className="mt-4 text-center">
                        <h1 className="text-2xl font-bold">{user.user_name}</h1>
                        <h2 className="text-lg">High Score: {user.high_score}</h2>
                    </div>
                    <div className="flex flex-col mt-[10%] text-base gap-2 w-full px-4">
                        <h2
                            className="cursor-pointer hover:underline"
                            onClick={() => handleEdit('Profile Picture', `${API_URL}/users/picture`)}
                        >
                            Change profile picture
                        </h2>
                        <h2
                            className="cursor-pointer hover:underline"
                            onClick={() => handleEdit('Username', `${API_URL}/users/username`)}
                        >
                            Change username
                        </h2>
                        <h2
                            className="cursor-pointer hover:underline"
                            onClick={() => handleEdit('Password', `${API_URL}/users/password`)}
                        >
                            Change password
                        </h2>
                        <h2
                            className="cursor-pointer hover:underline text-red-600"
                            onClick={handleLogout}
                        >
                            Log out
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserCard;
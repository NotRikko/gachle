import Overlay from '../components/Overlay';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function Scoreboard() {
    const [topUsers, setTopUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/users`, { mode: 'cors' });
                if (!response.ok) {
                    throw new Error('Issue with network response');
                }
                const topUsersData = await response.json();
                setTopUsers(topUsersData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <h1 className="flex justify-center items-center mt-[40vh]">
                Loading...
            </h1>
        );
    }

    return (
        <div className="flex flex-col items-center pt-[9vh] gap-[3vh]">
            <Overlay />
            <h1>Leaderboard</h1>
            <div>
                {/* Header */}
                <div className="grid grid-cols-[1fr_1.5fr_1fr] w-[60vw] justify-items-center border-b border-black max-sm:w-[80vw]">
                    <p>Rank</p>
                    <p>User</p>
                    <p>Score</p>
                </div>

                {/* Rows */}
                <div>
                    {topUsers.map((user, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_1.5fr_1fr] justify-items-center items-center w-[60vw] text-xl max-sm:w-[80vw] max-sm:text-base"
                        >
                            <p>{index + 1}</p>
                            <div className="grid grid-cols-2 items-center gap-[5%] w-full overflow-hidden">
                                <img
                                    src={user.image}
                                    alt={user.user_name}
                                    className="justify-self-end w-[35%] min-w-[40px] m-[10%] border border-black rounded-2xl"
                                />
                                <p>{user.user_name}</p>
                            </div>
                            <p>{user.high_score}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Scoreboard;
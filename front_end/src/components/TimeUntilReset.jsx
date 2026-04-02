import { useState, useEffect } from 'react';

function TimeUntilReset() {
    const [timeLeft, setTimeLeft] = useState(null);

    const calculateTimeUntilMidnight = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return midnight - now;
    };

    useEffect(() => {
        const calculateAndSetTimeLeft = () => setTimeLeft(calculateTimeUntilMidnight());
        calculateAndSetTimeLeft();
        const intervalId = setInterval(calculateAndSetTimeLeft, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (timeLeft === null) {
        return <p className="text-gray-400 text-sm">Calculating...</p>;
    }

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="flex flex-col items-center gap-2 py-6">
            <p className="text-sm text-gray-500 uppercase tracking-widest">Next character in</p>
            <div className="flex gap-3">
                <div className="flex flex-col items-center bg-gray-100 rounded-xl px-4 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{pad(hours)}</span>
                    <span className="text-xs text-gray-400">hrs</span>
                </div>
                <span className="text-2xl font-bold self-center">:</span>
                <div className="flex flex-col items-center bg-gray-100 rounded-xl px-4 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{pad(minutes)}</span>
                    <span className="text-xs text-gray-400">min</span>
                </div>
                <span className="text-2xl font-bold self-center">:</span>
                <div className="flex flex-col items-center bg-gray-100 rounded-xl px-4 py-2 min-w-[60px]">
                    <span className="text-2xl font-bold">{pad(seconds)}</span>
                    <span className="text-xs text-gray-400">sec</span>
                </div>
            </div>
        </div>
    );
}

export default TimeUntilReset;
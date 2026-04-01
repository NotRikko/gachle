import { useEffect, useState } from 'react';
import GuessCard from '../components/GuessCard';
import TimeLeft from '../components/TimeLeft';
import TextField from '@mui/material/TextField';
import { Box, Typography, Avatar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Overlay from '../components/Overlay';
import { useUser } from "../UserProvder";

const API_URL = import.meta.env.VITE_API_URL;

function Game() {
    const [characters, setCharacters] = useState([]);
    const [dailyCharacter, setDailyCharacter] = useState(null);
    const [playerGuess, setPlayerGuess] = useState('');
    const [allGuesses, setAllGuesses] = useState([]);
    const [victory, setVictory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState(0);
    const { user, setUser } = useUser();

    const options = characters.map((character) => ({
        name: character.name,
        image: character.image
    }));

    const fetchData = async () => {
        try {
            const [charactersResponse, dailyCharacterResponse] = await Promise.all([
                fetch(`${API_URL}/characters`, { mode: 'cors' }),
                fetch(`${API_URL}/characters/daily`, { mode: 'cors' })
            ]);

            if (!charactersResponse.ok || !dailyCharacterResponse.ok) {
                throw new Error('Issue with network response');
            }

            const charactersData = await charactersResponse.json();
            const dailyCharacterData = await dailyCharacterResponse.json();

            setCharacters(charactersData);
            setDailyCharacter(dailyCharacterData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVictory = async () => {
        const updatedScore = score + 1;
        setScore(updatedScore);
        setVictory(true);

        if (user && updatedScore > user.high_score) {
            try {
                const response = await fetch(`${API_URL}/users/score`, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify({ high_score: updatedScore })
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    setUser(updatedUser);
                } else {
                    console.error('Failed to update score');
                }
            } catch (error) {
                console.error('Error updating score:', error);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPlayerGuess('');

        const attemptGuess = playerGuess.toLowerCase();

        if (allGuesses.find((guess) => guess.name.toLowerCase() === attemptGuess)) {
            alert('Already guessed this character!');
            return;
        }

        const guessedCharacter = characters.find(
            (character) => character.name.toLowerCase() === attemptGuess
        );

        if (guessedCharacter) {
            setAllGuesses((prev) => [...prev, guessedCharacter]);
            if (attemptGuess === dailyCharacter.name.toLowerCase()) {
                handleVictory();
            }
        } else {
            alert('Character does not exist');
        }
    };

    const newGame = () => {
        fetchData();
        setVictory(false);
        setAllGuesses([]);
    };

    if (isLoading) {
        return (
            <h1 className="flex flex-col justify-center items-center mt-[40vh]">
                Loading...
            </h1>
        );
    }

    return (
        <>
            <Overlay />
            <div className="flex flex-col items-center pt-[60px] w-screen overflow-hidden">
                <div>
                    {victory ? (
                        <TimeLeft />
                    ) : (
                        <form className="flex flex-col gap-2 items-center" onSubmit={handleSubmit}>
                            <h2>Guess the Character</h2>
                            <div className="flex flex-row gap-2">
                                <Autocomplete
                                    disablePortal
                                    options={options}
                                    onChange={(event, value) => setPlayerGuess(value?.name || '')}
                                    inputValue={playerGuess}
                                    onInputChange={(event, newInputValue) => {
                                        setPlayerGuess(newInputValue);
                                    }}
                                    autoHighlight={true}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Characters" />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '500px' }}
                                            {...props}
                                        >
                                            <Avatar alt={option.name} src={option.image} />
                                            <Typography variant="body1">{option.name}</Typography>
                                        </Box>
                                    )}
                                    getOptionLabel={(option) => option.name}
                                    filterOptions={(options, { inputValue }) =>
                                        options.filter((option) =>
                                            option.name.toLowerCase().includes(inputValue.toLowerCase())
                                        )
                                    }
                                />
                                <button type="submit">Enter</button>
                            </div>
                        </form>
                    )}
                </div>

                {victory ? null : (
                    <h2>{allGuesses.length !== 0 ? 'Guess Again!' : null}</h2>
                )}

                {victory ? (
                    <div className="flex flex-col items-center pb-6">
                        <h2>Victory!</h2>
                        <button className="w-[10vw] h-[3vh]" onClick={newGame}>
                            Play again
                        </button>
                    </div>
                ) : null}

                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center w-full">
                        <ul className="grid grid-cols-5 gap-2 border-b border-black pb-2 pl-0 list-none">
                            <li className="w-20 text-center">Result</li>
                            <li className="w-20 text-center">Name</li>
                            <li className="w-20 text-center">Game</li>
                            <li className="w-20 text-center">Gender</li>
                            <li className="w-20 text-center">Hair Color</li>
                        </ul>
                    </div>
                    <div className="flex flex-col-reverse gap-2 p-6">
                        {allGuesses.map((guess, index) => (
                            <GuessCard key={index} guess={guess} correctGuess={dailyCharacter} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Game;
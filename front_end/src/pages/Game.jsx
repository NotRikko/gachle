import { useEffect, useState } from 'react';
import GuessCard from '../components/GuessCard';
import TimeLeft from '../components/TimeLeft';
import TextField from '@mui/material/TextField';
import { Box, Typography, Avatar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Overlay from '../components/Overlay';
import Style from './Game.module.css';
import { useUser } from '../UserProvder';

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

            console.log('characters:', charactersData); 
            console.log('daily:', dailyCharacterData);

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
        return <h1 id={Style.loading}>Loading...</h1>;
    }

    return (
        <>
            <Overlay />
            <div id={Style.main}>
                <div>
                    {victory ? (
                        <TimeLeft />
                    ) : (
                        <form id={Style.guess} onSubmit={handleSubmit}>
                            <h2>Guess the Character</h2>
                            <div>
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
                {victory ? null : <h2>{allGuesses.length !== 0 ? 'Guess Again!' : null}</h2>}
                {victory ? (
                    <div id={Style.victory}>
                        <h2>Victory!</h2>
                        <button onClick={newGame}>Play again</button>
                    </div>
                ) : null}
                <div id={Style.container}>
                    <div id={Style.cardsHeader}>
                        <ul>
                            <li>Result</li>
                            <li>Name</li>
                            <li>Game</li>
                            <li>Gender</li>
                            <li>Hair Color</li>
                        </ul>
                    </div>
                    <div className={Style.cards}>
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
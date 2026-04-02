const Cell = ({ value, isCorrect }) => (
    <div className={`
        w-20 h-20 flex items-center justify-center text-center text-white text-xs
        font-medium p-1 break-words rounded-lg transition-colors shadow-sm
        ${isCorrect ? 'bg-emerald-500' : 'bg-red-400'}
    `}>
        {value}
    </div>
);

function GuessCard({ guess, correctGuess }) {
    return (
        <div className="flex items-center justify-center gap-2">
            <div className="w-20 h-20 rounded-lg overflow-hidden shadow-sm">
                <img
                    src={guess.image}
                    alt={guess.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <Cell value={guess.name} isCorrect={guess.name === correctGuess.name} />
            <Cell value={guess.game} isCorrect={guess.game === correctGuess.game} />
            <Cell value={guess.gender} isCorrect={guess.gender === correctGuess.gender} />
            <Cell value={guess.hair_color} isCorrect={guess.hair_color === correctGuess.hair_color} />
        </div>
    );
}

export default GuessCard;
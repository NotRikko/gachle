function GuessCard({ guess, correctGuess }) {
    return (
        <div className="flex items-center justify-center gap-2">
            <div className="w-20 h-20">
                <img src={guess.image} alt={guess.name} className="w-20 h-20 object-cover" />
            </div>
            <div className={`w-20 h-20 flex items-center justify-center text-center text-white text-xs p-1 ${guess.name === correctGuess.name ? 'bg-green-600' : 'bg-red-600'}`}>
                {guess.name}
            </div>
            <div className={`w-20 h-20 flex items-center justify-center text-center text-white text-xs p-1 ${guess.game === correctGuess.game ? 'bg-green-600' : 'bg-red-600'}`}>
                {guess.game}
            </div>
            <div className={`w-20 h-20 flex items-center justify-center text-center text-white text-xs p-1 ${guess.gender === correctGuess.gender ? 'bg-green-600' : 'bg-red-600'}`}>
                {guess.gender}
            </div>
            <div className={`w-20 h-20 flex items-center justify-center text-center text-white text-xs p-1 ${guess.hair_color === correctGuess.hair_color ? 'bg-green-600' : 'bg-red-600'}`}>
                {guess.hair_color}
            </div>
        </div>
    );
}

export default GuessCard
import Style from './GuessCard.module.css'

function GuessCard({guess, correctGuess}) {
    return (
        <div className={Style.card} >
            <div><img src={guess.image}></img></div>
            <div className={guess.name === correctGuess.name ? Style.correct : Style.incorrect}>
                {guess.name}
            </div>
            <div className={guess.game === correctGuess.game ? Style.correct : Style.incorrect}>
                {guess.game}
            </div>
            <div className={guess.gender === correctGuess.gender ? Style.correct : Style.incorrect}>
                {guess.gender}
            </div>
            <div className={guess.hair_color === correctGuess.hair_color ? Style.correct : Style.incorrect}>
                {guess.hair_color}
            </div>
        </div>
    )
}

export default GuessCard
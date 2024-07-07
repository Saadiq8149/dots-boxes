

export default function ScoreDisplay(props) {
    return (
        <div className="score-display">
            <div className="score-counter team">
                <h1>{props.score.team}</h1>
            </div>
            <div className="score-counter enemy">
                <h1>{props.score.enemy}</h1>
            </div>
        </div>
    )
}

import background from "../assets/stock-background.jpg"

export default function Ui(props) {
    return(
        <div className="ui">
            <div className="chat"></div>
            <button className={`reset-btn ${props.gameEnd ? "new" : "resign"}`} id={props.gameEnd ? "new-game" : "resign"}>{props.gameEnd ? "New game" : "Resign"}</button>
        </div>
    )
}

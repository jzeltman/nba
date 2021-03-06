import React from 'react';
import { connect } from 'react-redux';
import dict from '../dictionary';
import Logger from '../logger';
const Log = new Logger('Team Picker');


class Schedule extends React.Component {
    constructor(props){
        super();
        this.renderGame = this.renderGame.bind(this); 
    }

    renderGame(game){
        return <li key={game.id}>
            <h4>{game[dict.home]} vs. {game[dict.visitor]}</h4>
            <span className="game_day-time">{game.Date} - {game[dict.gametime]}</span>
        </li>
    }

    render(){
        Log.log(['render',this.state,this.props]);
        let games = this.props.games.map( game => { return this.renderGame(game); })
        return <div id="schedule">
            <h3>Recommended Games</h3>
            <hr/>
            <ul className="games-list">{games}</ul>
        </div>
    }
}

const mapStateToProps = (state,props) => {
    return { games : state.userGames }
}

export default connect(mapStateToProps)(Schedule);

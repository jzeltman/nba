import React from 'react';
import { connect } from 'react-redux';
import Logger from '../logger'
const Log = new Logger('GamesPerWeek View');

class GamesPerWeek extends React.Component {
    constructor(props){
        super(props);
        Log.log(['props',props]);
        this.gamesPerWeekChangeHandler = this.gamesPerWeekChangeHandler.bind(this);
        this.state = { 
            gamesPerWeek : props.user.gamesPerWeek,
            totalGames   : props.totalGamesThisWeek
        };
    }

    componentWillReceiveProps(props){
        Log.log(['componentWillUpdate',props]);
        this.setState({
            gamesPerWeek : props.user.gamesPerWeek,
            totalGames   : props.totalGamesThisWeek
        })
    }

    gamesPerWeekChangeHandler(e){
        Log.log(['changeHandler',e,e.target.value]);
        this.setState({ gamesPerWeek : e.target.value });
        this.props.onChangeGamesPerWeek(e.target.value);
    }

    render(){
        Log.log(['render',this.state,this.props])
        return <li id="games-per-week">
            <strong>Games Per Week - {this.state.gamesPerWeek}</strong>
            <span className="fl-right slider">
                <span className="games-per-week_start">1</span>
                <input type="range" 
                       min="1" 
                       max={this.state.totalGames}
                       value={this.state.gamesPerWeek}
                       onChange={this.gamesPerWeekChangeHandler}/>
                <span className="games-per-week_end">{this.state.totalGames}</span>
            </span>
        </li>
    }
}

const mapStateToProps = (state,props) => {
    Log.log(['mapStateToProps',state]);
    return {
        user : state.userPreferences,
        totalGamesThisWeek : state.gamesThisWeek.length
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onChangeGamesPerWeek: (value) => {
            dispatch({ type: 'CHANGE_GAMES_PER_WEEK', value })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(GamesPerWeek);

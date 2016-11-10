import React from 'react';
import { connect } from 'react-redux';
import Logger from '../logger'
const Log = new Logger('Preferences View');

class Preferences extends React.Component {
    constructor(props){
        super(props);
        Log.log(['props',props]);
        this.changeHandler = this.changeHandler.bind(this);
        this.state = { 
            preferences  : props.preferences,
            userTeams    : props.userTeams
        };
    }

    componentWillReceiveProps(props){
        Log.log(['componentWillUpdate',props]);
        this.setState({
            preferences  : props.preferences,
            userTeams    : props.userTeams
        })
    }

    changeHandler(e){
        Log.log(['changeHandler',e,e.target.value]);
        this.setState({ preferences : e.target.value });
        this.props.onChangeGameQualityPreference(e.target.value)
    }

    render(){
        Log.log(['render',this.state,this.props])
        return <li id="game-quality">
            <strong>Matchup Mixture</strong>
            <select className='fl-right'
                    value={this.state.preferences}
                    selected={this.state.preferences}
                    onChange={this.changeHandler}>
                <option value='favorite'>Always Show My Teams</option>
                <option value='best'>Prefer Best Matchups</option>
                <option value='mix'>Mix</option>
            </select>
        </li>
    }
}

const mapStateToProps = (state,props) => {
    Log.log(['mapStateToProps',state]);
    return {
        preferences : state.userPreferences.preferences,
        userTeams   : state.userPreferences.teams
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onChangeGameQualityPreference: (value) => {
            dispatch({ type: 'CHANGE_GAME_QUALITY_PREFERENCE', value })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Preferences);

import React from 'react';
import { connect } from 'react-redux';
import dict from '../dictionary';
import Logger from '../logger';
const Log = new Logger('Team Picker');

class TeamPicker extends React.Component {
    constructor(props){
        super(props);
        Log.log(['constructor',props]);

        this.clickHandler = this.clickHandler.bind(this);
        this.state = {
            teams : props.teams,
            sort : 'alpha'
        }
    }

    clickHandler(e){
        this.props.onToggleFavoriteTeam(e.target.dataset.id)
    }

    renderTeam(team){
        return <li key={team.id}>
            <input type="checkbox" 
                   onChange={this.clickHandler} 
                   checked={team.favorite}
                   data-id={team.id} />
            <span>{team.name}</span>
        </li>
    }

    render(){
        Log.log(['render',this.state,this.props])
        let markup = this.state.teams.map( team => { return this.renderTeam(team); });
        return <div id="team-selector">
            <h3>Select your favorite team(s)</h3>
            <hr/>
            <ul>{markup}</ul>
        </div>
    }
}

const mapStateToProps = (state,props) => {
    Log.log(['mapStateToProps',state,props]);
    return { teams : state.teams }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleFavoriteTeam : (id) => {
            dispatch({ type: 'TOGGLE_FAVORITE_TEAM', id })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeamPicker);

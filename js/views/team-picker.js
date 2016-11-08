import React from 'react';
import { connect } from 'react-redux';

import dict from '../dictionary';

class TeamPicker extends React.Component {
    constructor(props){
        super(props);
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
        return <li>
            <input type="checkbox" 
                   onChange={this.clickHandler} 
                   checked={team.favorite}
                   key={team.id}
                   data-id={team.id} />
            <span>{team.name}</span>
        </li>
    }

    render(){
        let markup = this.state.teams.map( team => { return this.renderTeam(team); });
        return <div id="team-selector">
            <h3>Select your favorite team(s)</h3>
            <hr/>
            <ul>{markup}</ul>
        </div>
    }
}

const mapStateToProps = (state,props) => {
    console.log('state',state,props);
    return { 
        teams : state.teams 
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleFavoriteTeam : (id) => {
            dispatch({ type: 'TOGGLE_FAVORITE_TEAM', id })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TeamPicker);

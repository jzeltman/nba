var Logger = require('../logger');
var Log    = new Logger('Parse Rankings');
var dict   = require('../dictionary');

function getTeamAlias(name){
    var alias;
    dict.allTeams.forEach( team => {
        if ( team.synonyms.indexOf(name) !== -1 ){ alias = team.alias; }
    });
    return alias;
}


module.exports = function ParseRankings(passedRankings){
    if ( ( passedRankings === undefined || passedRankings === null ) && 
         ( !passedRankings.conferences ) ){ 
        return false; 
    }
    Log.log(['Passed Rankings',passedRankings])

    var rankings = [];
    // parse out data into format we need
    passedRankings.conferences.map( conference => {
    var Conference = {};
        Conference.alias = conference.alias;
        Conference.name = conference.name;
        Conference.ranks = [];
        conference.divisions.map( division => {
            division.teams.map( team => {
                team.rank = team.rank.conference;
                team.alias = getTeamAlias(team.name); 
                Conference.ranks.push(team);
            });
        });
        rankings.push(Conference);
    });

    Log.log(['rankings',rankings])
    // sort conferences
    if ( rankings.length > 0 ){
        rankings = rankings.map( conference => {
            conference.ranks = conference.ranks.sort( (a,b) =>{
                if ( a.rank < b.rank ){ return -1; }
                if ( a.rank > b.rank ){ return 1; }
                else { return 0; }
            });
            return conference;
        });
    }
    Log.log(['rankings',rankings])

    return rankings;
}

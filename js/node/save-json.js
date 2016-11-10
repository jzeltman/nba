var fs = require('fs');

module.exports = function saveJSON(filename,json){
    if ( filename === undefined || json === undefined ){ return false; }
    fs.writeFile('./data/' + filename, JSON.stringify(json,null,4), function (err) {
        if (err) throw err;
        console.log(filename + ' saved');
    });
}

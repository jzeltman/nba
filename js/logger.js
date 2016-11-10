var Logger = function(logName){
    this.logName = logName;

    this.output = function(type,messages){
        if ( typeof messages === 'string' ){
            console[type]('[' + this.logName + '] >> ', messages);
        } else { 
            messages.forEach( message => { console[type]('[' + this.logName + '] >> ', message); }); 
        }
    }

    this.log = function(messages){ this.output('log',messages); }
    this.info = function(messages){ this.output('info',messages); }
    this.error = function(messages){ this.output('error',messages); }
    this.table = function(messages){ this.output('table',messages); }
    return this;
}

module.exports = Logger; 

/*
export default class Logger {
    constructor(logName){
        this.logName = logName;
    }

    output(type,messages){
        if ( typeof messages === 'string' ){
            console[type]('[' + this.logName + '] >> ', messages);
        } else { 
            messages.forEach( message => { console[type]('[' + this.logName + '] >> ', message); }); 
        }
    }

    log(messages){ this.output('log',messages); }
    info(messages){ this.output('info',messages); }
    error(messages){ this.output('error',messages); }
    table(messages){ this.output('table',messages); }
}
*/

var mysql = require('mysql2');

let responseBody = { code: 202, msg: 'Unable to Initialize' };
let query = {
    sql: '',
    timeout: 3000,
    values: []
};

var methods = {

    executeQuery : async function (sql, values, credentials, logMsg) {
        return new Promise(resolve => {
            logMsg += "EXECUTE_QUERY START" + "\n";
            try {
                var connectionParams = {
                    host: credentials.ASTRAGEN_CORE_DB_END_POINT,
                    user: credentials.ASTRAGEN_CORE_DB_USERNAME,
                    password: credentials.ASTRAGEN_CORE_DB_PASSWORD,
                    database: credentials.INTERNAL_USE_DUMMY_DB_NAME,
                    flags: 'MULTI_STATEMENTS'
                };
                
                var connection = mysql.createConnection(connectionParams);

                query.sql = sql;
                query.timeout = credentials.QUERY_TIMEOUT;
                query.values = values;

                connection.query(query, function (error, results, fields) {
                    connection.destroy();
                    if (error) {
                        logMsg += "201 - " + 'Invalid Query ' + ' : ' + JSON.stringify(query) + ' : ' + 'MYSQL ERROR : ' + JSON.stringify(error) + "\n";
                        console.log(logMsg);
                        console.log(error);
                        logMsg = "";
                        logMsg += "201 - " + "EXECUTE_QUERY END" + "\n";
                        resolve({ code: 201, msg: 'Unknown error. Please Contact Admin', logMsg: logMsg });
                    } else {
                        logMsg += " : 200 - " + "EXECUTE_QUERY END" + "\n";
                        resolve({ code: 200, msg: results, logMsg: logMsg });
                    }
                });
            } catch (ex) {
                logMsg += "201 - " + 'Database connection Error ' + ' : ' + JSON.stringify(query) + ' : ' + 'MYSQL ERROR : ' + JSON.stringify(ex) + "\n";
                console.log(logMsg);
                console.log(ex);
                logMsg = "";
                logMsg += "201 - " + "EXECUTE_QUERY END " + "\n";
                connection.destroy();
                resolve({ code: 201, msg: "Unknown error. Please Contact Admin", logMsg: logMsg });
            }
        });

    },
};

module.exports = methods;



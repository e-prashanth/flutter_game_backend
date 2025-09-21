const getParams = require("../util/get_params");
const mysql = require("../util/run_mysql_script");

var methods = {
  SAMPLE_GET: async function (event, credentials, logMsg) {
    // POSITIONS
    var reqParams = [];
    var returnResponse = { code: 201, msg: "Unknown exception. Please contact admin.", logMsg: logMsg, };

    try {
      var getParamsResponsePromise = getParams.GET_PARAMS(event, reqParams, returnResponse.logMsg);
      var getParamsResponse = await getParamsResponsePromise;

      if (getParamsResponse && getParamsResponse.code && getParamsResponse.code === 200) {
        var sqlQuery = "SELECT * FROM " + credentials.INTERNAL_USE_DUMMY_DB_NAME + ".users_prashanth";
        console.log(sqlQuery);

        var sqlValues = [];

        console.log(sqlValues);

        var mysqlResponsePromise = mysql.executeQuery(sqlQuery, sqlValues, credentials, getParamsResponse.logMsg);
        var mysqlResponse = await mysqlResponsePromise;

        if (mysqlResponse && mysqlResponse.code && mysqlResponse.code === 200) {
          mysqlResponse.logMsg += " : 200 : SAMPLE_GET - given successfully." + "\n";
          //   console.log(mysqlResponse);
          returnResponse = { code: 200, msg: mysqlResponse.msg, logMsg: mysqlResponse.logMsg };
        } else {
          mysqlResponse.logMsg += " : 201 : SAMPLE_GET - failed to get data." + "\n";

          returnResponse = { code: 201, msg: "Failed to retrieve data.", logMsg: mysqlResponse.logMsg };
        }
      } else {
        console.log(getParamsResponse.msg[0]);
        returnResponse = getParamsResponse;
      }
    } catch (e) {
      returnResponse.logMsg += " : 205 : " + "SAMPLE_GET - Error " + " : " + JSON.stringify(e) + "\n";
      console.log(returnResponse.logMsg);
      console.log(e);
      returnResponse = { code: 205, msg: "Unknown error. Please Contact Admin.", logMsg: returnResponse.logMsg, };
    }

    return new Promise((resolve) => {
      resolve(returnResponse);
    });
  },
  INSERT_EMP_ID_WHEN_GAME_STARTS: async function (event, credentials, logMsg) {
    // POSITIONS              0           1
    var reqParams = ["emp_login_id", "created_by"];
    var returnResponse = { code: 201, msg: "Unknown exception. Please contact admin.", logMsg: logMsg, };

    try {
      var getParamsResponsePromise = getParams.GET_PARAMS(event, reqParams, returnResponse.logMsg);
      var getParamsResponse = await getParamsResponsePromise;

      if (getParamsResponse?.code === 200) {
        var selectQuery = " SELECT emp_login_id AS EMP_ID ,game_completion_time AS GAME_CMP_TIME,cheat_code_attempt as CHEAT_CODE_ATTEMPT,cheat_code_time AS CHEAT_CODE_TIME "
          + " from " + credentials.INTERNAL_USE_DUMMY_DB_NAME + ".find_jerry_users_played_info "
          + " where emp_login_id = ? and status = 'ACTIVE' ";
        var selectValues = [getParamsResponse.msg[0]];

        var mysqlResponsePromise = mysql.executeQuery(selectQuery, selectValues, credentials, getParamsResponse.logMsg);
        var mysqlResponse = await mysqlResponsePromise;
        if (mysqlResponse?.code === 200) {
          if (mysqlResponse.msg.length == 0) {
            var insertQuery = "INSERT INTO "
              + credentials.INTERNAL_USE_DUMMY_DB_NAME + ".find_jerry_users_played_info (emp_login_id,created_by) "
              + " VALUES (?,?)";
            var insertValues = [getParamsResponse.msg[0], getParamsResponse.msg[1]];
            var insertPlayerResponsePromise = mysql.executeQuery(insertQuery, insertValues, credentials, getParamsResponse?.logMsg);
            var insertPlayerResponse = await insertPlayerResponsePromise;
            if (insertPlayerResponse?.code == 200) {
              returnResponse = { code: 200, msg: { "EMP_ID": getParamsResponse.msg[0], "GAME_CMP_TIME": null, "CHEAT_CODE_ATTEMPT": 0, "CHEAT_CODE_TIME": null }, logMsg: insertPlayerResponse?.logMsg };
            } else {
              returnResponse = insertPlayerResponse;
            }
          } else {
            returnResponse = mysqlResponse;
          }
        } else {
          returnResponse = mysqlResponse;
        }
      } else {
        returnResponse = getParamsResponse;
      }
    } catch (e) {
      returnResponse.logMsg += " : 205 : " + "INSERT_EMP_ID_WHEN_GAME_STARTS - Error " + " : " + JSON.stringify(e) + "\n";
      console.log(e);
      returnResponse = { code: 205, msg: "Unknown error. Please Contact Admin.", logMsg: returnResponse.logMsg, };
    }
    return new Promise((resolve) => {
      resolve(returnResponse);
    });
  },
  UPDATE_GAME_COMPLETION_TIME: async function (event, credentials, logMsg) {
    // POSITIONS              0           1                               2
    var reqParams = ["emp_login_id", "game_completion_time_in_sec", "updated_by"];
    var returnResponse = { code: 201, msg: "Unknown exception. Please contact admin.", logMsg: logMsg, };

    try {
      var getParamsResponsePromise = getParams.GET_PARAMS(event, reqParams, returnResponse.logMsg);
      var getParamsResponse = await getParamsResponsePromise;
      if (getParamsResponse?.code === 200) {
        var updateQuery = " UPDATE "
          + credentials.INTERNAL_USE_DUMMY_DB_NAME + ".find_jerry_users_played_info "
          + " SET game_completion_time = ? , updated_by = ?, updated_on = now() "
          + " where emp_login_id = ? and status = 'ACTIVE' ";
        var UpdateQueryValues = [getParamsResponse.msg[1], getParamsResponse.msg[2], getParamsResponse.msg[0]];
        var mysqlResponsePromise = mysql.executeQuery(updateQuery, UpdateQueryValues, credentials, getParamsResponse?.logMsg);
        var mysqlResponse = await mysqlResponsePromise;
        if (mysqlResponse?.code === 200) {
          returnResponse = { code: 200, msg: "Player game completion time updated successfully.", logMsg: mysqlResponse?.logMsg };
        } else {
          returnResponse = mysqlResponse;
        }
      } else {
        returnResponse = getParamsResponse;
      }
    } catch (e) {
      returnResponse.logMsg += " : 205 : " + "UPDATE_GAME_COMPLETION_TIME - Error " + " : " + JSON.stringify(e) + "\n";
      console.log(e);
      returnResponse = { code: 205, msg: "Unknown error. Please Contact Admin.", logMsg: returnResponse.logMsg, };
    }
    return new Promise((resolve) => {
      resolve(returnResponse);
    });
  },
  UPDATE_CHEAT_CODE_ATTEMPT_AND_TIME: async function (event, credentials, logMsg) {
        // POSITIONS         0                    1                 2                     3
    var reqParams = ["emp_login_id", "cheat_code_attempt", "cheat_code_time", "updated_by"];
    var returnResponse = { code: 201, msg: "Unknown exception. Please contact admin.", logMsg: logMsg, };
    try{
  var getParamsResponsePromise = getParams.GET_PARAMS(event, reqParams, returnResponse.logMsg);
      var getParamsResponse = await getParamsResponsePromise;
       if (getParamsResponse?.code === 200) {
        var updateQuery = " UPDATE "
          + credentials.INTERNAL_USE_DUMMY_DB_NAME + ".find_jerry_users_played_info "
          + " SET cheat_code_attempt = ? , cheat_code_time = ? , updated_by = ?, updated_on = now() "
          + " where emp_login_id = ? and status = 'ACTIVE' ";
        var UpdateQueryValues = [getParamsResponse.msg[1], getParamsResponse.msg[2],getParamsResponse.msg[3], getParamsResponse.msg[0]];
        var mysqlResponsePromise = mysql.executeQuery(updateQuery, UpdateQueryValues, credentials, getParamsResponse?.logMsg);
        var mysqlResponse = await mysqlResponsePromise;
        if (mysqlResponse?.code === 200) {
          returnResponse = { code: 200, msg: "Player game completion time updated successfully.", logMsg: mysqlResponse?.logMsg };
        } else {
          returnResponse = mysqlResponse;
        }
      } else {
        returnResponse = getParamsResponse;
      }
    } catch (e) {
      returnResponse.logMsg += " : 205 : " + "UPDATE_CHEAT_CODE_ATTEMPT_AND_TIME - Error " + " : " + JSON.stringify(e) + "\n";
      console.log(e);
      returnResponse = { code: 205, msg: "Unknown error. Please Contact Admin.", logMsg: returnResponse.logMsg, };
    }
      return new Promise((resolve) => {
      resolve(returnResponse);
    });
  },
  GET_TOP_PLAYERS_FOR_LEADER_BOARD: async function (event, credentials, logMsg) {
    var returnResponse = { code: 201, msg: "Unknown exception. Please contact admin.", logMsg: logMsg, };
    try{
        var getQuery = " SELECT emp_login_id, game_completion_time FROM "
          + credentials.INTERNAL_USE_DUMMY_DB_NAME + ".find_jerry_users_played_info "
          + "WHERE status = 'Active' AND game_completion_time IS NOT NULL ORDER BY game_completion_time LIMIT 5";
        var mysqlResponsePromise = mysql.executeQuery(getQuery, [], credentials, returnResponse.logMsg);
        var mysqlResponse = await mysqlResponsePromise;
        if (mysqlResponse?.code === 200) {
          returnResponse = { code: 200, msg: mysqlResponse.msg, logMsg: mysqlResponse?.logMsg };
        } else {
          returnResponse = mysqlResponse;
        }
    } catch (e) {
      returnResponse.logMsg += " : 205 : " + "GET_TOP_PLAYERS_FOR_LEADER_BOARD - Error " + " : " + JSON.stringify(e) + "\n";
      console.log(e);
      returnResponse = { code: 205, msg: "Unknown error. Please Contact Admin.", logMsg: returnResponse.logMsg, };
    }
      return new Promise((resolve) => {
      resolve(returnResponse);
    });
  },
};
module.exports = methods;

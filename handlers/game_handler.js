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
        var selectQuery = " SELECT emp_login_id AS EMP_ID ,winning_time AS WIN_TIME "
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
              returnResponse = { code: 200, msg: {"EMP_ID": getParamsResponse.msg[0], "WIN_TIME": null}, logMsg: insertPlayerResponse?.logMsg };
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
};
module.exports = methods;

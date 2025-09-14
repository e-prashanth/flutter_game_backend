const getParams = require("../util/get_params");
const mysql = require("../util/run_mysql_script");

var methods = {
  SAMPLE_GET: async function (event, credentials, logMsg) {
    // POSITIONS
    var reqParams = [];
    var returnResponse = {
      code: 201,
      msg: "Unknown exception. Please contact admin.",
      logMsg: logMsg,
    };

    try {
      var getParamsResponsePromise = getParams.GET_PARAMS(
        event,
        reqParams,
        returnResponse.logMsg
      );
      var getParamsResponse = await getParamsResponsePromise;

      if (
        getParamsResponse &&
        getParamsResponse.code &&
        getParamsResponse.code === 200
      ) {
        var sqlQuery =
          "SELECT * FROM " +
          credentials.INTERNAL_USE_DUMMY_DB_NAME +
          ".users_prashanth";
        console.log(sqlQuery);

        var sqlValues = [
        ];

        console.log(sqlValues);

        var mysqlResponsePromise = mysql.executeQuery(
          sqlQuery,
          sqlValues,
          credentials,
          getParamsResponse.logMsg
        );
        var mysqlResponse = await mysqlResponsePromise;

        if (mysqlResponse && mysqlResponse.code && mysqlResponse.code === 200) {
          mysqlResponse.logMsg +=
            " : 200 : GET_USER_DETAILS - given successfully." +
            "\n";
          //   console.log(mysqlResponse);
          returnResponse = {
            code: 200,
            msg: mysqlResponse.msg || [],
            logMsg: mysqlResponse.logMsg,
          };
        } else {
          mysqlResponse.logMsg +=
            " : 201 : GET_USER_DETAILS - failed to get data." +
            "\n";

          returnResponse = {
            code: 201,
            msg: "Failed to retrieve data.",
            logMsg: mysqlResponse.logMsg,
          };
        }
      } else {
        console.log(getParamsResponse.msg[0]);
        returnResponse = getParamsResponse;
      }
    } catch (e) {
      returnResponse.logMsg +=
        " : 205 : " +
        "GET_USER_DETAILS - Error " +
        " : " +
        JSON.stringify(e) +
        "\n";

      console.log(returnResponse.logMsg);
      console.log(e);

      returnResponse = {
        code: 205,
        msg: "Unknown error. Please Contact Admin.",
        logMsg: returnResponse.logMsg,
      };
    }

    return new Promise((resolve) => {
      resolve(returnResponse);
    });
  },
};
module.exports = methods;

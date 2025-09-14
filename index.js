exports.handler = async function (event) {
  var logMsg = "";
  var responseData = {
    code: 221,
    msg: "Unknown Exception. Please contact admin",
  };

  logMsg += "\n" + "Started";

  try {
    var credentials = process.env;
    if (!(process && process.env)) {
      logMsg += "\n" + "Missing env variables" + "\n";
      throw new Error("Missing env variables");
    }
    var apiPath = "";
    var pathInfo = [];

    // if (event.path) {

    apiPath = event.path;
    pathInfo = apiPath.split("/");
    pathInfo.splice(0, 1);

    // } else if (event.rawPath) {
    //     apiPath = event.rawPath;
    //     pathInfo = apiPath.split("/");
    //     pathInfo.splice(0, 1);
    // }

    logMsg += "\n" + "api : " + apiPath + " - " + pathInfo + "\n";

    // if (pathInfo.length >= 2) {
    var handlerName = pathInfo[0];
    var taskName = pathInfo[1];

    // var canMakeApiCall = false;
    // if ((handlerName == 'un_auth') || isLocal) {
    //     canMakeApiCall = true;
    // } else {
    //     //logMsg += "\n" + currentDate.CURRENT_DATE() + " : " + "Event: " + JSON.stringify(event);
    //     var iTokenResp = await checkIToken(iToken, isLocal, currentDate, credentials, logMsg);
    //     logMsg = iTokenResp.logMsg;

    //     if (iTokenResp && iTokenResp.code && iTokenResp.code === 200 && iTokenResp.msg && iTokenResp.msg['cognito:groups'] && iTokenResp.msg['cognito:groups'][0] && iTokenResp.msg['cognito:username']) {
    //         // if (iTokenResp?.code === 200 && iTokenResp?.msg?.['cognito:groups']?.[0] && iTokenResp?.msg?.['cognito:username']) {
    //         userRole = iTokenResp.msg['cognito:groups'][0];
    //         const userName = iTokenResp.msg['cognito:username'];
    //         if (userName && event.queryStringParameters["os"] && event.queryStringParameters["deviceId"]) {
    //             var reqBody = {
    //                 username: userName,
    //                 os: event.queryStringParameters["os"],
    //                 device_id: event.queryStringParameters["deviceId"],
    //             };
    //             logMsg += "\n" + currentDate.CURRENT_DATE() + " : " + "CACHE check : " + JSON.stringify(reqBody);

    //             const accessCache = require('./util/access_cache');
    //             var cacheRespPromise = accessCache.VALIDATE_USER_OS_DEVICE("VALIDATE_USER_LOGIN_DEVICE", iToken, reqBody, credentials, logMsg);
    //             var cacheResp = await cacheRespPromise;
    //             logMsg = cacheResp.logMsg;
    //             //logMsg += "\n" + currentDate.CURRENT_DATE() + " : " + "CACHE RESP : " + JSON.stringify(cacheResp);
    //             if (cacheResp && cacheResp.code && cacheResp.code == 200) {
    //                 canMakeApiCall = true;
    //                 // logMsg += "\n" + currentDate.CURRENT_DATE() + " : CACHE VALID : " + JSON.stringify(cacheResp.msg);
    //             } else {
    //                 logMsg += "\n" + currentDate.CURRENT_DATE() + " : " + "Invalid device";
    //             }
    //         } else {
    //             logMsg += "\n" + currentDate.CURRENT_DATE() + " : " + "Missing data";
    //         }
    //     } else {
    //         logMsg += "\n" + currentDate.CURRENT_DATE() + " : " + "Session expired";
    //     }
    // }

    var handlerLocation = "./handlers/" + handlerName + "_handler";
    const myHandler = require(handlerLocation);
    var handlerResponsePromise = myHandler[taskName](
      event,
      credentials,
      logMsg
    );
    var handlerResponse = await handlerResponsePromise;
    handlerResponse.logMsg += "\n" + "Completed";
    logMsg = " " + handlerResponse.logMsg;
    delete handlerResponse["logMsg"];
    responseData = handlerResponse;
  } catch (ex) {
    console.log(ex);
    logMsg +=
      "\n" +
      "Exception : " +
      JSON.stringify(ex);
    responseData = {
      code: 221,
      msg: "Unknown Exception. Please contact admin : " + JSON.stringify(ex),
    };
  } finally {
    console.log(logMsg);
    return (response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseData),
    });
  }
};

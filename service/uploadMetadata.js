/**
 * @name : uploadMetadata.js
 * @description     :: Responsible for uploading course metdata to swift
 * @author          :: Prakash
 */
const request = require("request");
var storageUrl="";
var xAuth="";
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');

function swiftSendFile()
{
    console.log('------------------Inside swiftsendfile--------------------------------')
    var serverIp = "http://10.129.103.86:5000/";
    var requestUrl = "v3/auth/tokens"
    var requestParameter = {
        uri: serverIp + requestUrl,
        method: "POST",
        body : '\n{ "auth": {\n    "identity": {\n      "methods": ["password"],\n      "password": {\n        "user": {\n          "name": "telemet",\n          "domain": { "name": "default" },\n          "password": "telemet"\n        }\n      }\n    },\n    "scope": {\n      "project": {\n        "name": "datastore",\n        "domain": { "name": "default" }\n      }\n    }\n  }\n}'

    }

    request(requestParameter, function(error, response, body) {
        var resobj=JSON.parse(response.body)
        xAuth=response.headers['x-subject-token'];
        storageUrl=resobj.token.catalog[0].endpoints[2].url;
        storageUrl=storageUrl.replace("controller","10.129.103.86")
        sendFile()
    });
}

// generateSwiftAuth();


function sendFile()
{
    console.log('------------------------INSIDE SENDFILE----------------------------');
    file = fs.readFileSync(__dirname+'/Metadata.txt');
    var postheaders = {
        'x-auth-token' : xAuth,
        'Content-Type' : 'text/plain',
        'Content-Length' : Buffer.byteLength(file, null)
    };

    var options = {
        host: '10.129.103.86',
        port: 8080,
        path: '/v1/AUTH_5b2bcbcb10f347aaa4c7b0e370c2c055/content/Metadata.txt',
        method: 'PUT',
        headers : postheaders,
        encoding : null
    };


    var reqPost = http.request(options, function(response) {
        console.log("------------------------------statusCode: ", response.statusCode);
        // res.sendStatus(response.statusCode)
        response.on('data', function(d) {
            // console.info('POST result:\n');
            // process.stdout.write(d);
            // console.info('\n\nPOST completed')
            // res.send("OK DONE")
        });

    });

    console.log('Writing Data');
    reqPost.write(file,null);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });
}


module.exports.swiftSendFile = swiftSendFile

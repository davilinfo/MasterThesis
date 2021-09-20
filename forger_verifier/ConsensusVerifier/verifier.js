'use strict';

const { apiClient, codec } = require('lisk-elements');

var http = require('./node_modules/xmlhttprequest/lib/XMLHttpRequest');
var monitorServers = require('fs');
const { exit } = require('process');

var servers = [];
var betterConsensusServer = null;
var actualForger = null;
var timeInterval = 60000;
var timeToWait = 10000;
var minutesToForge = 1;

console.log('initiating');
initialization();

function initialization(){
    initiate().then(function(response){
        var config = JSON.parse(response);    
        if (config.hosts.length === 0){
            throw new Error("0 servers, at least 1 server should be specified");
        }

        if (config.minutesToForge === undefined || config.minutesToForge < minutesToForge ){
            console.error("minutesToForge property is a integer and must be higher than 0");
        }

        if (config.timeToWait === undefined || config.timeToWait < timeToWait ){
            console.error("timeToWait property is a integer represented in miliseconds and must be higher than 9999");
        }

        if (config.time === undefined || config.time < timeInterval ){
            console.error("time property is a integer represented in miliseconds and must be higher than 59999");
        }
        
        servers = config.hosts;
        betterConsensusServer = servers[0];
        actualForger = betterConsensusServer;        
        timeInterval = config.time;
        timeToWait = config.timeToWait;
        minutesToForge = config.minutesToForge;
        
        verifyConsensus();
    });
}

async function initiate(){
    let response = monitorServers.readFileSync("./monitor.json");
    monitorServers.closeSync(0);

    return response;
}
/* verify consensus and if necessary establish new server to forge */
function verifyConsensus(){
    var forgingIn = 0;    

    try{
        
        console.log("Get monitored servers: ");
        servers.forEach(server => {            
            apiClient.createWSClient("ws://".concat(server.host).concat(":").concat(server.port).concat("/ws")  )
            .then(async function(client){
                var nodeForgingStatus = await client.invoke('app:getForgingStatus', {});
                var nodeInfo = await client.invoke('app:getNodeInfo', {});         
                var forgers = await client.invoke('app:getForgers', {});       
                if (nodeForgingStatus !== undefined && nodeInfo !== undefined){
                    server.nodeHeight = nodeInfo.height;                    
                    server.online = true;
                    if (nodeForgingStatus[0].forging === true){
                        actualForger = server;
                        actualForger.forging = true;
                        actualForger.height = nodeForgingStatus[0].height;   
                        actualForger.maxHeightPrevoted  = nodeForgingStatus[0].maxHeightPrevoted;
                        actualForger.maxHeightPreviouslyForged  = nodeForgingStatus[0].maxHeightPreviouslyForged;
                        console.log("Actual forger: ", actualForger.host);
                        betterConsensusServer = actualForger;
                    }else{
                        updateMonitoredNodeWithNodeInformation(server, nodeForgingStatus);                        
                    }

                    console.log("node: ".concat(server.host))
                    console.log("   forging status:", JSON.stringify(nodeForgingStatus));
                    console.log("   blockchain last forging height ", server.height);
                    console.log("   blockchain node height ", nodeInfo.height);
                    console.log("   blockchain node last block id ", nodeInfo.lastBlockID);  
                }else{
                    server.online = false;
                    if (server.host === actualForger.host){
                        console.warn("actual Forger is offline");
                        //send request to halt actual forger                        
                    }
                }

                if (forgers !== undefined){                    
                    forgers.forEach(forger => {                    
                        if (forger.address === server.address){
                            let date = new Date(forger.nextForgingTime * 1000);
                            let currentDate = new Date(Date.now());
                            forgingIn = new Date(forger.nextForgingTime * 1000 - Date.now());
                            console.log("   nextForgingTime %d:%d:%d", date.getHours(), date.getMinutes(), date.getSeconds());                            
                            console.log("   currentTime %d:%d:%d", currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
                            console.log("   forging in %d:%d", forgingIn.getMinutes() < 10 ? "0" + forgingIn.getMinutes() : forgingIn.getMinutes(), forgingIn.getSeconds() < 10 ? "0" + forgingIn.getSeconds() : forgingIn.getSeconds());
                        }                    
                    });
                }
            });
        });
        var objTimeout = setTimeout(() => {
            servers.forEach(server=>{
                if (actualForger.forging === true){                                        
                    if (server.maxHeightPreviouslyForged !== actualForger.maxHeightPreviouslyForged){
                        console.log("updating ...");
                        updateServerForgerData(server, actualForger);
                    }
                }else{
                    console.log("Something is wrong. You must specify at least one forger node on monitor.json. The forger node must be the one with highest height");
                    exit();
                }
            });
        }, timeToWait);

        objTimeout.ref();
                                    
        var objTimeout = setTimeout(async () => {
            servers.forEach(server=>{                       
                if (server.maxHeightPreviouslyForged === actualForger.maxHeightPreviouslyForged){         
                    if (server.nodeHeight > betterConsensusServer.nodeHeight){
                        betterConsensusServer = server;
                    }
                }
            });            

            betterConsensusServer = servers[0];

            console.log("Better server:".concat(betterConsensusServer.host));
            await updateServerProperties(forgingIn);
        }, timeToWait);

      objTimeout.ref();

    }catch(e){
      verifyConsensus();
    }    
}
/* update monitored node with node local information */
function updateMonitoredNodeWithNodeInformation(server, nodeForgingStatus){    
    server.height = nodeForgingStatus[0].height || server.height;
    server.maxHeightPrevoted = nodeForgingStatus[0].maxHeightPrevoted || server.maxHeightPrevoted;
    server.maxHeightPreviouslyForged = nodeForgingStatus[0].maxHeightPreviouslyForged || server.maxHeightPreviouslyForged;    
}
/* update monitored node based on most updated forger data */
function updateServerForgerData(server, actualForger){    
    //export funcionality
    exportForgerDb(actualForger);

    //include wget && import funcionality && restart node    
    if (server.height === actualForger.height 
        && server.maxHeightPrevoted === actualForger.maxHeightPrevoted 
        && server.maxHeightPreviouslyForged === actualForger.maxHeightPreviouslyForged){
            console.log("Data already updated on ", server.host);
        }else{
            
            importForgerDb(server, actualForger);
            server.height = actualForger.height;
            server.maxHeightPrevoted = actualForger.maxHeightPrevoted;
            server.maxHeightPreviouslyForged = actualForger.maxHeightPreviouslyForged;
            console.log("Updated server forger info", server.host, server.height, server.maxHeightPrevoted, server.maxHeightPreviouslyForged);        
        }    
}

/* request on monitored node and actual forger to update forger data*/
function exportForgerDb(server){
    console.warn("exporting forger data");
    var forgingRequest = new http.XMLHttpRequest();
    var url = "http://".concat(server.host).concat(":").concat(server.gatewayPort).concat("/api/export");

    forgingRequest.onload = function(){
        console.log("Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))));
        if (forgingRequest.status === 200){
            console.log("export on Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))).concat(" completed"));
        }
    }

    forgingRequest.handleError = function(e){
        console.log("error export on Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))).concat(" didn't answer or was in error"));
        return;        
    }

    forgingRequest.open("POST", url);
    forgingRequest.setRequestHeader("Cache-Control", "no-cache");
    forgingRequest.setRequestHeader("Content-Type", "application/json");
    forgingRequest.setRequestHeader("server-host", JSON.stringify(server.host));
    forgingRequest.send(JSON.stringify(server));
}

/* request on monitored node forger lisk api to import most recent forger data*/
function importForgerDb(server, actualServerForging){
    console.warn("importing forger data");
    var forgingRequest = new http.XMLHttpRequest();
    var url = "http://".concat(server.host).concat(":").concat(server.gatewayPort).concat("/api/import");

    forgingRequest.onload = function(){
        console.log("Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))));
        if (forgingRequest.status === 200){
            console.log("import on Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))).concat(" completed"));
        }
    }

    forgingRequest.handleError = function(e){
        console.log("error import on Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))).concat(" didn't answer or was in error"));
        return;        
    }

    forgingRequest.open("POST", url);
    forgingRequest.setRequestHeader("Cache-Control", "no-cache");
    forgingRequest.setRequestHeader("Content-Type", "application/json");
    forgingRequest.setRequestHeader("server-host", JSON.stringify(server.host));
    forgingRequest.send(JSON.stringify(actualServerForging));
}

/* udapte forging information */
async function updateServerProperties(forgingIn){
    //only update forging information if at least 3 minutes to forge
    if (forgingIn.getMinutes() >= 3){
        console.log("Update server properties: ");
        if (betterConsensusServer.host !== actualForger.host){
            var result = await disableForgingActualForger();
            var objTimeout = setTimeout(() => {
                if (result.forging === false){
                    servers.forEach(serveraux =>{                        
                        serveraux.forging = false;
                        if (serveraux.online === true){
                            if (betterConsensusServer.host === serveraux.host){
                                serveraux.forging = true;
                            }            
                            setForging(serveraux);
                        }else{
                            console.log("Server ".concat(serveraux.host).concat(" not accessible"));
                        }
                    });
                }    
            }, timeToWait);
            objTimeout.ref();
        }else{
            console.log("Server still forging ", betterConsensusServer);
            betterConsensusServer.forging = true;
            setForging(betterConsensusServer);
        } 
    }else{
        console.log("Less than 3 minutes to forge, forgers information will not be updated");
    }       

    var interval = setInterval(function (){
        clearInterval(interval);

        servers.forEach(serveraux =>{
            serveraux.online = false;            
            serveraux.forging = false;
        });

        betterConsensusServer = servers[0];        
        verifyConsensus();
    
    }, timeInterval);
}
/* disable forging on actual forger */
async function disableForgingActualForger(){    
    
    console.log("disabling server forger ", actualForger.host);

    setForging({   
        host: actualForger.host,
        address: actualForger.address,  
        port: '8080',       
        forging: false,
        height: actualForger.height,
        maxHeightPrevoted: actualForger.maxHeightPrevoted,
        maxHeightPreviouslyForged: actualForger.maxHeightPreviouslyForged,
        override: true,
        gatewayPort: actualForger.gatewayPort
    });    

    await apiClient.createWSClient("ws://".concat(actualForger.host).concat(":").concat(actualForger.port).concat("/ws")  )
        .then(async function(client){
            var nodeForgingStatus = await client.invoke('app:getForgingStatus', {});

            actualForger.forging = nodeForgingStatus !== undefined ? nodeForgingStatus[0].forging : actualForger.forging;

            console.log("disabled actual server forging completed, forging status: ", actualForger.forging);
        });        
    return actualForger;
}
/* request forger lisk to update forging status on server */
function setForging(server){                          
    console.log("set forging: ", server);    

    var forgingRequest = new http.XMLHttpRequest();
    var url = "http://".concat(server.host).concat(":").concat(server.gatewayPort).concat("/api/forging");

    forgingRequest.onload = function(){
        console.log("Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))));
        if (forgingRequest.status === 200 || forgingRequest.status === 400){
            console.log("set forging on Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))).concat(" completed"));
            console.log(JSON.parse(forgingRequest.responseText));            
        }
    }

    forgingRequest.handleError = function(e){
        console.log("error set forging on Host: ".concat(JSON.parse(forgingRequest.getRequestHeader("server-host"))).concat(" didn't answer or was in error"));
        return;        
    }

    forgingRequest.open("POST", url);
    forgingRequest.setRequestHeader("Cache-Control", "no-cache");
    forgingRequest.setRequestHeader("Content-Type", "application/json");
    forgingRequest.setRequestHeader("server-host", JSON.stringify(server.host));
    forgingRequest.send(JSON.stringify(server));

}
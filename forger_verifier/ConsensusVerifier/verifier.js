'use strict';

//only can be utilized fetch v2. Do not utilize fetch v3
const fetch = require('node-fetch').default;
const { apiClient, codec } = require ('lisk-elements');
const {exit} = require ('process');
const fs = require('fs');

var servers = [];
var betterConsensusServer = null;
var actualForger = null;
var timeInterval = 60000;
var timeToWait = 10000;
var minutesToForge = 1; 
var monitoringBlock = false;

start().then(function(){
    console.log('initiating');
});

async function initiate(){
    let response = fs.readFileSync("./monitor.json");
    fs.closeSync(0);

    return response;
}

async function start(){    
    var response = await initiate();
    
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
        
    verifyConsensus().then(function(){
        console.log("starting to verify nodes");
    });

}

/* verify consensus and if necessary establish new server to forge */
async function verifyConsensus(){
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
                    await updateMonitoredNodeWithNodeInformation(server, nodeForgingStatus);
                    
                    if (nodeForgingStatus[0].forging === true){
                        actualForger = server;
                        actualForger.forging = true;
                        actualForger.height = nodeForgingStatus[0].height;   
                        actualForger.maxHeightPrevoted  = nodeForgingStatus[0].maxHeightPrevoted;
                        actualForger.maxHeightPreviouslyForged  = nodeForgingStatus[0].maxHeightPreviouslyForged;
                        console.log("Actual forger: ", actualForger.host);
                        betterConsensusServer = actualForger;
                    }

                    console.log("node: ", server.host);
                    console.log("   forging status:", JSON.stringify(nodeForgingStatus));                    
                    console.log("   blockchain node height: ", nodeInfo.height, ", blockchain node last block id:", nodeInfo.lastBlockID);                    
                }else{
                    server.online = false;                    
                    if (server.host === actualForger.host){
                        console.log("Actual Forger seems to be offline:", actualForger.host);
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
            }).catch(function(){
                console.warn("server seems to be offline:", server.host);
            });
        });      

        var objTimeout = setTimeout( () => {
            servers.forEach(async server=>{                       
                if (server.maxHeightPreviouslyForged !== actualForger.maxHeightPreviouslyForged){
                    console.log("updating server with forger values...");
                    await updateServerForgerData(server, actualForger);
                }
            });                        
        }, timeToWait/2);
                                                    
        var objTimeout = setTimeout(async () => {
            servers.forEach(server=>{                       
                if (server.maxHeightPreviouslyForged === actualForger.maxHeightPreviouslyForged){         
                    if (server.height >= betterConsensusServer.height 
                        && server.nodeHeight >= betterConsensusServer.nodeHeight 
                        && (betterConsensusServer.online === false || server.consecutiveMissedBlocks < betterConsensusServer.consecutiveMissedBlocks)){
                            betterConsensusServer = server;
                    }
                }
            });                        

            console.log("Better server:".concat(betterConsensusServer.host));
            await updateServerProperties(forgingIn);
        }, timeToWait);

    objTimeout.ref();

    }catch(e){
        console.warn("something wrong while verifying nodes attempting again soon...");
        
        var interval = setInterval(async function (){
            clearInterval(interval);
            await verifyConsensus();
        }, timeInterval);
    }    
}

/* initiates event that retrieves new block information and verifies if actual forger forged or missed a block*/ 
async function monitorNewBlockFromActualForger(server){
                        
    monitoringBlock = true;
    
    apiClient.createWSClient("ws://".concat(server.host).concat(":").concat(server.port).concat("/ws"))
    .then(async function(client){             
        
        var forgers = await client.invoke('app:getForgers', {});            
        forgers.forEach(forger => {
            if (forger.address === server.address){
                var interval = setInterval(function(){
                    var forgingIn = new Date(forger.nextForgingTime * 1000 - Date.now());
                    console.log("Forging in:", forgingIn.getMinutes() * 60 + forgingIn.getSeconds(), "s");
                    if (forgingIn.getMinutes() * 60 + forgingIn.getSeconds() <= 5){
                        
                        clearInterval(interval);
                        client.subscribe('app:block:new', async ( block ) => {     
                            console.log("Start monitoring new block arrival from actual forger"); 
                            const schema = await client.invoke('app:getSchema'); 
                            await client.disconnect();                
                            block.accounts.forEach(account => {                    
                                var accountDecoded = codec.codec.decodeJSON(schema.account, Buffer.from(account, 'hex'));
                                                                                                                
                                if (accountDecoded.address === server.address){
                                    console.log("Forged a block.");                        
                                    server.consecutiveMissedBlocks = 0;                        
                                }else{
                                    console.log("Missed a block.");                        
                                    server.consecutiveMissedBlocks += 1;
                                }
                            });                    
                        }); 
                    }
                }, 1000);                    
            }
        })                                     
                            
    }).catch(function(error){            
        console.warn("error to establish connection on node", error);
    }).finally(function(){
        monitoringBlock = false;
    });    

}

/* update monitored node with node local information */
async function updateMonitoredNodeWithNodeInformation(server, nodeForgingStatus){    
    server.height = nodeForgingStatus[0].height || server.height;
    server.maxHeightPrevoted = nodeForgingStatus[0].maxHeightPrevoted || server.maxHeightPrevoted;
    server.maxHeightPreviouslyForged = nodeForgingStatus[0].maxHeightPreviouslyForged || server.maxHeightPreviouslyForged;    
}
/* update monitored node based on most updated forger data */
async function updateServerForgerData(server, actualForger){    
    //export funcionality
    const result = await exportForgerDb(actualForger);

    //include wget && import funcionality && restart node    
    if (server.height === actualForger.height 
    && server.maxHeightPrevoted === actualForger.maxHeightPrevoted 
    && server.maxHeightPreviouslyForged === actualForger.maxHeightPreviouslyForged){
        console.log("Data already updated on ", server.host);
    }else{
        if (result === true){
            var resultImport = await importForgerDb(server, actualForger);

            if (resultImport === true){
                server.height = actualForger.height;
                server.maxHeightPrevoted = actualForger.maxHeightPrevoted;
                server.maxHeightPreviouslyForged = actualForger.maxHeightPreviouslyForged;
                console.log("Updated server forger info:", server.host, server.height, server.maxHeightPrevoted, server.maxHeightPreviouslyForged);
            }
        }
    }    
}

/* udapte forging information */
async function updateServerProperties(forgingIn){
    try{
        //only update forging information if at least 3 minutes to forge
        if (forgingIn.getMinutes() >= 3){            
            console.log("Update server properties: ");
            if (betterConsensusServer.host !== actualForger.host){
                var result = await disableForgingInActualForger();
                
                if (result.forging === false){
                    
                    servers.forEach(async (serveraux) =>{
                        if (serveraux.online === true){
                            if (betterConsensusServer.host === serveraux.host){
                                serveraux.forging = true;
                            }else{
                                serveraux.forging = false;
                            }
                            await setForging(serveraux);
                        }else{
                            console.log("Server: ". serveraux.host, " not accessible");
                            serveraux.forging = false;
                            await setForging(serveraux);
                        }                    
                    });
                }
            }else{
                servers.forEach(async (serveraux) =>{
                    if (serveraux.online === true){
                        if (betterConsensusServer.host === serveraux.host){
                            serveraux.forging = true;
                        }else{
                            serveraux.forging = false;
                        }
                        await setForging(serveraux);
                    }else{
                        console.log("Server: ", serveraux.host, " not accessible");
                        serveraux.forging = false;
                        await setForging(serveraux);
                    }                    
                });
            } 
        }else{
            console.log("Less than 3 minutes to forge, forgers information will not be updated"); 
            if (monitoringBlock == false){           
                monitorNewBlockFromActualForger(betterConsensusServer);
            }
        }   
    }catch(e){
        console.warn("Error ocurred while updating server properties, attempting to continue...", e);
    }finally{
        var interval = setInterval(function (){
        clearInterval(interval);

        servers.forEach(serveraux =>{
            serveraux.online = false;            
            serveraux.forging = false;
        });

        betterConsensusServer = servers[0];        
        
        verifyConsensus().then(function(){
            console.log("starting to verify nodes");
        }).catch(async function(){
            console.warn("something wrong while verifying nodes attempting again soon...");
            await verifyConsensus();                     
        });
        
        }, timeInterval);
    }    
}
/* disable forging on actual forger */
async function disableForgingInActualForger(){    
    
    console.log("disabling server forger ", actualForger.host);

    var response = await setForging({   
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
    
    actualForger.forging = response.forging;
            
    return actualForger;
}

/* request on monitored node and actual forger to update forger data*/
async function exportForgerDb(server){
    console.log("exporting forger data");
    var exportCompleted = false;
    var url = "http://".concat(server.host).concat(":").concat(server.gatewayPort).concat("/api/export");

    var response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(server)
    });

    console.log("Host: ", server);
    if (response.ok === true){
        console.log("export on Host: ", server.host, " completed");
        exportCompleted = true;
    }else{
        console.log("error to export on Host: ", server.host);
        exportCompleted = false
    }    

    return exportCompleted;
}

/* request on monitored node forger lisk api to import most recent forger data*/
async function importForgerDb(server, actualServerForging){
    console.log("importing forger data");
    
    var url = "http://".concat(server.host).concat(":").concat(server.gatewayPort).concat("/api/import");

    var response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(actualServerForging)
    });

    console.log("Host: ", server.host);
    if (response.ok === true){
        console.log("import on Host: ", server.host, "completed");
    }else{
        console.log("error to import on Host: ", server.host, " didn't answer or was in error");
    }       
    
    return response.ok;
}

/* request forger lisk to update forging status on server */
async function setForging(server){                          
    console.log("set forging: ", server);    
    
    var url = "http://".concat(server.host).concat(":").concat(server.gatewayPort).concat("/api/forging");

    var response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(server)
    });

    var result = await response.json();
    if (response.ok === true){        
        console.log("set forging on Host: ", server.host, " completed");
        console.log(result);
    }else{
        if (response.status === 400){
            console.log("set forging on Host: ", server.host, " completed with status 400");
            console.log(result);
        }else{
            console.log("error set forging on Host: ", server.host, " didn't answer or was in error");
        }
    }        
    
    return result;
}    



'use strict';

//only can be utilized fetch v2. Do not utilize fetch v3
const fetch = require('node-fetch').default;
const { apiClient, codec } = require ('lisk-elements');
const {exit} = require ('process');
const fs = require('fs');

var servers = [];
var lastForgerInfo = {};
var betterConsensusServer = null;
var actualForger = null;
var timeInterval = 60000;
var timeToWait = 10000;
var minutesToForge = 1; 
var inMonitor = null;

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
    timeInterval = config.time;
    timeToWait = config.timeToWait;
    minutesToForge = config.minutesToForge;
    inMonitor = 0;

    servers.forEach(server=>{
        if (server.forging === true){            
            lastForgerInfo.height = server.height;
            lastForgerInfo.maxHeightPreviouslyForged = server.maxHeightPreviouslyForged;
            lastForgerInfo.maxHeightPrevoted = server.maxHeightPrevoted;
        }
    });
        
    verifyConsensus().then(function(){
        console.log("starting to verify nodes");
    });

}

/* verify consensus and if necessary establish new server to forge */
async function verifyConsensus(){
    var forgingIn = 0;
    betterConsensusServer = null;
    actualForger = null;
    try{
        
        console.log("Get monitored servers: ");
        var objTimeout = setTimeout( () => {
            servers.forEach(server => {            
                apiClient.createWSClient("ws://".concat(server.host).concat(":").concat(server.port).concat("/ws")  )
                .then(async function(client){     
                                        
                    client.invoke('app:getForgingStatus', {}).then(function(response){
                        if (response !== undefined && response !== undefined){
                            server.online=true;
                            updateMonitoredNodeWithNodeInformation(server, response);
                            console.log("   forging status:", JSON.stringify(response)); 
    
                            client.invoke('app:getNodeInfo', {}).then(function(responseNode){
                                console.log("node: ", server.host);
                                server.nodeHeight = responseNode.height;                                                   
                                console.log("   blockchain node height: ", responseNode.height, ", blockchain node last block id:", responseNode.lastBlockID);
    
                            }).catch(function(responseNodeError){
                                server.online=false;
                                server.nodeHeight = 0;
                                console.log("Error while retrieving node information on:", server.host, responseNodeError);
                            });
    
                            if (server.forging === true){
                                updateActualForgerInformation(server);                                 
                                console.log("Actual forger: ", actualForger.host);
                                betterConsensusServer = actualForger;
                            }
                            
                            client.invoke('app:getForgers', {}).then(function(responseForgers){
                                if (responseForgers !== undefined){                                
                                    responseForgers.forEach(forger => {
                                        if (forger.address === server.address){                    
                                            forgingIn = updateForgingInTimeInformation(forger, server);
                                        }
                                    });
                                }
                            }).catch(function(errorResponseForgers){
                                server.online=false;
                                console.log("Error while retrieving forgers on:", server.host, errorResponseForgers);
                            });                        
                        }else{
                            server.online=false;
                        }
                    }).catch(function(responseError){
                        server.online=false;
                        console.log("Error while retrieving forgingStatus on:", server.host, responseError);
                    });
                                    
                }).catch(function(){
                    server.online=false;
                    console.info("server seems to be offline:", server.host);
                });
            });
        }, timeToWait/5);

        objTimeout.ref();
                            
        var objTimeout = setTimeout( () => {
            var anyServerForging = false;               
            servers.forEach(server => {
                if (server.forging === true){
                    anyServerForging = true;
                }
            });
            
            if (anyServerForging === false){
                actualForger = null;
                servers.forEach(server => {
                    if (server.online === true && server.height!==undefined){
                        actualForger = actualForger !== null && actualForger.height > server.height ? actualForger : server;
                        betterConsensusServer = actualForger;
                    }
                });
            }                                    
        }, timeToWait/2);

        objTimeout.ref();
                                                    
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
            
            if (forgingIn != undefined){
                await updateServerProperties(forgingIn);
            }else{
                console.log("It is necessary to retrieve forgingIn value again. Attempting soon ...")
            }
        }, timeToWait);

        objTimeout.ref();

    }catch(e){
        console.log("something wrong while verifying nodes attempting again soon...", e);
        
        var interval = setInterval(async function (){
            clearInterval(interval);
            await verifyConsensus();
        }, timeInterval);
    }    
}

function updateActualForgerInformation(server){
    actualForger = server;
    actualForger.forging = true;
    actualForger.height = server.height;   
    actualForger.maxHeightPrevoted  = server.maxHeightPrevoted;
    actualForger.maxHeightPreviouslyForged  = server.maxHeightPreviouslyForged;

    lastForgerInfo.height = actualForger.height;
    lastForgerInfo.maxHeightPrevoted = actualForger.maxHeightPrevoted;
    lastForgerInfo.maxHeightPreviouslyForged = actualForger.maxHeightPreviouslyForged;
}

function updateForgingInTimeInformation(forger, server){    
    let date = new Date(forger.nextForgingTime * 1000);
    let currentDate = new Date(Date.now());
    var forgingIn = new Date(forger.nextForgingTime * 1000 - Date.now());
    console.log("   nextForgingTime %d:%d:%d", date.getHours(), date.getMinutes(), date.getSeconds());                            
    console.log("   currentTime %d:%d:%d", currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    console.log("   forging in %d:%d", forgingIn.getMinutes() < 10 ? "0" + forgingIn.getMinutes() : forgingIn.getMinutes(), forgingIn.getSeconds() < 10 ? "0" + forgingIn.getSeconds() : forgingIn.getSeconds());    

    return forgingIn;
}

/* initiates event that retrieves new block information and verifies if actual forger forged or missed a block*/ 
async function monitorNewBlockFromActualForger(server){
                        
    console.log("monitorNewBlockFromActualForger", inMonitor);    
            
    apiClient.createWSClient("ws://".concat(server.host).concat(":").concat(server.port).concat("/ws"))
    .then(async function(client){             
        
        var forgers = await client.invoke('app:getForgers', {});  
        if (forgers != undefined){          
            forgers.forEach(forger => {
                if (forger.address === server.address){
                    var interval = setInterval(function(){                        
                        var forgingIn = new Date(forger.nextForgingTime * 1000 - Date.now());
                        console.log("Forging in:", forgingIn.getMinutes() * 60 + forgingIn.getSeconds(), "s");
                        if (forgingIn.getMinutes() * 60 + forgingIn.getSeconds() <= 5){
                            clearInterval(interval);                            
                            console.log("preparing to monitor new block");
                            client.subscribe('app:block:new', async ( block ) => {     
                                console.log("Start monitoring new block arrival from actual forger"); 
                                const schemas = client.schemas;
                                var blockBuf = codec.codec.decodeJSON(schemas.block, Buffer.from(block.block, 'hex'));
                                console.log(blockBuf);
                                var header = codec.codec.decodeJSON(schemas.blockHeader, Buffer.from(blockBuf.header, 'hex'));
                                console.log(header);
                                var newBlock = await client.block.getByHeight(header.height);
                                    
                                await client.disconnect();                
                                block.accounts.forEach(account => {                    
                                    var accountDecoded = codec.codec.decodeJSON(schemas.account, Buffer.from(account, 'hex'));
                                        
                                    if (accountDecoded.address === server.address){                                        
                                        console.log("Forged a block.");                                        
                                        console.log("block,", newBlock);
                                        server.consecutiveMissedBlocks = 0;
                                        
                                        lastForgerInfo.height = newBlock.header.height;
                                        lastForgerInfo.maxHeightPreviouslyForged = newBlock.header.asset.maxHeightPreviouslyForged;
                                        lastForgerInfo.maxHeightPrevoted = newBlock.header.asset.maxHeightPrevoted;                                    
                                        console.log("lastForgerInfo", lastForgerInfo);
                                        servers.forEach(auxServer =>{
                                            if (auxServer.host !==server.host){
                                                auxServer.height = lastForgerInfo.height;
                                                auxServer.maxHeightPreviouslyForged = lastForgerInfo.maxHeightPreviouslyForged;
                                                auxServer.maxHeightPrevoted = lastForgerInfo.maxHeightPrevoted;
                                                auxServer.forging = false;                                                
                                            }
                                        });                                        
                                        return;                        
                                    }else{                                                                
                                        server.consecutiveMissedBlocks += 1;
                                    }                                    
                                });                    
                            });
                            console.log("concluding forger monitor");
                            inMonitor = 0;
                        }else if (forgingIn.getMinutes() * 60 + forgingIn.getSeconds() > 180){
                            clearInterval(interval);
                            console.log("concluding forger monitor");
                            inMonitor = 0;
                        }
                    }, 1000);                                                             
                }
            });
        }else{
            console.log("concluding forger monitor");
            inMonitor = 0;
        }
                            
    }).catch(function(error){            
        console.warn("error to establish connection on node", error);
    });    
    
}

/* update monitored node with node local information */
function updateMonitoredNodeWithNodeInformation(server, nodeForgingStatus){
    server.forging = nodeForgingStatus[0].forging;             
    if (lastForgerInfo.height < nodeForgingStatus[0].height){
        server.height = nodeForgingStatus[0].height;
        server.maxHeightPrevoted = nodeForgingStatus[0].maxHeightPrevoted;
        server.maxHeightPreviouslyForged = nodeForgingStatus[0].maxHeightPreviouslyForged;
    }else{
        server.height = lastForgerInfo.height;
        server.maxHeightPrevoted = lastForgerInfo.maxHeightPrevoted;
        server.maxHeightPreviouslyForged = lastForgerInfo.maxHeightPreviouslyForged;
    }
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
        console.log("monitoring", inMonitor);
        
        //only update forging information if at least 3 minutes to forge
        if (forgingIn.getMinutes() >= 3){            
            console.log("Update server properties: ");
            inMonitor = 0;
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
            if (inMonitor === 0 && forgingIn.getMinutes() > 0){    
                inMonitor += 1;       
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



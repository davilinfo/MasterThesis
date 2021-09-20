'use strict';

const
    express = require('express'),
    bodyParser = require('body-parser'),
    log = require('npmlog'),  
    http = require('xmlhttprequest'),
    fileStream = require('fs'),
    { exec } = require('child_process'),
    { apiClient, codec } = require('lisk-elements');

var app = express();
var port = 10001;
var invalidDelegate = "invalid delegate info";

initiate().then(function(response){
    var accountInfo = JSON.parse(response)[0];
        if (accountInfo !== null){
            log.info('initiating forger lisk');

            app.use(bodyParser.json());

            app.post('/api/import', function(req, res){
                res.setHeader('Access-Control-Allow-Origin', '*');
                log.info('API', '/api/import');

                var result = importForgerDb(req.body);
                res.status(200).json({ result: result});
            });

            app.post('/api/export', function(req, res){
                res.setHeader('Access-Control-Allow-Origin', '*');
                log.info('API', '/api/export');
                //export forgerdb data

                var result = exportForgerDb();
                res.status(200).json({ result: result});
            });

            app.post('/api/forging/', function(req, res){
                res.setHeader('Access-Control-Allow-Origin', '*');
                log.info('API', '/api/forging');

                //set forging status true or false with updated data
                res.status(200).json({ result: setForging(req.body, accountInfo) });                
            });

            app.listen(port, function(){
                log.info("forger lisk api service running");
            });
        }
});

async function initiate(){
    var response = fileStream.readFileSync('./account.json');
    log.info('delegate account information loaded');
    fileStream.closeSync(0);
    
    return response;
}

/*responsible to download, import forger.db data and restart node*/
function importForgerDb(server){
    try{        
        log.info("starting to download forger.db");
        
        const importDb = exec('wget http://'.concat(server.host).concat(":").concat('10000').concat('/forger.db.tar.gz -N'), function (error, stdout, stderr) {
            if (error) {
              console.log(error.stack);
              console.log('Error code: '+error.code);
              console.log('Signal received: '+error.signal);
              return false;
            }            

            log.info("forger.db downloaded".concat(" result:").concat(stdout));

            log.info("starting to import forger.db");

            var importResult = exec('lisk-core forger-info:import forger.db.tar.gz --force', function(importerror, importstdout, stderr){
                if (importerror){
                    console.log(importerror.stack);
                    console.log('Error code: '+importerror.code);
                    console.log('Signal received: '+importerror.signal);
                }
                log.info("forger.db imported".concat(" result:").concat(importstdout));

                var restart = exec('pm2 restart lisk-core', function(restarterror, restartstdout, restarterr){
                    if (!restarterror){
                        log.info("lisk-core restarted".concat(restartstdout));
                        return true;
                    }
                });                                
            });
            return false;            
          });                        
          return importDb;
    }catch (e){
        log.error(e);
        return false;
    }
}
/*responsible to update forger.db data for exportation*/
function exportForgerDb(){
    try{
        var exportResult = exec('lisk-core forger-info:export -o /home/lisk', function(err, stdout, stderr){

            if (!err){
                log.info("forger.db exported".concat(" result:").concat(stdout));
                return true;
            }else{
                console.log(err.stack);
                console.log('Error code: '+err.code);
            }
            return false;
        });
        return exportResult;
    }catch(e){
        log.error(e);
        return false;
    }
}

/*responsible to set new forging status*/
function setForging(server, accountInfo){
    
    if (accountInfo.address !== server.address){
        log.info("Different account");

        log.warn(invalidDelegate);
        
        return JSON.parse( { "message": invalidDelegate} );
    }

    /*adicionar lógica para atualizar status de forjamento*/
    console.log("set forging: ", server);

    apiClient.createWSClient("ws://localhost".concat(":").concat(server.port).concat("/ws")  )
    .then(async function(client){        
        
        client.invoke('app:updateForgingStatus', 
            {   address: server.address, 
                password: accountInfo.password, 
                forging: server.forging,
                height: server.height,
                maxHeightPrevoted: server.maxHeightPrevoted,
                maxHeightPreviouslyForged: server.maxHeightPreviouslyForged,
                override: true
            }).then(function (data){
                console.log("Server ", server.host, data);
                return data;
            });        
    }).catch(async function(error){
        console.log("Server ", server.host, error.message);        
        return false;
    });        
}

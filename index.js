import express from 'express';
import http from 'http';
import {WebSocketServer} from 'ws';

import {state} from "./model/state.js";
const app =express();

app.get("/", (req, res)=>{
res.json({message: "Server is working"});

});



const server= http.createServer(app);

const wss= new WebSocketServer({server: server});
wss.on("connection", (ws)=>{

    ws.on("message", (message)=> {
        console.log(`Received message => ${message}`);

        try{
            const data=JSON.parse(message);
            if (data.message === "fetch")
            {
                const ledState= state[0];
                ws.send(JSON.stringify(ledState));
            }
            else if(data.message ==="update")
            {
                state[0]={
                    name: "Led",
                    state: data.state
                };
            

            wss.clients.forEach(
                (client)=>{

                    client.send(
                        JSON.stringify(
                            state[0]
                        )
                    )
                }
            );
        }
            else{
                ws.send(
                    JSON.stringify(
                        {error: "Command not found"}
                    )
                )
            }
    
        }
        catch(error)
        {
            console.log(error.message);
            ws.send(JSON.stringify
                (
                    {
                        message: error.message
                    }

                )
            );
        };
        
        ws.send(`Server Received message => ${message}`)
    });
});


server.listen(443, ()=>
{
    console.log("Server is Running on port 443");
});

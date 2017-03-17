from tornado import web,ioloop,websocket
import os
import json
clients=[]
# onlineClientsNames=[]
class ChatHandler(web.RequestHandler):
    def get(self):
        self.render("chat.html")
class WSHandler(websocket.WebSocketHandler):
    def open(self):
        self.name="Anonymous"
        clients.append(self)
        # onlineClients.append(self.name)
        online=[]
        for client in clients:
            online.append(client.name)


        onlinedict={}
        onlinedict["code"]=2
        onlinedict["list"]=online

        for client in clients:
            # if client is not self:
            client.write_message(json.dumps(onlinedict))

    def on_message(self,message):
        receivedMessage=[]
        receivedMessage=message.split("/")
        code=receivedMessage[0]
        if code == "0":
            for client in clients:
                if client is self:
                    # print(receivedMessage[1])
                    client.name=receivedMessage[1]
            online=[]
            for client in clients:
                online.append(client.name)


            onlinedict={}
            onlinedict["code"]=2
            onlinedict["list"]=online

            for client in clients:
                # if client is not self:

                client.write_message(json.dumps(onlinedict))
        if code == "1":
            for client in clients:
                client.write_message(json.dumps(self.name+": "+receivedMessage[1]))
        if code == "2":
            targetPerson=receivedMessage[2]
            for client in clients:
                if client.name==targetPerson:
                    client.write_message(json.dumps("PrivateMessage: "+self.name+": "+receivedMessage[1]))

    def on_close(self):
        clients.remove(self)
        # onlineClients.remove(self.name)

app=web.Application([(r"/",ChatHandler),(r"/ws",WSHandler)]
,static_path='static',debug=True)

app.listen(7500)
ioloop.IOLoop.current().start()

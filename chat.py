from tornado import web,ioloop,websocket
import os
import json
from database import Database


dbh = Database()

class ChatHandler(web.RequestHandler):
    def get(self):
        self.render("login.html")
class WSHandler(websocket.WebSocketHandler):
    message={}
    onlineUsers=[]
    def open(self):

        pass
    def on_message(self,message):
        receivedMessage=json.loads(message)
        code=receivedMessage['type']
        #login process
        if code == "login":
            userName=receivedMessage['userName']
            password=receivedMessage['password']
            result = dbh.loginUser(userName,password)
            #check for result of login
            if result:
                self.userName=userName
                WSHandler.onlineUsers.append(self)
                WSHandler.message["type"]='authentication'
                WSHandler.message["status"]='success'
                self.write_message(json.dumps(WSHandler.message))
                WSHandler.sendAllData()
                self.write_message(json.dumps(WSHandler.message))
            else:
                WSHandler.message['type']='authentication'
                WSHandler.message['status']='failure'
                self.write_message(json.dumps(WSHandler.message))
        #register process
        if code == "register":
            userName=receivedMessage['userName']
            password=receivedMessage['password']
            result = dbh.insertUser(userName,password)
            if result:
                # clients.append(self)
                WSHandler.message["type"]='registration'
                WSHandler.message["status"]='success'
                self.write_message(json.dumps(WSHandler.message))
            else:
                WSHandler.message['type']='registration'
                WSHandler.message['status']='failure'
                self.write_message(json.dumps(WSHandler.message))
        if code == "requestGroups":
            WSHandler.getMyGroups(self.userName)
            self.write_message(json.dumps(WSHandler.message))
        if code == "requestPeople":
            WSHandler.getMyFriends(self.userName)
            self.write_message(json.dumps(WSHandler.message))
        if code == "chatWithGroup":
            groupName=receivedMessage['groupName']
            onlineGroupMembers = WSHandler.selectOnlineGroupMembers(groupName)
            WSHandler.message.clear()
            WSHandler.message["onlineGroupMembers"]=onlineGroupMembers
            WSHandler.message["type"]='groupChatStart'
            self.write_message(json.dumps(WSHandler.message))
        if code == "groupChatMessage":
            groupName=receivedMessage['groupName']
            WSHandler.message.clear()
            WSHandler.message["type"]="groupChatMessage"
            WSHandler.message["message"]=receivedMessage['message']
            WSHandler.message["groupName"]=groupName
            WSHandler.message["sender"]=self.userName
            onlineGroupMembersObjects=WSHandler.selectOnlineGroupMembersObjects(groupName)
            for onlineGroupMembersObject in onlineGroupMembersObjects:
                onlineGroupMembersObject.write_message(json.dumps(WSHandler.message))
        # I am here, body continue to write group chat message
        if code == "privateChatMessage":
            receiver=receivedMessage['receiver']
            sender=self.userName
            message=receivedMessage['message']
            WSHandler.sendPrivateMessage(sender,receiver,message)

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
        WSHandler.onlineUsers.remove(self)
        # onlineClients.remove(self.name)
        pass
    @staticmethod
    def sendAllData():
        WSHandler.message.clear()
        WSHandler.message["type"]='leaderBoard'
        WSHandler.message["superFriend"]=dbh.superFriend()
        WSHandler.message["chattyOne"]=dbh.chattyOne()
        WSHandler.message["partyMan"]=dbh.partyMan()
        WSHandler.message["publicFigure"]=dbh.publicFigure()
    def getMyGroups(name):
        WSHandler.message.clear()
        WSHandler.message["type"]='groups'
        WSHandler.message["myGroups"]=dbh.selectUserGroups(name)
        WSHandler.message["notMyGroups"]=dbh.selectNotUserGroups(name)
    def getMyFriends(name):
        WSHandler.message.clear()
        WSHandler.message["type"]='people'
        WSHandler.message["myFriends"]=dbh.selectFriends(name)
        WSHandler.message["notMyFriends"]=dbh.selectNotFriends(name)
    def selectOnlineGroupMembers(name):
        groupMembers = dbh.selectGroupMembers(name)
        onlineGroupMembers=[]
        listOnlineUsers=WSHandler.getListOnlineUsers()
        for groupMember in groupMembers:
            try:
                listOnlineUsers.index(groupMember)
                onlineGroupMembers.append(groupMember)
            except Exception as e:
                pass
        return onlineGroupMembers
    def getListOnlineUsers():
        listOnlineUsers=[]
        for OnlineUser in WSHandler.onlineUsers:
            listOnlineUsers.append(OnlineUser.userName)
        return listOnlineUsers
    def selectOnlineGroupMembersObjects(name):
        onlineGroupMembers = WSHandler.selectOnlineGroupMembers(name)
        onlineGroupMembersObjects=[]
        for OnlineUser in WSHandler.onlineUsers:
            try:
                onlineGroupMembers.index(OnlineUser.userName)
                onlineGroupMembersObjects.append(OnlineUser)
            except Exception as e:
                pass
        return onlineGroupMembersObjects
    def sendPrivateMessage(sender,receiver,message):
        WSHandler.message.clear()
        WSHandler.message["type"]="privateChatMessage"
        WSHandler.message["sender"]=sender
        WSHandler.message["receiver"]=receiver
        WSHandler.message["message"]=message
        for onlineUser in WSHandler.onlineUsers:
            if onlineUser.userName==sender or onlineUser.userName==receiver:
                onlineUser.write_message(json.dumps(WSHandler.message))




app=web.Application([(r"/",ChatHandler),(r"/ws",WSHandler)]
,static_path='static',debug=True)

app.listen(7500)
ioloop.IOLoop.current().start()

from pymysql import connect,cursors
# import pymysql

conn = connect( host = 'localhost',user = 'root',passwd = 'iti',db = 'chatGame' );
cursor = conn.cursor( cursors.DictCursor );

class Database:

    # /****************************** user *************************************/
    # login
    def loginUser(self,u_name,password):
        cursor.execute( "SELECT * FROM users where u_name=%s and pass=%s",(u_name,password));
        data = cursor.fetchall();
        if(data):
            return True
        else:
            return False

    # registration // insert into name pass
    def insertUser(self,u_name,password,u_imag=""):
        try:
            cursor.execute("INSERT INTO users set u_name=%s, pass=%s,u_image=%s",(u_name,password,u_imag))
            conn.commit();
        except Exception as e :
            conn.rollback()
            return False
        return True

    # select all
    def selectAllUsers(self):
        cursor.execute( "SELECT u_name FROM users" );
        data = cursor.fetchall();
        result=[]
        for i in data:
            result.append( i['u_name'] );
        return result

    # select friends
    def selectFriends(self,u_name):
        cursor.execute( "SELECT friend2 FROM friends where friend1 = %s",(u_name) );
        data = cursor.fetchall();
        result=[]
        for i in data:
            result.append( i['friend2'] );
        return result

    # select not freinds
    def selectNotFriends(self,u_name):
        cursor.execute( "SELECT u_name FROM users where u_name Not in (SELECT friend2 FROM friends where friend1 =%s) and u_name <> %s",(u_name,u_name));
        data = cursor.fetchall();
        result=[]
        for i in data:
            result.append( i['u_name'] );
        return result

    # increment message
    def incrementMessages(self,u_name):
        try:
            cursor.execute("update users set msg=msg+1 where u_name =%s",(u_name))
            conn.commit()
        except Exception as e :
            print(str(e))
            conn.rollback()


# /******************************* group ********************************/

    # registration // insert into name pass
    def creatGroup(self,group_name, creator_name, imag):
        try:
            cursor.execute("INSERT INTO groups set gr_name=%s, creator_name=%s, image=%s", (group_name, creator_name,imag))
            conn.commit();
        except Exception as e:
            print(str(e))
            conn.rollback()
            return False
        return True

            # add user into group
    def joinToGroup(self,u_name,group_name):
        try:
            cursor.execute("INSERT INTO members set user_name=%s, group_name=%s", (u_name,group_name))
            conn.commit();
        except Exception as e:
            print(str(e));
            conn.rollback();
    # select user groups
    def selectUserGroups(self,u_name):
        cursor.execute( "SELECT group_name FROM members where user_name = %s",(u_name) );
        data = cursor.fetchall();
        result=[]
        for i in data:
            result.append( i['group_name'] );
        return result

    # select not freinds
    def selectNotUserGroups(self,u_name):
        cursor.execute( "SELECT group_name FROM members Where group_name Not IN (SELECT group_name FROM members where user_name = %s) Group By group_name", (u_name));
        data = cursor.fetchall();
        result=[]
        for i in data:
            result.append( i['group_name'] );
        return result

    #selectGroup members
    def selectGroupMembers(self,group_name):
        cursor.execute( "SELECT user_name FROM members WHERE group_name=%s ",(group_name) )
        data = cursor.fetchall();
        result=[]
        for i in data:
            result.append( i['user_name'] );
        return result

    #leave group
    def leaveGroup(self,u_name,group_name):
        try:
            cursor.execute("DELETE FROM members WHERE user_name = %s AND group_name = %s", ( u_name, group_name))
            conn.commit()
            return True
        except Exception as e:
            print(str(e))
            conn.rollback()
            return False

# /****************** Friend *******************/
    #  sendfriendrequest
    def sendFriendRequest(self,sender,receiver):
        try:
            cursor.execute("INSERT INTO requests VALUES(%s, %s, 0)",(sender,receiver))
            conn.commit();
        except Exception as e:
            print(str(e));
            conn.rollback();

    #accept friend request
    def acceptFriendRequest(self, receiver, sender):
        try:
            cursor.execute("INSERT INTO friends VALUES(%s, %s)", (sender,receiver))
            cursor.execute("INSERT INTO friends VALUES(%s, %s)", (receiver,sender))
            cursor.execute("DELETE FROM requests WHERE sender = %s AND receiver = %s", (sender,receiver))
            conn.commit();
        except Exception as e:
            print(str(e));
            conn.rollback();

    #reject friend request
    def rejectFriendRequest(self,receiver, sender ):
        try:
            cursor.execute("DELETE FROM requests WHERE sender = %s AND receiver = %s", (sender,receiver))
            conn.commit();
        except Exception as e:
            print(str(e));
            conn.rollback();

    # /*********************** home *******************************/
    #select super frind
    # SELECT friend1 , COUNT(*) c FROM friends GROUP BY friend1 HAVING c > 1  LIMIT 1
    def superFriend(self):
        cursor.execute("SELECT friend1 , COUNT(*) c FROM friends GROUP BY friend1 ORDER BY  c desc, friend1 asc  LIMIT 1");
        data = cursor.fetchone();
        return data['friend1']

    #select chatty one
    def chattyOne(self):
        cursor.execute("Select u_name from users where msg = (select max(msg) from users)");
        data = cursor.fetchone();
        return data['u_name']

    #select party man
    def partyMan(self):
        cursor.execute("SELECT user_name,COUNT(*) c FROM members GROUP BY user_name ORDER BY  c desc, user_name asc  LIMIT 1");
        data = cursor.fetchone();
        return data['user_name']

    #select public figure
    def publicFigure(self):
        cursor.execute("SELECT creator_name, COUNT(user_name) AS c FROM `groups`, `members` WHERE groups.gr_name = members.group_name GROUP BY creator_name ORDER BY c DESC, creator_name ASC LIMIT 1;");
        data = cursor.fetchone();
        return data['creator_name']





# d.selectAllUsers();
# d.loginUser('yomna','iti')
# d.insertUser('yomna','iti','ddd/ddd')
# d.selectNotFriends('ali')
# d.selectNotUserGroups('ahmed')
# d.leaveGroup('foda','sd-group')
# d.superFriend()
#d.publicFigure()
#d.creatGroup('new-group','atta','img/path')
# d.incrementMessages('atta')

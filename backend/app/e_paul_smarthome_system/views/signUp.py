from ..model.account import Account
from ..model.user import User
from ..model.microcontroller import Microcontroller
from ..model.group import Group
from ..model.port import Port
from ..model.groupPort import GroupPort

from ..serializer.microcontrollerSerializer import MicrocontrollerSerializer

#from ..functions.sendMail import send_email
from django.core.mail import BadHeaderError, send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from bcrypt import hashpw, gensalt, checkpw
from os import system

import string
import random

def id_generator(size=20, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

from django.core import mail
from django.core.mail.backends.smtp import EmailBackend


class SignUp(APIView):
    queryset = Account.objects.all()

    def post(self, request):
        data = request.data
        email = data["email"]
        password = data["password"]

        def accountExists(email):
            if Account.objects.filter(email=email):
                return 1
            else:
                return 0

        if(accountExists(email)==0):
            password = password.encode("utf-8")
            passwordHash = hashpw(password, salt=gensalt())
            password = passwordHash.decode("utf-8")
            account = Account(password=password,email = email)
            account.save()
            return Response(status=201)
        else:
            return Response(status=420)
        
"""     
for testing purposes    
{
"email" : "test",
"password" : "435"
}
"""

class EmailVerification(APIView):
    queryset = Account.objects.all()
    
    def post(self, request):
        data = request.data
        email = data["email"]
        key = id_generator(size=4, chars= string.digits)
        data = {
            "subject" : "Verification Code for ePaul SmartHome System",
            "message" : "Your verification code is: " + key + "\n" + "Please enter this code to verify your email address. \n" + "If you did not request this code, please ignore this email.",
            "receiver" : email
        }
        
        try:
            send_mail(data["subject"], data["message"],settings.EMAIL_HOST_USER  ,[data["receiver"]])
        except BadHeaderError:
            return Response("Invalid header found.", status = 400)
        try:
            account = Account.objects.get(email=email)
            key = key.encode("utf-8")
            keyHash = hashpw(key, salt=gensalt())
            key = keyHash.decode("utf-8")
            account.key = key
            account.save()        
        except Account.DoesNotExist:
            return Response("Account does not exist",status=400)
        return Response("Email sent successfully.", status = 204)





class CreateUser(APIView):
    queryset = User.objects.all()
    
    def post(self, request):
        data = request.data
        try:
            username = data["username"]
            isAdmin = data["isAdmin"]
            executingUserId = data["executingUserId"]
        except KeyError:
            return Response(status=400)
        
        try: 
            executingUser = User.objects.get(id=executingUserId)
        except User.DoesNotExist:
            executingUser = None
        
        try:
            pin = data["pin"]
        except KeyError:
            pin = None
        accountId = data["accountId"]

        try:
            account = Account.objects.get(id=accountId)
        except Account.DoesNotExist:
            return Response(status=400)
         
        if(Account.objects.get(id=accountId).user.count() >= 7):
            return Response(status=400)
        
        
        try: 
            if (Account.objects.filter(id=accountId, user__isnull = False)):
                noUser = False
            else:
                noUser = True
        except Account.DoesNotExist:
            noUser = True 
        
        def userExists(accountId, username):
            if Account.objects.filter(id=accountId, user__username=username):
                return 1
            else:
                return 0
        
        
        if(noUser == True and executingUser == None):
            pin = pin.encode("utf-8")
            pinHash = hashpw(pin, salt=gensalt())
            pin = pinHash.decode("utf-8")
            user = User(username = username, pin = pin, account = account, role = 'superuser')
            user.save()
            group1 = Group(user = User.objects.get(username = username), groupType = 'Assignment')
            group2 = Group(user = User.objects.get(username = username), groupType = 'Favorite')
            group1.save()
            group2.save()
            return Response(status = 201)
        elif(userExists(accountId, username)==0):
            if executingUser.rights["mayAddUser"] == 0:
                return Response(status=400)
            if(pin == None or pin == ""):
                if  isAdmin == True:
                    rights = executingUser.rights
                    rights["mayChangeAccountSettings"] = 0
                    user = User(username = username, account = account, rights = rights, role = 'admin')
                    user.save()
                else:
                    user = User(username = username, account = account, role = 'user')
                    user.save()
                group1 = Group(user = User.objects.get(username = username), groupType = 'Assignment')
                group2 = Group(user = User.objects.get(username = username), groupType = 'Favorite')
                
                group1.save()
                group2.save()
                
                if user.role == 'admin':
                    ports = Port.objects.filter(groupPort__group__user__id = executingUser.id, groupPort__group__groupType = 'Assignment')
                    
                    for port in ports:
                        groupPort = GroupPort(group = group1, port = port)
                        groupPort.save()
                    return Response(status = 201)
                else:
                    return Response(status = 201)
            else:
                pin = pin.encode("utf-8")
                pinHash = hashpw(pin, salt=gensalt())
                pin = pinHash.decode("utf-8")
                if  isAdmin == True:
                    rights = executingUser.rights
                    rights["mayChangeAccountSettings"] = 0
                    user = User(username = username, pin = pin, rights = rights, account = account, role ='admin')
                    user.save()
                else:
                    user = User(username = username, pin = pin, account = account, role ='user')
                    user.save()
                group1 = Group(user = User.objects.get(username = username), groupType = 'Assignment')
                group2 = Group(user = User.objects.get(username = username), groupType = 'Favorite')
                
                group1.save()
                group2.save()
                
                if user.role == 'admin':
                    ports = Port.objects.filter(groupPort__group__user__id = executingUser.id, groupPort__group__groupType = 'Assignment')
                    
                    for port in ports:
                        groupPort = GroupPort(group = group1, port = port)
                        groupPort.save()
                    return Response(status = 201)
                else:
                    return Response(status = 201)
        else:
            return Response(status=400)
        
"""
for testing purposes
{
"accountId" : 2,
"username" : "Zelda",
"pin" : "187",
"isAdmin" : true,
"executingUserId" : 1
}
"""

class MicrocontrollerSignUp(APIView):
    queryset = User.objects.all()
    
    def post(self, request):
        data = request.data	
        email = data["email"]
        password = data["password"]
        name = data["name"]

        if Account.objects.get(email=email) == None:
            return Response(status=400)
        else:
            account = Account.objects.get(email=email)
            samePassword = checkpw(password.encode("utf-8"), account.password.encode("utf-8"))
            if samePassword == 1:
                key = id_generator()
                microcontroller = Microcontroller(name=name, account = account, key = key)
                microcontroller.save()
                with open("/etc/mosquitto/authbuffer", "a") as myfile:
                    myfile.write(str(microcontroller.id) + ":" + key)
                system("mosquitto_passwd -U /etc/mosquitto/authbuffer")
                with open("/etc/mosquitto/authbuffer", "r+") as myfile:
                    key = myfile.read()
                    myfile.truncate(0)
                with open("/etc/mosquitto/auth", "a") as myfile:
                    myfile.write(str(key))
                system("sudo systemctl restart mosquitto")
                port = Port(type = "test", microcontroller = microcontroller)
                port.save()
                serializer = MicrocontrollerSerializer(microcontroller)
                return Response(serializer.data, status=201)
            else:
                return Response(status=400)



"""
{
"email" : "test",
"password" : "435",
"name" : "Zelda's Microcontroller"
}
"""
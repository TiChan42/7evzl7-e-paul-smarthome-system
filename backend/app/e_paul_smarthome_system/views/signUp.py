from ..model.account import Account
from ..model.user import User
from ..model.microcontroller import Microcontroller
from ..model.group import Group
from ..model.port import Port
from ..model.groupPort import GroupPort
from ..model.knownControllerType import KnownControllerType
from ..model.portTemplate import PortTemplate
from ..model.command import Command
from ..model.commandOption import CommandOption

from ..serializer.microcontrollerSerializer import MicrocontrollerSignUpSerializer

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
            
            knownControllerTypeLamp = KnownControllerType(account = account, type = "lamp_1")
            knownControllerTypeButton = KnownControllerType(account = account, type = "button_1") 
            knownControllerTypeLamp.save(), knownControllerTypeButton.save()
            
            portTemplateLamp = PortTemplate(knownControllerType = knownControllerTypeLamp, status_default = {"status" : "off"})
            portTemplateButton = PortTemplate(knownControllerType = knownControllerTypeButton, status_default = {"status" : "off"})
            portTemplateLamp.save(), portTemplateButton.save()
            
            commandLamp1 = Command(portTemplate = portTemplateLamp, description = "erhöht die Helligkeit der Lampe um den übergebenen Wert ")
            commandLamp1.save()
            commandOptionLamp1_1 = CommandOption(command = commandLamp1, key = "type", static = True, value = 1)
            commandOptionLamp1_2 = CommandOption(command = commandLamp1, key = "target", static = False, value = None)
            commandOptionLamp1_3 = CommandOption(command = commandLamp1, key = "command", static = True, value = "changeLampBrightness")
            commandOptionLamp1_4 = CommandOption(command = commandLamp1, key = "brightness", static = False, value = None)
            commandOptionLamp1_1.save(), commandOptionLamp1_2.save(), commandOptionLamp1_3.save(), commandOptionLamp1_4.save()
            
            commandLamp2 = Command(portTemplate = portTemplateLamp, description = "ändert den rgb Wert der Lampe auf den übergebenen Hex-Wert")
            commandLamp2.save()
            commandOptionLamp2_1 = CommandOption(command = commandLamp2, key = "type", static = True, value = 1)
            commandOptionLamp2_2 = CommandOption(command = commandLamp2, key = "target", static = False, value = None)
            commandOptionLamp2_3 = CommandOption(command = commandLamp2, key = "command", static = True, value = "changeRGBValue")
            commandOptionLamp2_4 = CommandOption(command = commandLamp2, key = "rgb", static = False, value = None)
            commandOptionLamp2_1.save(), commandOptionLamp2_2.save(), commandOptionLamp2_3.save(), commandOptionLamp2_4.save()
            
            commandLamp3 = Command(portTemplate = portTemplateLamp, description = "schaltet das Modul ein")
            commandLamp3.save()
            commandOptionLamp3_1 = CommandOption(command = commandLamp3, key = "type", static = True, value = 1)
            commandOptionLamp3_2 = CommandOption(command = commandLamp3, key = "target", static = False, value = None)
            commandOptionLamp3_3 = CommandOption(command = commandLamp3, key = "command", static = True, value = "switchOn")
            commandOptionLamp3_1.save(), commandOptionLamp3_2.save(), commandOptionLamp3_3.save()
            
            commandLamp4 = Command(portTemplate = portTemplateLamp, description = "schaltet das Modul aus")
            commandLamp4.save()
            commandOptionLamp4_1 = CommandOption(command = commandLamp4, key = "type", static = True, value = 1)
            commandOptionLamp4_2 = CommandOption(command = commandLamp4, key = "target", static = False, value = None)
            commandOptionLamp4_3 = CommandOption(command = commandLamp4, key = "command", static = True, value = "switchOff")
            commandOptionLamp4_1.save(), commandOptionLamp4_2.save(), commandOptionLamp4_3.save()
            
            
            commandButton1 = Command(portTemplate = portTemplateButton, description = "schaltet das Modul ein")
            commandButton1.save()
            commandOptionButton1_1 = CommandOption(command = commandButton1, key = "type", static = True, value = 1)
            commandOptionButton1_2 = CommandOption(command = commandButton1, key = "target", static = False, value = None)
            commandOptionButton1_3 = CommandOption(command = commandButton1, key = "command", static = True, value = "switchOn")
            commandOptionButton1_1.save(), commandOptionButton1_2.save(), commandOptionButton1_3.save()
            
            commandButton2 = Command(portTemplate = portTemplateButton, description = "schaltet das Modul aus")
            commandButton2.save()
            commandOptionButton2_1 = CommandOption(command = commandButton2, key = "type", static = True, value = 1)
            commandOptionButton2_2 = CommandOption(command = commandButton2, key = "target", static = False, value = None)
            commandOptionButton2_3 = CommandOption(command = commandButton2, key = "command", static = True, value = "switchOff")
            commandOptionButton2_1.save(), commandOptionButton2_2.save(), commandOptionButton2_3.save()
            
            commandButton3 = Command(portTemplate = portTemplateButton, description  = "wechselt den modus des buttons zwischen signal nur bei drücken und signal bei drücken und bei loslassen")
            commandButton3.save()
            commandOptionButton3_1 = CommandOption(command = commandButton3, key = "type", static = True, value = 1)
            commandOptionButton3_2 = CommandOption(command = commandButton3, key = "target", static = False, value = None)
            commandOptionButton3_3 = CommandOption(command = commandButton3, key = "command", static = True, value = "changeMode")
            commandOptionButton3_4 = CommandOption(command = commandButton3, key = "mode", static = False, value = None)
            commandOptionButton3_1.save(), commandOptionButton3_2.save(), commandOptionButton3_3.save(), commandOptionButton3_4.save()
            
            return Response(status=201)
        else:
            return Response(status=420)
        
"""     
for testing purposes    
{
"email" : "robbe0503@t-online.de",
"password" : "123"
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
            accountId = data["accountId"]
            username = data["username"]
            isAdmin = data["isAdmin"]
            executingUserId = data["executingUserId"]
        except KeyError:
            return Response(status=400)
        try:
            pin = data["pin"]
        except KeyError:
            pin = None
        
        try: 
            executingUser = User.objects.get(id=executingUserId)
        except User.DoesNotExist:
            if User.objects.filter(account__id = accountId).count() >= 1:
                return Response(status=400)
            executingUser = None
        
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
                  
        try:
            userExists = User.objects.get(username = username, account__id = accountId) 
        except User.DoesNotExist:
            userExists = None
        
        
        if(noUser == True and executingUser == None):
            pin = pin.encode("utf-8")
            pinHash = hashpw(pin, salt=gensalt())
            pin = pinHash.decode("utf-8")
            user = User(username = username, pin = pin, account = account, role = 'superuser')
            user.save()
            group1 = Group(user = User.objects.get(pk = user.id), groupType = 'Assignment')
            group2 = Group(user = User.objects.get(pk = user.id), groupType = 'Favorite')
            group1.save()
            group2.save()
            return Response(status = 201)
        elif(userExists == None):
            if executingUser.rights["mayAddUser"] == 0:
                return Response(status=400)
            if(pin == None or pin == ""):
                if  isAdmin == True:
                    return Response(status=400)
                else:
                    user = User(username = username, account = account, role = 'user')
                    user.save()
                group1 = Group(user = User.objects.get(pk = user.id), groupType = 'Assignment')
                group2 = Group(user = User.objects.get(pk = user.id), groupType = 'Favorite')
                
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
                group1 = Group(user = User.objects.get(pk = user.id), groupType = 'Assignment')
                group2 = Group(user = User.objects.get(pk = user.id), groupType = 'Favorite')
                
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
        
        try:
            email = data["email"]
            password = data["password"]
            name = data["name"]
            type = data["type"]
        except KeyError:    
            return Response(status=400)
        
        try:
            account = Account.objects.get(email=email)
        except Account.DoesNotExist: 
            return Response(status=400)
        
        try:
            knownControllerType = KnownControllerType.objects.get(account__email = email, type = type)
        except KnownControllerType.DoesNotExist:
            return Response(status=400)
        
        if account and knownControllerType:
            samePassword = checkpw(password.encode("utf-8"), account.password.encode("utf-8"))
            if samePassword == 1:
                key = id_generator()
                microcontroller = Microcontroller(name=name, account = account, key = key, type = type)
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
                portTemplates = PortTemplate.objects.filter(knownControllerType = knownControllerType)
                for portTemplate in portTemplates:
                    port = Port(type = portTemplate.knownControllerType.type, microcontroller = microcontroller, name = microcontroller.name, portTemplate = portTemplate, currentStatus = portTemplate.status_default)
                    port.save()
                    superuser = User.objects.get(account__microcontroller__port__id = port.id, role = "superuser")
                    assignmentGroup = Group.objects.get(user = superuser, groupType = "Assignment")
                    groupPort = GroupPort(group = assignmentGroup, port = port)
                    groupPort.save()
                serializer = MicrocontrollerSignUpSerializer(microcontroller)    
                return Response(serializer.data, status=201)
            else:
                return Response(status=400)



"""
{
"email" : "robbe0503@t-online.de",
"password" : "123",
"name" : "Zelda's Microcontroller",
"type" : "lamp_1"
}
"""
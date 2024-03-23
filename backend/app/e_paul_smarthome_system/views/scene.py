from ..model.scene import Scene
from ..model.group import Group
from ..model.user import User
from ..model.state import State
from ..model.port import Port
from ..model.microcontroller import Microcontroller
from ..model.account import Account

from rest_framework.views import APIView
from rest_framework.response import Response

import json
from ..mqttFunctions.python_client_pub import PythonClientPub

class CreateScene(APIView):
    queryset = Scene.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            executingUserId = data["executingUserId"]
            groupId = data["groupId"]
            name = data["name"]
            ignoredPorts = data["ignoredPorts"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        try:
            group = Group.objects.get(id = groupId, user = user)
        except Group.DoesNotExist:
            return Response(status = 400)
        
        try:
            sceneNameExists = Scene.objects.get(name = name, group = group)
        except Scene.DoesNotExist:
            sceneNameExists = None
        
        if sceneNameExists == None:
            scene = Scene(name = name, group = group)
            scene.save()
            
            ports = Port.objects.filter(groupPort__group = group)
            
            for port in ports:
                if port.id in ignoredPorts:
                    continue
                else:
                    state = State(scene = scene, port = port, state = port.currentStatus)
                    state.save()
            
            return Response(status = 201)
        else:
            return Response(status = 400)

"""
teststring:
{
"executingUserId": 4,
"groupId" : 7,
"name": "Admin Scene",
"ignoredPorts" : []
}
"""


class DeleteScene(APIView):
    queryset = Scene.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            executingUserId = data["executingUserId"]
            sceneId = data["sceneId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        try:
            scene = Scene.objects.get(id = sceneId, group__user = user)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        scene.delete()
        
        return Response(status = 204)

class ChangeSceneName(APIView):
    queryset = Scene.objects.all()
    
    def put(self, request):
        data = request.data
        
        try:
            executingUserId = data["executingUserId"]
            sceneId = data["sceneId"]
            name = data["name"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        try:
            scene = Scene.objects.get(id = sceneId, group__user = user)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        try :
            sceneNameExists = Scene.objects.get(name = name, group = scene.group)
        except Scene.DoesNotExist:
            sceneNameExists = None
        
        if sceneNameExists == None:
            scene.name = name
            scene.save()
            return Response(status = 204)
        else:
            return Response(status = 400)

class SceneAddPort(APIView):
    queryset = Scene.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            executingUserId = data["executingUserId"]
            sceneId = data["sceneId"]
            portId = data["portId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        assignmentGroup = Group.objects.get(user = user, groupType = "Assignment")
        
        try:
            scene = Scene.objects.get(id = sceneId, group__user = user)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        try:
            port = Port.objects.get(id = portId, groupPort__group = assignmentGroup)
        except Port.DoesNotExist:
            return Response(status = 400)
        
        state = State(scene = scene, port = port, state = port.currentStatus)
        state.save()
        
        return Response(status = 201)

class SceneRemovePort(APIView):
    queryset = Scene.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            executingUserId = data["executingUserId"]
            sceneId = data["sceneId"]
            portId = data["portId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            user = User.objects.get(id = executingUserId)
        except User.DoesNotExist:
            return Response(status = 400)
        
        try:
            scene = Scene.objects.get(id = sceneId, group__user = user)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        try:
            state = State.objects.get(scene__id = sceneId, port__id = portId)
        except State.DoesNotExist:
            return Response(status = 400)
                
        try:
            port = Port.objects.get(id = portId, state__id = state.id)
        except Port.DoesNotExist:
            return Response(status = 400)
        
        state.delete()
        return Response(status = 204)


class UpdateState(APIView):
    queryset = State.objects.all()
  
    def put(self, request):
        data = request.data
        
        try:
            executingUserId = data["executingUserId"]
            portId = data["portId"]
            sceneId = data["sceneId"]
        except KeyError:
            return Response(status = 400)
          
        try:
            port = Port.objects.filter(id = portId, groupPort__group__user__id = executingUserId).first()
        except Port.DoesNotExist:
            return Response(status = 400)
              
        try: 
            scene = Scene.objects.get(id = sceneId, group__user__id = executingUserId)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        state = State.objects.get(scene = scene, port = port)
        state.state = port.currentStatus
        state.save()
        return Response(status = 204)


class ExecuteScene(APIView):
    queryset = Scene.objects.all()
    
    def post(self, request):
        data = request.data
        
        try:
            exectuingUserId = data["executingUserId"]
            sceneId = data["sceneId"]
            groupId = data["groupId"]
        except KeyError:
            return Response(status = 400)
        
        try:
            scene = Scene.objects.get(id = sceneId)
        except Scene.DoesNotExist:
            return Response(status = 400)
        
        email = Account.objects.get(user__group__id = groupId).email
        
        states = State.objects.filter(scene = scene)
        
        client = PythonClientPub()
        
        for state in states:
            message = {
                "type": 3,
                "target": Microcontroller.objects.get(port = state.port).id,
                "state": state.state
            }
            messageJson = json.dumps(message)
            
            print(messageJson)
            
            client.publishScene(email, messageJson)
            
        return Response(status = 204)
    
"""
teststring:
{
"executingUserId": 4,
"sceneId": 1,
"groupId": 7
}
"""
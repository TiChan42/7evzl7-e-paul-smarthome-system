from ..model.scene import Scene
from ..model.group import Group
from ..model.user import User
from ..model.state import State
from ..model.port import Port
from ..model.microcontroller import Microcontroller

from rest_framework.views import APIView
from rest_framework.response import Response




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
            port = Port.objects.get(id = portId, state = scene.state)
        except Port.DoesNotExist:
            return Response(status = 400)
        
        try:
            state = State.objects.get(scene = scene, port = port)
            state.delete()
            return Response(status = 204)
        except State.DoesNotExist:
            return Response(status = 400)

class UpdateState(APIView):
    queryset = State.objects.all()
  
    def put(self, request):
        data = request.data
        
        try:
            password = data["key"]
            id = data["microcontrollerId"]
            currentStatus = data["state"]
        except KeyError:
            return Response(status = 400)
        
        try:
            microcontroller = Microcontroller.objects.get(pk = id)
        except Microcontroller.DoesNotExist:
            return Response(status = 400)
        
        try:
            port = Port.objects.get(microcontroller = microcontroller)
        except Port.DoesNotExist:
            return Response(status = 400)
              
        try:
            if password == microcontroller.key:
                samePassword = 1
            else:
                samePassword = 0
        except ValueError:
            return Response(status = 400)
        
        if samePassword == 0:
            return Response(status = 400)
        else:
            port.currentStatus = currentStatus
            port.save()
            return Response(status = 204)
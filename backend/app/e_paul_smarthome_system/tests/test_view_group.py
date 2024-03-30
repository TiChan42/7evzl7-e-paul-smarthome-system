from django.test import TestCase, RequestFactory
from rest_framework.response import Response
from ..views.group import AddGroup
from ..model.account import Account
from ..model.user import User
from ..model.group import Group


class TestAddGroup(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.superuser)
        self.factory = RequestFactory(raise_request_exception=False)

    def test_add_group_with_valid_data(self):
        request_data = {
            "userId": self.user.id,
            "name": "Test Group",
            "clientIds": [1,2]
        }
        request = self.factory.post('/addGroup/', data=request_data)
        response = AddGroup.as_view()(request)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Group.objects.filter(name="Test Group", user=self.user, groupType="Standard").exists())

    def test_add_group_with_invalid_user(self):
        request_data = {
            "userId": 999,  
            "name": "",
            "clientIds": [1,2]
        }
        request = self.factory.post('/addGroup/', data=request_data)
        response = AddGroup.as_view()(request)

        self.assertEqual(response.status_code, 400)

    
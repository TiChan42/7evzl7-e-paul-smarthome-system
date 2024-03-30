from django.test import TestCase, RequestFactory
from ..views.getData import GetUsers, GetVerified, GetGroups
from ..model.account import Account
from ..model.group import Group
from ..model.user import User
from ..serializer.accountSerializer import AccountUserSerializer

class TestGetUsers(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test1@example.com', password="123")
        self.factory = RequestFactory(raise_request_exception=False)

    def test_get_user_valid_id(self):
        request = self.factory.get(f'/getUser/{self.account.id}/')
        response = GetUsers.as_view()(request, accountId=self.account.id)
        self.assertEqual(response.status_code, 200)

        expected_data = AccountUserSerializer(self.account).data
        self.assertEqual(response.data, expected_data)

    

class TestGetVerified(TestCase):
    def setUp(self):
            self.account1 = Account.objects.create(email='test1@example.com', emailVerified=True, password="123")
            self.account2 = Account.objects.create(email='test2@example.com', emailVerified=False, password="12345")
            self.factory = RequestFactory(raise_request_exception=False)

    def test_get_account_verification_verified(self):
        request = self.factory.get(f'/getVerified/{self.account1.id}/')
        response = GetVerified.as_view()(request, accountId=self.account1.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["verified"], 1)

    def test_get_account_verification_not_verified(self):
        request = self.factory.get(f'/getVerified/{self.account2.id}/')
        response = GetVerified.as_view()(request, accountId=self.account2.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["verified"], 0)

    def test_get_account_verification_no_account(self):
        request = self.factory.get(f'/getVerified/999/')
        response = GetVerified.as_view()(request, accountId=999)
        self.assertEqual(response.status_code, 400)


class TestGetGroups(TestCase):
    def setUp(self):
            self.account = Account.objects.create(email='test1@example.com', password="123")
            self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.superuser)
            self.group = Group.objects.create(user=self.user, name="testgroup")
            self.factory = RequestFactory(raise_request_exception=False)

    def test_get_group_standard(self):
        type = "Standard"
        request = self.factory.get(f'/getGroup/testgroup/{self.user.id}')
        response = GetGroups.as_view()(request, type=type, userId=self.user.id)
        self.assertEqual(response.status_code, 200)

    def test_get_group_no_type(self):
        type = ""
        request = self.factory.get(f'/getGroup/testgroup/{self.user.id}')
        response = GetGroups.as_view()(request, type=type, userId=self.user.id)
        self.assertEqual(response.status_code, 400)

    def test_get_group_no_group(self):
        type = "invalid_type"
        request = self.factory.get(f'/getGroup/testgroup/{333}')
        response = GetGroups.as_view()(request, type=type, userId=333)
        self.assertEqual(response.status_code, 400)



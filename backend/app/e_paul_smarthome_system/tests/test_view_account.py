"""from django.test import TestCase
from rest_framework.test import APIRequestFactory
from ..model.account import Account
from ..model.user import User
from ..serializer.accountSerializer import AccountSerializer
from ..views.account import AccountView, DeleteAccount

class AccountViewTestCase(TestCase):
    def setUp(self):
        # Create some sample accounts
        self.account1 = Account.objects.create(email='test1@example.com')
        self.account2 = Account.objects.create(email='test2@example.com')

        # Create a request factory
        self.factory = APIRequestFactory()

    def test_account_view(self):
        # Create a request object
        request = self.factory.get('/accounts/')

        # Instantiate the view and call the GET method
        view = AccountView.as_view()
        response = view(request)

        # Check if the response is successful
        self.assertEqual(response.status_code, 200)

        # Check if the response data contains the expected accounts
        expected_data = AccountSerializer([self.account1, self.account2], many=True).data
        self.assertEqual(response.data, expected_data)


class DeleteAccountTestCase(TestCase):
    def setUp(self):
        # Create a sample account and user
        self.account = Account.objects.create(email='test@example.com', password="123")
        self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.admin)

        # Create a request factory
        self.factory = APIRequestFactory()

    def test_delete_account_with_permission(self):
        # Mock request data
        request_data = {"accountId": self.account.id, "executingUserId": self.user.id}

        # Create a request object
        request = self.factory.post('/delete-account/', data=request_data)

        # Mock user rights to have permission
        self.user.rights["mayChangeAccountSettings"] = 1

        if Account.objects.filter(id=self.account.id).exists():
            print("account exists")
        if self.user.rights["mayChangeAccountSettings"] == 1:
            "user has rights"

        # Instantiate the view and call the POST method
        view = DeleteAccount.as_view()
        response = view(request)

        # Check if the account was deleted successfully
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Account.objects.filter(id=self.account.id).exists())

    def test_delete_account_without_permission(self):
        # Mock request data
        request_data = {"accountId": self.account.id, "executingUserId": self.user.id}

        # Create a request object
        request = self.factory.post('/delete-account/', data=request_data)

        # Mock user rights to have no permission
        self.user.rights["mayChangeAccountSettings"] = 0

        # Instantiate the view and call the POST method
        view = DeleteAccount.as_view()
        response = view(request)

        # Check if the response status code indicates no permission
        self.assertEqual(response.status_code, 400)"""

from django.test import TestCase, RequestFactory
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from unittest.mock import patch
from ..model.account import Account
from ..model.user import User
from ..views.account import DeleteAccount
from ..views.settings import RightsSettings

class DeleteAccountTestCase(TestCase):
    def setUp(self):
        # Create a sample account and user
        self.account = Account.objects.create(email='test@example.com')
        self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.admin)

        # Create a request factory
        self.factory = APIRequestFactory()

    @patch('e_paul_smarthome_system.views.settings')
    def test_delete_account_with_permission(self, mock_rights_settings):
        # Mock RightsSettings view behavior
        mock_rights_settings.return_value.put = lambda request: Response(status=202)

        # Mock request data
        request_data = {"accountId": self.account.id, "executingUserId": self.user.id}

        # Create a request object
        request = self.factory.post('/delete-account/', data=request_data)

        # Instantiate the view and call the POST method
        view = DeleteAccount.as_view()
        response = view(request)

        # Check if the account was deleted successfully
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Account.objects.filter(id=self.account.id).exists())

    @patch('e_paul_smarthome_system.views.settings')
    def test_delete_account_without_permission(self, mock_rights_settings):
        # Mock RightsSettings view behavior
        mock_rights_settings.return_value.put = lambda request: Response(status=400)

        # Mock request data
        request_data = {"accountId": self.account.id, "executingUserId": self.user.id}

        # Create a request object
        request = self.factory.post('/delete-account/', data=request_data)

        # Instantiate the view and call the POST method
        view = DeleteAccount.as_view()
        response = view(request)

        # Check if the response status code indicates no permission
        self.assertEqual(response.status_code, 400)

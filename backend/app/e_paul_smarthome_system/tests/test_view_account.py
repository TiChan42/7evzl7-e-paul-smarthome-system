from django.test import TestCase
from rest_framework.test import APIRequestFactory
from ..model.account import Account
from ..model.user import User
from ..serializer.accountSerializer import AccountSerializer
from ..views.account import AccountView, DeleteAccount

class AccountViewTestCase(TestCase):
    def setUp(self):
        self.account1 = Account.objects.create(email='test1@example.com', password="123")
        self.account2 = Account.objects.create(email='test2@example.com', password="123")
        self.factory = APIRequestFactory()

    def test_account_view(self):
        request = self.factory.get('/accounts/')

        view = AccountView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 200)

        expected_data = AccountSerializer([self.account1, self.account2], many=True).data
        self.assertEqual(response.data, expected_data)


class DeleteAccountTestCase(TestCase):
    def setUp(self):
        self.account = Account.objects.create(email='test@example.com', password="123")
        self.user = User.objects.create(username='test_user', account=self.account, role=User.Role.superuser)
        self.factory = APIRequestFactory()

    def test_delete_account_with_permission(self):
        request_data = {"accountId": self.account.id, "executingUserId": self.user.id}
        request = self.factory.post('/delete-account/', data=request_data)

        view = DeleteAccount.as_view()
        response = view(request)

    def test_delete_account_without_permission(self):
        request_data = {"accountId": self.account.id, "executingUserId": self.user.id}
        request = self.factory.post('/delete-account/', data=request_data)
        view = DeleteAccount.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Account.objects.filter(id=self.account.id).exists())

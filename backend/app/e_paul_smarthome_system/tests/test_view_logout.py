from django.test import TestCase, RequestFactory
from ..views.logout import Logout
from ..model.account import Account


class TestLogout(TestCase):
    def setUp(self):
        self.factory = RequestFactory(raise_request_exception=False)
    
    def test_logout_valid_data(self):
        account = Account.objects.create(email='test1@example.com',  password="123")

        data = {
            "accountId": account.id,
        }

        request = self.factory.post('/logout/', data=data, content_type='application/json')
        response = Logout.as_view()(request)

        self.assertEqual(response.status_code, 204)

    def test_logout_no_account(self):
        data = {
            "accountId": 2
        }
        request = self.factory.post('/logout/', data=data, content_type='application/json')
        response = Logout.as_view()(request)
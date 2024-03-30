from django.test import TestCase, RequestFactory
from ..views.login import LoginUser, Login
from ..model.user import User
from ..model.account import Account



class TestLogin(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_login_with_invalid_data(self):
        account = Account.objects.create(email='test1@example.com', password="123")
        
        data = {
            "email": 'test2@example.com',
            "password": "123"
        }
        request = self.factory.post('/login/', data=data, content_type='application/json')
        response = Login.as_view()(request)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["falseEmailPassword"], 0)

        # Check if the response data contains the expected account information
        #self.assertIn("email", response.data)
        #self.assertEqual(response.data["email"], account.email)

    def test_login_invalid_data(self):
        account = Account.objects.create(email='test1@example.com', password="123")
        
        data = {
            "email": 'test1@example.com',
            "password": "123"
        }
        request = self.factory.post('/login/', data=data, content_type='application/json')
        response = Login.as_view()(request)


        self.assertEqual(response.status_code, 400)
        

class TestLoginUser(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_login_invalid_data(self):
        account = Account.objects.create(email='test11@example.com', password="123")
        user = User.objects.create(username='test_user1', account=account, role=User.Role.admin)

        data = {
            "accountId": account.id,
            "pin": "345",
            "username": user.username
        }
        request = self.factory.post('/loginUser/', data=data)
        response = LoginUser.as_view()(request)

        self.assertEqual(response.status_code, 400)


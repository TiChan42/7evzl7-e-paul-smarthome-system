from django.test import TestCase, RequestFactory
from ..views.home import HomeView
from ..model.user import User
from ..model.account import Account


class TestHomeView(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_home_view_with_valid_data(self):
        account = Account.objects.create(email='test11@example.com', password="123")
        user = User.objects.create(username='test_user1', account=account, role=User.Role.admin)

        request = self.factory.get('/home/{user.id}/')
        response = HomeView.as_view()(request, userId=user.id)
        self.assertEqual(response.status_code, 200)


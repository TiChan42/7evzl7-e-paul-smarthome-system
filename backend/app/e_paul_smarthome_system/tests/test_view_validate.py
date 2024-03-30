from django.test import TestCase, RequestFactory
from ..views.validate import CheckPinRequired
from ..model.account import Account
from ..model.user import User

class TestCheckPinRequired(TestCase):
    def setUp(self):
      self.account1 = Account.objects.create(email='test11@example.com', password="123")
      self.user1 = User.objects.create(username='test_user1', account=self.account1, role=User.Role.superuser)
      self.factory = RequestFactory(raise_request_exception=False)

    def test_rights_valid_data(self):

        request = self.factory.get(f'/check-pin-pinRequired/{self.user1.id}/')
        response = CheckPinRequired.as_view()(request, userid=self.user1.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['Required'], False)



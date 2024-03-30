from django.test import TestCase
from ..model.account import Account


class AccountModelTestCase(TestCase):
    def setUp(self):
        self.account = Account.objects.create(
            password='test_password',
            email='test@example.com',
            description='Test account',
            emailVerified=False,
            key='test_key'
        )

    def test_account_creation(self):
        self.assertEqual(self.account.password, 'test_password')
        self.assertEqual(self.account.email, 'test@example.com')
        self.assertEqual(self.account.description, 'Test account')
        self.assertFalse(self.account.emailVerified)
        self.assertEqual(self.account.key, 'test_key')


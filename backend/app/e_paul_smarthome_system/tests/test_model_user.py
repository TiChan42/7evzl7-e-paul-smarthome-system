from django.test import TestCase
from ..model.user import User
from ..model.account import Account



class UserModelTestCase(TestCase):
    def setUp(self):
        self.account = Account.objects.create(
            password='test_password',
            email='test@example.com',
            description='Test account',
            emailVerified=False,
            key='test_key'
        )

    def test_user_creation(self):
        user = User.objects.create(
            username='test_user',
            account=self.account,
            pin='1234',
            role=User.Role.admin,
            imageName='profile.jpg',
            gender=User.Geschlecht.männlich,
            birthdate='2000-01-01',
        )

        created_user = User.objects.get(username='test_user')

        self.assertEqual(created_user.username, 'test_user')
        self.assertEqual(created_user.account, self.account)
        self.assertEqual(created_user.pin, '1234')
        self.assertEqual(created_user.role, User.Role.admin)
        self.assertEqual(created_user.imageName, 'profile.jpg')
        self.assertEqual(created_user.gender, User.Geschlecht.männlich)
        self.assertEqual(str(created_user.birthdate), '2000-01-01')

    def test_change_rights_method(self):
        user = User.objects.create(
            username='test_user',
            account=self.account,
            pin='1234',
            role=User.Role.admin,
        )

        sample_rights = {
            "mayChangeUserSettings": 1,
            "mayDeleteUser": 0,
            "mayAssignController": 1,
            "mayChangeUserType": 0,
            "mayChangeUserRights": 1,
            "mayAddUser": 1,
            "mayChangeAccountSettings": 0,
            "mayChangeOwnUserSettings": 1,
            "mayDeleteSelf": 0,
            "mayEditControllers": 1,
            "mayDeleteControllers": 0
        }

        user.changeRights(sample_rights)
        updated_user = User.objects.get(username='test_user')
        self.assertEqual(updated_user.rights, sample_rights)

from django.test import TestCase
from ..model.user import User
from ..model.account import Account



class UserModelTestCase(TestCase):
    def setUp(self):
        # Create a sample account for testing
        self.account = Account.objects.create(
            password='test_password',
            email='test@example.com',
            description='Test account',
            emailVerified=False,
            key='test_key'
        )

    def test_user_creation(self):
        """Test if user is created properly"""
        # Create a user instance
        user = User.objects.create(
            username='test_user',
            account=self.account,
            pin='1234',
            role=User.Role.admin,
            imageName='profile.jpg',
            gender=User.Geschlecht.männlich,
            birthdate='2000-01-01',
        )

        # Retrieve the created user from the database
        created_user = User.objects.get(username='test_user')

        # Assert that the user attributes are set correctly
        self.assertEqual(created_user.username, 'test_user')
        self.assertEqual(created_user.account, self.account)
        self.assertEqual(created_user.pin, '1234')
        self.assertEqual(created_user.role, User.Role.admin)
        self.assertEqual(created_user.imageName, 'profile.jpg')
        self.assertEqual(created_user.gender, User.Geschlecht.männlich)
        self.assertEqual(str(created_user.birthdate), '2000-01-01')

    def test_change_rights_method(self):
        """Test the changeRights method"""
        user = User.objects.create(
            username='test_user',
            account=self.account,
            pin='1234',
            role=User.Role.admin,
        )

        # Define sample rights
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

        # Call the changeRights method
        user.changeRights(sample_rights)

        # Retrieve the updated user from the database
        updated_user = User.objects.get(username='test_user')

        # Assert that the rights have been updated correctly
        self.assertEqual(updated_user.rights, sample_rights)

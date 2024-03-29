from ..views.about_us import AboutUsView
from django.test import TestCase, RequestFactory
from unittest.mock import MagicMock
from ..model.account import Account
from ..model.user import User


class AboutUsViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_about_us_view(self):
        request = self.factory.get('/about-us/')

        view = AboutUsView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, 200)

        expected_data = {"accounts": 0, "users": 0}
        self.assertEqual(response.data, expected_data)

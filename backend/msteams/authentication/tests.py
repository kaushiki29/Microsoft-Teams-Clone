from django.http import response
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token



class AuthTests(APITestCase):
    def setUp(self):
        # create user
        self.user = User.objects.create_user(username="joa123@gmail.com", password="password")
        self.user.first_name = "Joanne"
        self.user.last_name = "Williams"
        self.user.save() 
        token = Token.objects.get_or_create(user = self.user)[0]

    def test_invalid_login_credentials(self):
        url = reverse('user_login')
        data = {'email': "joa123@gmail.com", 'password': 'passww'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_valid_login_credentials(self):
        url = reverse('user_login')
        data = {'email': "joa123@gmail.com", 'password': 'pass'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('logout')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_get_username(self):
        url = reverse('get_username')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response)

    def test_logout_without_login(self):
        url = reverse('logout')
        data = {}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
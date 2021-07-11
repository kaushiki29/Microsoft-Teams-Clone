from django.http import response
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from .models import Videocall

class CommunicationTests(APITestCase):
    def setUp(self):
        # create user
        self.user = User.objects.create_user(username="joa123@gmail.com", password="password")
        self.user.first_name = "Joanne"
        self.user.last_name = "Williams"
        self.user.save() 
        token = Token.objects.get_or_create(user = self.user)[0]

    def test_get_meetName_api(self):
        url = reverse('get_meet_name')
        data = {'meeting_slug':"Test-slug-in-the-meeting"}
        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response)


    def test_fetch_calls_api(self):
        url = reverse('get_scheduled_calls')
        data = {
            'team_slug':"Testing the team slug",
        }
        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response)


from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from .models import Teams
# Create your tests here.


class TeamTests(APITestCase):
    def setUp(self):
        # create user
        self.user = User.objects.create_user(username="joa123@gmail.com", password="password")
        self.user.first_name = "Joanne"
        self.user.last_name = "Williams"
        self.user.save() 
        token = Token.objects.get_or_create(user = self.user)[0]

    
    def test_team_create_api(self):
        url = reverse('create_team')
        data = {'team_name':"Test Team"}
        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response)



    def test_team_join_api(self):
        url = reverse('join_team')
        data = {'unique_code':"TO3C5KWV"}
        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response)


    def test_team_invite_api(self):
        url = reverse('invite_member')
        data = {'email':"abcdef@gmail.com"}
        response = self.client.post(url, data, format='json')
        self.assertIsNotNone(response)




    
    

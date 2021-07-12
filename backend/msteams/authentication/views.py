from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib import auth
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.core.mail import send_mail
from .models import userData
from random import randint
import uuid
import requests
from fcm_django.models import FCMDevice



# User login API

@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    deviceToken = request.data.get("fcm_token")
    
    user = auth.authenticate(username=email, password=password)
    if user is None:
        return Response({
            'msg': 'Enter valid email and password'
        }, status=status.HTTP_200_OK)
    else:
        devices = FCMDevice.objects.filter(user=user,type='web')
        if deviceToken is not None:
            if devices.count() > 0:
                device = devices.first()
                device.registration_id = deviceToken
                device.type = "web"
                device.user = user
                device.save()
            else:
                device = FCMDevice()
                device.user = user
                device.type = "web"
                device.registration_id = deviceToken
                device.save()
        else: 
            print("Device token is none")
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'token': token.key,
        })


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def check_verified_user(request):
#     user=request.user
#     is_verified = userData.objects.get(user=user)
#     if is_verified:
#         return Response({
#             'is_verified':True
#         })
#     else:
#         return Response({
#             'is_verified':False
#         })



# Api to get username

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    user=request.user
    return Response({
        'username':user.first_name+" "+user.last_name
    })


# Logout API

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({
        'msg': 'SUCCESS'
    }, status=status.HTTP_200_OK)


# Signup API

@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    email = email.lower()
    username = email.lower()
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    password = request.data.get('password')
    user_present = User.objects.filter(email = email)
    if user_present:
        return Response({
            'error':True,
            'message':"User with this email already exists"
        })
    else:
        user = User.objects.create_user(username, email, password)
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'token': token.key,
        })


# @api_view(["POST"])
# @permission_classes([AllowAny])
# def verify_email(request):
#     email_uuid = request.data.get('email_uuid')
    
#     if userData.objects.filter(email_uuid=email_uuid).exists():
#         user_data = userData.objects.get(email_uuid=email_uuid)
#         user_data.is_verified = True
#         user_data.save()
#         user = user_data.user
#         token = Token.objects.get_or_create(user=user)[0]

#         return Response({
#             'is_verified':user_data.is_verified,
#             'token':token.key,
#             'email':user.email
#         })
#     return Response({
#         'error':True
#     })


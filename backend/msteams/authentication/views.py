# from backend.msteams.authentication.models import userData
# from backend.msteams.authentication.models import userData
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
from fcm_django.models import FCMDevice


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
        # is_verified = user.userData.is_verified
        return Response({
            'token': token.key,
            # 'is_verified':is_verified
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_username(request):
    user=request.user
    return Response({
        'username':user.first_name+" "+user.last_name
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({
        'msg': 'SUCCESS'
    }, status=status.HTTP_200_OK)


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
        user_verification = userData()
        user_verification.user=user
        user_verification.email_uuid=str(uuid.uuid4())
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        user_verification.save()
        send_mail('Email Verification - MS Teams Clone',
        'Hello '+first_name+' '+last_name+' , please click on the link to verify your email: https://www.msteams.games/verify/'+user_verification.email_uuid+'.',
        'msteamsclone@gmail.com',
        [email],
        fail_silently=False
        )
        print(user_verification.email_uuid)
        # token = Token.objects.get_or_create(user=user)[0]
        return Response({
            # 'token': token.key,
            'is_verified':user_verification.is_verified,
            'error':False,
            'message':"Verification has been sent successfully on the registered email ID."
        })


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_email(request):
    email_uuid = request.data.get('email_uuid')
    
    if userData.objects.filter(email_uuid=email_uuid).exists():
        user_data = userData.objects.get(email_uuid=email_uuid)
        user_data.is_verified = True
        user_data.save()
        user = user_data.user
        token = Token.objects.get_or_create(user=user)[0]

        return Response({
            'is_verified':user_data.is_verified,
            'token':token.key,
            'email':user.email
        })
    return Response({
        'error':True
    })


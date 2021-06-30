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
from random import randint

@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = auth.authenticate(username=email, password=password)
    if user is None:
        return Response({
            'msg': 'Enter valid email and password'
        }, status=status.HTTP_200_OK)
    else:
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'token': token.key
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
        otp = randint(100000, 999999)
        send_mail('Email Verification - MS Teams Clone',
        'Hello '+first_name+' '+last_name+' , your OTP for email verification is: '+str(otp)+'. Please use this OTP to use Microsoft Teams Clone services.',
        'msteamsclone@gmail.com',
        [email],
        fail_silently=False
        )
        user = User.objects.create_user(username, email, password)
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'token': token.key,
            'error':False,
            'message':"OTP has been sent successfully on the registered email ID."
        })
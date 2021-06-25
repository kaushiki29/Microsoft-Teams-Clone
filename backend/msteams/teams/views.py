from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib import auth
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
# imports Teams model
from .models import Teams,TeamParticipants
import random
import string
import re

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_team(request):
    # retrives data coming from front end, if not present then equals to None
    team_name = request.data.get('team_name')
    # if authenticated then request.user gives current user else gives annonymous
    user = request.user
    
    team = Teams()
    team.admin = user
    team.team_name = team_name
    team.team_slug = getSlug(team_name)
    team.unique_code = ''.join(random.choices(string.ascii_uppercase +string.digits, k = 8))
    team.save()

    addParticipant(team,user)   

    # sends response to frontend and can be accessed by res.data example res.data.team_name
    return Response({
        'team_name': team.team_name,
        'unique_code': team.unique_code
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_team(request):
    unique_code = request.data.get('unique_code')

    user = request.user
    is_present = Teams.objects.filter(unique_code = unique_code).exists()
    if(is_present):
        team = Teams.objects.get(unique_code = unique_code)
        alreadyPresent = TeamParticipants.objects.filter(user=user).filter(team=team)
        if(alreadyPresent):
            return HttpResponse("Already in the team")
        else:
            addParticipant(team,user)
            return HttpResponse("Team joined")
    else:
        return HttpResponse("No such team present")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_teams(request):
    user = request.user
    teams = TeamParticipants.objects.filter(user = user)
    my_teams=[]
    for t in teams:
        temp = {
            'team_name': t.team.team_name,
            'admin': t.team.admin.first_name,
            # 'unique_code':t.team.unique_code
            'team_slug': t.team.team_slug,
        }
        my_teams.append(temp)
    return Response({
        'my_teams':my_teams
    })



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_permissions(request):
    user=request.user
    team_slug = request.data.get('team_slug')
    has_perm = False
    team = Teams.objects.get(team_slug=team_slug)
    if TeamParticipants.objects.filter(team=team, user=user).exists():
        has_perm=True
    return Response({
        'has_permissions': has_perm,
        'team_slug': team_slug,
        'user_name': user.get_full_name(),
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def invite_member(request):
    user=request.user
    email = request.data.get('email')
    team_slug = request.data.get('team_slug')
    if Teams.objects.filter(team_slug=team_slug, admin=user).exists():
        if User.objects.filter(email=email).exists():
            new_user = User.objects.get(email=email)
            team = Teams.objects.get(team_slug=team_slug)
            if TeamParticipants.objects.filter(user=new_user, team=team).exists():
                return Response({
                    'error': True,
                    'message':"User already added to the team"
                })
            addParticipant(team,new_user)
            return Response({
                'error':False,
                'message':"User added to the team successfully"
            })
        else:
            return Response({
                'error':True,
                'message':"User doesn't exist"
            })
    else:
        return Response({
            'error':True,
            'message':"You do not have the required right to add new User."
        })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_users(request):
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug=team_slug)
    participant= TeamParticipants.objects.filter(team=team)
    all_users=[]
    for t in participant:
        temp = {
            'name':t.user.first_name+ " "+t.user.last_name,
            'email':t.user.email
        }
        all_users.append(temp)
    return Response({
        'all_users': all_users
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_team(request):
    unique_code = request.data.get('unique_code')
    # will return a queryset of all teams whose unique_code = unique_code, .all() shall give all of them
    team = Teams.objects.filter(unique_code = unique_code)
    all_teams = []
    # for traversing a queryset
    for t in team:
        # here t is an object of Teams
        temp ={
            'name': t.team_name,
            # 'unique_code': t.unique_code,
            'team_slug': t.team_slug,
            'admin_name': t.admin.first_name + " " + t.admin.last_name # here t.admin returns an object of User, thus t.admin.email can be used to get the user's email
        }
        # add an team value in the array
        all_teams.append(temp)

    # returns a single team, if more than one or less than 1 team present then will throw error
    team_single = Teams.objects.get(unique_code = unique_code)

    # .exists() checks if a team with given condition is present or not, return True or False
    is_present = Teams.objects.filter(unique_code = unique_code).exists()

    # .get() shall make the queryset to an team object
    team_filter_single = Teams.objects.filter(unique_code = unique_code).get()

    # first() returns first team
    first_team = Teams.objects.filter(unique_code = unique_code).first()

    # last() return last team
    last_team =  Teams.objects.filter(unique_code = unique_code).last()

    # returns last 10 entries from the queryset
    n_teams = Teams.objects.filter(unique_code = unique_code)[:10]

    # returns in ascending order
    ascending_order = Teams.objects.filter(unique_code = unique_code).order_by('created_at')

    # returns in descending order
    descending_order = Teams.objects.filter(unique_code = unique_code).order_by('-created_at')

    # first 10 transtions in descending order 
    ascending_order = Teams.objects.filter(unique_code = unique_code).order_by('-created_at')[:10]

    return Response({
        # return an array of all teams
        'all_teams': all_teams
    })



def addParticipant(team,user):
    participant = TeamParticipants()
    participant.user = user
    participant.team = team
    participant.save()

def getSlug(title):
    title = title.lower()
    title = re.sub('\s+', ' ', title).strip()
    title = title.replace(" ", "-")
    if Teams.objects.filter(team_slug=title).exists():    
        c = Teams.objects.all().last()
        title = title+'-'+str(c.id+1)
    return title

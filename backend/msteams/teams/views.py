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
from .models import TeamTodo, Teams,TeamParticipants
import random
import string
import re


# Create new team

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_team(request):
    team_name = request.data.get('team_name')
    user = request.user
    team = Teams()
    team.admin = user
    team.team_name = team_name
    team.team_slug = getSlug(team_name)
    team.unique_code = ''.join(random.choices(string.ascii_uppercase +string.digits, k = 8))
    team.save()
    addParticipant(team,user)   
    return Response({
        'team_name': team.team_name,
        'unique_code': team.unique_code
    })


# Join an existing team with unique code

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



# Get all the teams for a user


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
            'email':t.team.admin.email,
            'team_slug': t.team.team_slug,
        }
        my_teams.append(temp)
    return Response({
        'my_teams':my_teams,
        'name': user.first_name+" "+user.last_name
    })


# Check authentication of a user to enter a specific team

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_permissions(request):
    user=request.user
    team_slug = request.data.get('team_slug')
    has_perm = False
    team = Teams.objects.get(team_slug=team_slug)
    is_admin=False
    if team.admin == user:
        is_admin=True
    if TeamParticipants.objects.filter(team=team, user=user).exists():
        has_perm=True
    return Response({
        'has_permissions': has_perm,
        'is_admin': is_admin,
        'team_slug': team_slug,
        'user_name': user.get_full_name(),
        'unique_code':team.unique_code
    })

# Add new member in the team

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


# Add tasks

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_todos_teams(request):
    user=request.user
    todo_item = request.data.get('todo_item')
    email_assigned_to = request.data.get('email_assigned_to')
    is_completed = request.data.get('is_completed')
    team_slug = request.data.get('team_slug')
    expected_completion_unix_time = request.data.get('expected_completion_unix_time')
    associated_team = Teams.objects.get(team_slug=team_slug)

    if User.objects.filter(email=email_assigned_to).exists():    
        todo = TeamTodo()
        todo.created_by = user
        todo.todo_item = todo_item
        todo.assigned_to = User.objects.get(email=email_assigned_to)
        todo.expected_completion_unix_time = expected_completion_unix_time
        todo.is_completed = is_completed
        todo.associated_team = associated_team
        todo.save()

        return Response({
            'id':todo.id,
            'created_by':user.email,
            'todo_item': todo_item,
            'is_completed':is_completed,
            'assigned_to':todo.assigned_to.first_name,
            'team_slug': team_slug,
            'expected_time':expected_completion_unix_time
        })
            
    else:
        return Response({
            'error':True,
            'message':"User is not present"
        })



# Fetch all the tasks of the team


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_todos_teams(request):
    user=request.user
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug=team_slug)
    todoList = TeamTodo.objects.filter(associated_team = team)
    pending_todos = []
    completed_todos =[]
    for todo in todoList:
        if todo.completed_by is None:
            temp = {
                'id':todo.id,
                'todo_item':todo.todo_item,
                'created_by':todo.created_by.first_name+" "+todo.created_by.last_name,
                'is_completed':todo.is_completed,
                'assigned_to':todo.assigned_to.first_name+" "+todo.assigned_to.last_name,
                'expected_time':todo.expected_completion_unix_time
            }
            pending_todos.append(temp)
        else:
            temp = {
                'id':todo.id,
                'todo_item':todo.todo_item,
                'created_by':todo.created_by.first_name+" "+todo.created_by.last_name,
                'is_completed':todo.is_completed,
                'completed_by':todo.completed_by.first_name+" "+todo.completed_by.last_name,
                'assigned_to':todo.assigned_to.first_name+" "+todo.assigned_to.last_name,
                'expected_time':todo.expected_completion_unix_time
            }
            completed_todos.insert(0,temp)
    return Response({
        'pending_todos':pending_todos,
        'completed_todos': completed_todos
    })
    

# Delete a task


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_todo(request):
    user=request.user
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug=team_slug)
    id=request.data.get('id')
    todo = TeamTodo.objects.get(id=id)
    if team.admin==user:
        todo.delete()
        return Response({
            'error':False,
            'message':"Todo deleted successfully."
        })
    else:
        return Response({
            'error':True,
            'message':"You are not authorized to delete the task"
        })


# Mark a task as completed


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def todo_completed(request):
    user=request.user
    id= request.data.get('id')
    if TeamTodo.objects.filter(id=id).exists():
        todo = TeamTodo.objects.get(id=id)
        todo.completed_by = user
        todo.is_completed = True
        todo.save()
        return Response({
            'completed_by':user.first_name+" "+user.last_name,
            'is_completed':todo.is_completed,
            'todo_item':todo.todo_item
        })
    else:
        return Response({
            'error':True,
            'message':"Task has been deleted already."
        })


# Get all users of the team


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

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def get_team(request):
#     unique_code = request.data.get('unique_code')
#     # will return a queryset of all teams whose unique_code = unique_code, .all() shall give all of them
#     team = Teams.objects.filter(unique_code = unique_code)
#     all_teams = []
#     # for traversing a queryset
#     for t in team:
#         # here t is an object of Teams
#         temp ={
#             'name': t.team_name,
#             # 'unique_code': t.unique_code,
#             'team_slug': t.team_slug,
#             'admin_name': t.admin.first_name + " " + t.admin.last_name # here t.admin returns an object of User, thus t.admin.email can be used to get the user's email
#         }
#         # add an team value in the array
#         all_teams.append(temp)

#     # returns a single team, if more than one or less than 1 team present then will throw error
#     team_single = Teams.objects.get(unique_code = unique_code)

#     # .exists() checks if a team with given condition is present or not, return True or False
#     is_present = Teams.objects.filter(unique_code = unique_code).exists()

#     # .get() shall make the queryset to an team object
#     team_filter_single = Teams.objects.filter(unique_code = unique_code).get()

#     # first() returns first team
#     first_team = Teams.objects.filter(unique_code = unique_code).first()

#     # last() return last team
#     last_team =  Teams.objects.filter(unique_code = unique_code).last()

#     # returns last 10 entries from the queryset
#     n_teams = Teams.objects.filter(unique_code = unique_code)[:10]

#     # returns in ascending order
#     ascending_order = Teams.objects.filter(unique_code = unique_code).order_by('created_at')

#     # returns in descending order
#     descending_order = Teams.objects.filter(unique_code = unique_code).order_by('-created_at')

#     # first 10 transtions in descending order 
#     ascending_order = Teams.objects.filter(unique_code = unique_code).order_by('-created_at')[:10]

#     return Response({
#         # return an array of all teams
#         'all_teams': all_teams
#     })



# Add participant in a team

def addParticipant(team,user):
    participant = TeamParticipants()
    participant.user = user
    participant.team = team
    participant.save()


# Get team slug

def getSlug(title):
    title = title.lower()
    title = re.sub('\s+', ' ', title).strip()
    title = title.replace(" ", "-")
    if Teams.objects.filter(team_slug=title).exists():    
        c = Teams.objects.all().last()
        title = title+'-'+str(c.id+1)
    return title


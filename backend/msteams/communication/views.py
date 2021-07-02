from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib import auth
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

from .models import Videocall,VideoCallParticipant,Message,UserMailbox,ChatUUID, P2PVideocall
from time import time
from teams.models import Teams, TeamParticipants
import random
import string
import re
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from twilio.rest import Client
from django.conf import settings
import uuid 
from django.db.models import Q
from fcm_django.models import FCMDevice

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_call(request):
    team_slug = request.data.get('team_slug')
    name = request.data.get('name')
    team = Teams.objects.get(team_slug=team_slug)
    user = request.user
    
    videocall = Videocall()
    videocall.unique_code = ''.join(random.choices(string.ascii_uppercase +string.digits, k = 15))
    videocall.meeting_slug = getSlug(name)
    videocall.team_associated = team
    videocall.name = name
    videocall.is_active = True
    videocall.is_scheduled=False
    videocall.schedule_time=0
    videocall.schedule_duration=30
    videocall.started_at = time()*1000
    videocall.is_completed = False
    videocall.s_id = create_twilio_call(videocall.meeting_slug)
    videocall.save()  
    
    add_video_call_participant(user,videocall,0)
    # sends response to frontend and can be accessed by res.data example res.data.team_name
    return Response({
        'meeting_slug': videocall.meeting_slug,
        'name': videocall.name,
        'sid': videocall.s_id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_p2p_call(request):
    username = request.data.get('username')
    other_user = User.objects.get(username = username)
    user = request.user
    videocall = P2PVideocall()
    thread_id = ChatUUID.objects.get(Q(user_a = user, user_b = other_user)| Q(user_a = other_user,user_b = user)).thread_id
    videocall.meeting_slug = getP2PSlug(thread_id)
    videocall.user_a = user
    videocall.user_b = other_user
    videocall.is_active = True
    videocall.started_at = time()*1000
    videocall.is_completed = False
    videocall.s_id = create_twilio_call(videocall.meeting_slug)
    videocall.save()

    call(other_user,user, videocall.meeting_slug)
    
    # add_video_call_participant(user,videocall,0)
    # sends response to frontend and can be accessed by res.data example res.data.team_name
    return Response({
        'meeting_slug': videocall.meeting_slug,
        'sid': videocall.s_id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def schedule_call(request):
    team_slug = request.data.get('team_slug')
    name = request.data.get('name')
    schedule_time = request.data.get('schedule_time')
    team = Teams.objects.get(team_slug=team_slug)
    user = request.user
    
    videocall = Videocall()
    videocall.unique_code = ''.join(random.choices(string.ascii_uppercase +string.digits, k = 15))
    videocall.team_associated = team
    videocall.name = name
    videocall.meeting_slug = getSlug(name)
    videocall.is_active = False
    videocall.is_scheduled= True
    videocall.schedule_time= schedule_time
    videocall.schedule_duration=30
    videocall.started_at = time()*1000
    videocall.save()

    # add_video_call_participant(user,videocall,"HOST")

    # sends response to frontend and can be accessed by res.data example res.data.team_name
    return Response({
        'meeting_slug': videocall.meeting_slug,
        'name':videocall.name,
        'schedule_time':videocall.schedule_time
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_scheduled_calls(request):
    user = request.user
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug=team_slug)
    calls = Videocall.objects.filter(team_associated=team)
    scheduled_calls = []

    for c in calls:
        if c.is_active == False and c.is_scheduled==True and c.is_completed==False:
            temp={
                'meeting_slug':c.meeting_slug,
                'name':c.name,
                'time':c.schedule_time
            }
            scheduled_calls.append(temp)
    return Response({
        'scheduled_calls':scheduled_calls
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_call(request):
    user=request.user
    meeting_slug = request.data.get('meeting_slug')
    meeting = Videocall.objects.get(meeting_slug=meeting_slug)
    meeting.delete()

    return Response({
        'error':False,
        'message':"Call deleted successfully"
    })
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_calls(request):
    team_slug = request.data.get('team_slug')
    
    team = Teams.objects.get(team_slug=team_slug)
    user = request.user
    
    videocall = Videocall.objects.filter(team_associated = team).filter(is_scheduled = False).filter(is_completed = False).filter(is_active = True)
    my_calls=[]
    for t in videocall:
        temp = {
            'name': t.name,
            'team_slug':t.team_associated.team_slug,
            'meeting_unique_code':t.unique_code,
            'meeting_slug': t.meeting_slug,
            'is_active': t.is_active,
            'started_at': t.started_at,
        }
        my_calls.append(temp)

    return Response({
        'my_calls':my_calls,
        'team_name': team.team_name
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_permissions(request):
    user = request.user
    meeting_slug = request.data.get('meeting_slug')
    videocall = Videocall.objects.get(meeting_slug = meeting_slug)
    team = videocall.team_associated
    has_perm = False
    if TeamParticipants.objects.filter(user = user, team = team).exists():
        has_perm = True
    return Response({
        'has_permissions': has_perm,
        'team_slug': team.team_slug,
        'user_name': user.get_full_name(),
        'meeting_name': videocall.name
    })



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_twilio_token(request):
    user = request.user
    meeting_slug = request.data.get('meeting_slug')
    if not Videocall.objects.filter(meeting_slug = meeting_slug).exists():
        return Response({
            'error': True,
            'error_msg': "Invalid video call link"
        })
    videocall = Videocall.objects.get(meeting_slug = meeting_slug)
    team = videocall.team_associated
    if not TeamParticipants.objects.filter(user = user, team = team).exists():
        return Response({
            'error': True,
            'error_msg': "You are not authorized to access this call"
        })
    try:
        if check_room_status(meeting_slug) == 'completed':
            return Response({
                'error': True,
                'error_msg': "The meeting has already ended"
            })
    except:
        return Response({
            'error': True,
            'error_msg': "The meeting has already ended"
        })
    identity = user.get_full_name() + "!!!" + user.username

    # Create access token with credentials
    token = AccessToken(settings.ACCOUNT_SID, settings.API_KEY, settings.API_SECRET, identity=identity)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room=meeting_slug)
    token.add_grant(video_grant)

    # Return token info as JSON
    print(token.to_jwt())
    return Response({
        'error': False,
        'access_token': token.to_jwt(),
        'user_name': user.get_full_name(),
        'team_slug': team.team_slug
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_p2p_twilio_token(request):
    user = request.user
    meeting_slug = request.data.get('meeting_slug')
    if not P2PVideocall.objects.filter(meeting_slug = meeting_slug).exists():
        return Response({
            'error': True,
            'error_msg': "Invalid video call link"
        })
    videocall = P2PVideocall.objects.get(meeting_slug = meeting_slug)
    user_a  =videocall.user_a
    user_b = videocall.user_b
    if user_a != user and user_b != user:
        return Response({
            'error': True,
            'error_msg': "You are not authorized to access this call"
        })
    try:
        if check_room_status(meeting_slug) == 'completed':
            return Response({
                'error': True,
                'error_msg': "The meeting has already ended"
            })
    except:
        return Response({
            'error': True,
            'error_msg': "The meeting has already ended"
        })
    identity = user.get_full_name() + "!!!" + user.username

    # Create access token with credentials
    token = AccessToken(settings.ACCOUNT_SID, settings.API_KEY, settings.API_SECRET, identity=identity)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room=meeting_slug)
    token.add_grant(video_grant)

    # Return token info as JSON
    print(token.to_jwt())
    return Response({
        'error': False,
        'access_token': token.to_jwt(),
        'user_name': user.get_full_name(),
        'thread_id': ChatUUID.objects.get(Q(user_a = user_a, user_b = user_b)| Q(user_a = user_b,user_b = user_a)).thread_id
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def init_chat(request):
    user = request.user

    receiver_username = request.data.get('receiver_username')
    print(receiver_username)
    receiver = User.objects.get(username = receiver_username)
    chat_id = ChatUUID.objects.filter(Q(user_a = user, user_b = receiver)| Q(user_a = receiver,user_b = user))
    if chat_id.exists():
        chatuuid = chat_id.get()
        return Response({
            'thread_id': chatuuid.thread_id,
        })
    chatuuid = ChatUUID()
    chatuuid.user_a = user
    chatuuid.user_b = receiver
    chatuuid.thread_id = str(uuid.uuid4())
    chatuuid.save()

    return Response({
        'thread_id': chatuuid.thread_id,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    user = request.user

    msg_text = request.data.get('msg_text')
    thread_id = request.data.get('thread_id')
    thread_uuid = ChatUUID.objects.get(thread_id = thread_id)
    if user == thread_uuid.user_a:
        receiver = thread_uuid.user_b
    else:
        receiver = thread_uuid.user_a
    sender = user

    message = Message()
    message.sender = sender
    message.msg_text = msg_text
    message.type = 'txt'
    message.save()

    # if ChatUUID.objects.filter(Q(user_a = sender, user_b = receiver) | Q(user_a = receiver, user_b = sender)).exists():
    #     thread_uuid = ChatUUID.objects.get(Q(user_a = sender, user_b = receiver) | Q(user_a = receiver, user_b = sender))
    # else:
    #     chatuuid = ChatUUID()
    #     chatuuid.user_a = sender
    #     chatuuid.user_b = receiver
    #     chatuuid.thread_id = str(uuid.uuid4())
    #     chatuuid.save()
    #     thread_uuid = chatuuid

    new_mailbox_for_sender = UserMailbox()
    new_mailbox_for_sender.mail_box_user = sender
    new_mailbox_for_sender.message = message
    new_mailbox_for_sender.thread_id = thread_uuid
    new_mailbox_for_sender.has_seen = True
    new_mailbox_for_sender.save()

    new_mailbox_for_receiver = UserMailbox()
    new_mailbox_for_receiver.mail_box_user = receiver
    new_mailbox_for_receiver.message = message
    new_mailbox_for_receiver.thread_id = thread_uuid
    new_mailbox_for_receiver.has_seen = False
    new_mailbox_for_receiver.save()

    return Response({
        'msg': 'message sent successfully'
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_img(request):
    user = request.user

    img = request.data.get('img')
    thread_id = request.data.get('thread_id')
    thread_uuid = ChatUUID.objects.get(thread_id = thread_id)
    if user == thread_uuid.user_a:
        receiver = thread_uuid.user_b
    else:
        receiver = thread_uuid.user_a
    sender = user

    message = Message()
    message.sender = sender
    message.img = img
    message.type = 'img'
    message.save()

    # if ChatUUID.objects.filter(Q(user_a = sender, user_b = receiver) | Q(user_a = receiver, user_b = sender)).exists():
    #     thread_uuid = ChatUUID.objects.get(Q(user_a = sender, user_b = receiver) | Q(user_a = receiver, user_b = sender))
    # else:
    #     chatuuid = ChatUUID()
    #     chatuuid.user_a = sender
    #     chatuuid.user_b = receiver
    #     chatuuid.thread_id = str(uuid.uuid4())
    #     chatuuid.save()
    #     thread_uuid = chatuuid

    new_mailbox_for_sender = UserMailbox()
    new_mailbox_for_sender.mail_box_user = sender
    new_mailbox_for_sender.message = message
    new_mailbox_for_sender.thread_id = thread_uuid
    new_mailbox_for_sender.has_seen = True
    new_mailbox_for_sender.save()

    new_mailbox_for_receiver = UserMailbox()
    new_mailbox_for_receiver.mail_box_user = receiver
    new_mailbox_for_receiver.message = message
    new_mailbox_for_receiver.thread_id = thread_uuid
    new_mailbox_for_receiver.has_seen = False
    new_mailbox_for_receiver.save()

    return Response({
        'msg': 'image sent successfully',
        'imgUrl': message.img.url,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_all_threads(request):
    user = request.user
    chatuuid = ChatUUID.objects.filter(Q(user_a = user) | Q(user_b = user))
    all_uuid = []
    for i in chatuuid:
        if i.user_a == user:
            other_user = i.user_b
        else:
            other_user = i.user_a
        unseen_messages = UserMailbox.objects.filter(thread_id = i, has_seen = False)
        uid = {
            'thread_id': i.thread_id,
            'other_user': other_user.username,
            'other_user_name': other_user.get_full_name(),
            'active': False,
            'has_unseen_messages': unseen_messages.exists(),
            'unseen_messages_count': unseen_messages.count()
        }
        all_uuid.append(uid)
    
    return Response({
        'all_uuid': all_uuid
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_thread_messages(request):
    user = request.user
    thread_id = request.data.get('thread_id')
    thread_msgs = UserMailbox.objects.filter(thread_id__thread_id = thread_id, mail_box_user = user)
    chatuuid = ChatUUID.objects.get(thread_id = thread_id)
    if chatuuid.user_a == user:
        otheruser = chatuuid.user_b
    else:
        otheruser = chatuuid.user_a
    all_msgs = []
    for msg in thread_msgs:
        sender = msg.message.sender
        m = {
            'sender_name': sender.get_full_name(),
            'sent_time': msg.message.created_at,
            'msg_text': msg.message.msg_text,
            'type': 'other' if sender == otheruser else "",
            'type1': msg.message.type,
            'img': msg.message.img.url if msg.message.img else '',
        }
        all_msgs.append(m)
    
    return Response({
        'all_msgs': all_msgs,
        'name': otheruser.get_full_name(),
        'username': otheruser.username
    })





def getSlug(title):
    title = title.lower()
    title = re.sub('\s+', ' ', title).strip()
    title = title.replace(" ", "-")
    if Videocall.objects.filter(meeting_slug=title).exists():    
        c = Videocall.objects.all().last()
        title = title+'-'+str(c.id+1)
    return title

def getP2PSlug(title):
    title = str(title)
    title = title.lower()
    title = re.sub('\s+', ' ', title).strip()
    title = title.replace(" ", "-")
    if P2PVideocall.objects.filter(meeting_slug=title).exists():    
        c = P2PVideocall.objects.all().last()
        title = title+'-'+str(c.id+1)
    return title


@api_view(["POST"])
@permission_classes([AllowAny])
def test(request):
    account_sid = settings.ACCOUNT_SID
    api_key = 'SK7fa5856d06ccc974ebed83bd84aab5a6'
    api_secret = 'gnLM14bTiDBhMJr3t7FTWpWV3SEdIvdN'
    identity = "utkarsh"

    # Create access token with credentials
    token = AccessToken(account_sid, api_key, api_secret, identity=identity)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room="test-meet")
    # print(str(video_grant))
    token.add_grant(video_grant)


    # account_sid = account_sid
    auth_token = "6442f6f5975efd64445ca4e405c242ff"
    print(auth_token)
    client = Client(account_sid, auth_token)
    # print(str(client.video.rooms.create()))
    room = client.video.rooms.create(unique_name='DailyStandup1')
    # room = client.video.rooms('DailyStandup').fetch()
    print(room.end_time)
    # Return token info as JSON
    # print(token.to_jwt())
    return Response({
        'error': False,
        'access_token': token.to_jwt(),
    })

def add_video_call_participant(user,videocall,role):
    if VideoCallParticipant.objects.filter(user = user, call=videocall).exists():
        return
    participant = VideoCallParticipant()
    participant.user = user
    participant.call = videocall
    participant.joined_at = time()*1000
    participant.role = role
    participant.in_call = True
    participant.save()
    return

def create_twilio_call(meeting_slug):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    try:
        room = client.video.rooms.create(unique_name=meeting_slug)
    except:
        room = client.video.rooms(meeting_slug).fetch()
    return room.sid


def check_room_status(s_id):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    room = client.video.rooms(s_id).fetch()
    return room.status

def call(other_user,user,slug):
    devices = FCMDevice.objects.filter(user = other_user)
    title = "Incoming call from " + user.get_full_name()
    devices.send_message(title=title, data={
        'person': user.get_full_name(),
        'type': 'call',
        'uuid': slug,
    })
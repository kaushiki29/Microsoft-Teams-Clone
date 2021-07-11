from django.core.checks import messages
from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib import auth
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Videocall,VideoCallParticipant,Message,UserMailbox,ChatUUID, P2PVideocall, TeamMailBox, VideoCallMailBox
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



# API to initiate new group videocall


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


# Api to initiate peer to peer call


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



# Api to schedule a call


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

    return Response({
        'meeting_slug': videocall.meeting_slug,
        'name':videocall.name,
        'schedule_time':videocall.schedule_time
    })


# API to get meeting name


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_meet_name(request):
    meeting_slug = request.data.get('meeting_slug')
    videocall = Videocall.objects.get(meeting_slug=meeting_slug)
    if videocall.is_scheduled==True:
        return Response({
            'name':videocall.name,
            'time':videocall.schedule_time,
            'team_slug':videocall.team_associated.team_slug,
        })
    else:
        return Response({
            'name':videocall.name,
            'time':videocall.started_at,
            'team_slug':videocall.team_associated.team_slug,
        })



# API to fetch all the scheduled calls


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_scheduled_calls(request):
    user = request.user
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug=team_slug)
    calls = Videocall.objects.filter(team_associated=team).order_by('-created_at')
    scheduled_calls = []
    old_calls = []
    for c in calls:
        if c.is_active == False and c.is_scheduled==True and c.is_completed==False:
            temp={
                'meeting_slug':c.meeting_slug,
                'name':c.name,
                'time':c.schedule_time
            }
            scheduled_calls.append(temp)
    for c in calls:
        if c.is_completed == True:
            temp={
                'meeting_slug':c.meeting_slug,
                'name':c.name,
                'time':c.started_at
            }
            old_calls.append(temp)
    return Response({
        'scheduled_calls':scheduled_calls,
        'old_calls': old_calls
    })



# API to delete a scheduled call


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
    

# API to get all the ongoing
# calls

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



# API to check permission for entering a video call


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



# API to get Twilio token


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


# Api to get twilio token for p2p calls


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


# APi for initiating chat

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


# API for sending message

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message(request):
    user = request.user

    msg_text = request.data.get('msg_text')
    thread_id = request.data.get('thread_id')
    meeting_thread = request.data.get('meeting_thread')
    if meeting_thread is not None:
        call = P2PVideocall.objects.get(meeting_slug = meeting_thread)
        user_a = call.user_a
        user_b = call.user_b
        thread_id = ChatUUID.objects.get(Q(user_a = user_a, user_b = user_b)| Q(user_a = user_b,user_b = user_a)).thread_id
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
    send_msg_notification(receiver,user)
    return Response({
        'msg': 'message sent successfully'
    })



# Api to send image files in chat


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_img(request):
    user = request.user

    img = request.data.get('img')
    thread_id = request.data.get('thread_id')
    meeting_thread = request.data.get('meeting_thread')
    if meeting_thread is not None:
        call = P2PVideocall.objects.get(meeting_slug = meeting_thread)
        user_a = call.user_a
        user_b = call.user_b
        thread_id = ChatUUID.objects.get(Q(user_a = user_a, user_b = user_b)| Q(user_a = user_b,user_b = user_a)).thread_id
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


# APi to get unread messages count

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_unseen_count(request):
    user = request.user
    chatuuid = ChatUUID.objects.filter(Q(user_a = user) | Q(user_b = user))
    count = 0
    for i in chatuuid:
        unseen_messages = UserMailbox.objects.filter(thread_id = i, has_seen = False,mail_box_user = user)
        count+=unseen_messages.count()
    return Response({
        'count': count
    })


# Get all the messages


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
        unseen_messages = UserMailbox.objects.filter(thread_id = i, has_seen = False,mail_box_user = user)
        uid = {
            'thread_id': i.thread_id,
            'other_user': other_user.username,
            'other_user_name': other_user.get_full_name(),
            'active': False,
            'has_unseen_messages': unseen_messages.exists(),
            'unseen_messages_count': unseen_messages.count(),
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
    meeting_thread = request.data.get('meeting_thread')
    if meeting_thread is not None:
        call = P2PVideocall.objects.get(meeting_slug = meeting_thread)
        user_a = call.user_a
        user_b = call.user_b
        thread_id = ChatUUID.objects.get(Q(user_a = user_a, user_b = user_b)| Q(user_a = user_b,user_b = user_a)).thread_id
    thread_msgs = UserMailbox.objects.filter(thread_id__thread_id = thread_id, mail_box_user = user)
    make_seen = UserMailbox.objects.filter(thread_id__thread_id = thread_id, mail_box_user = user, has_seen = False)
    for i in make_seen:
        i.has_seen = True
        i.save()
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
            'has_seen': UserMailbox.objects.get(mail_box_user = otheruser,message = msg.message).has_seen,
            'img': msg.message.img.url if msg.message.img else '',
        }
        all_msgs.append(m)
    
    return Response({
        'all_msgs': all_msgs,
        'name': otheruser.get_full_name(),
        'username': otheruser.username
    })


# Set message as seen

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_msg_seen(request):
    user = request.user
    thread_id = request.data.get('thread_id')
    make_seen = UserMailbox.objects.filter(thread_id__thread_id = thread_id, mail_box_user = user, has_seen = False)
    for i in make_seen:
        i.has_seen = True
        i.save()
    return Response({
        'msg':'SUCCESS'
    })


# Send message in team

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_team_msg(request):
    user = request.user
    msg_text = request.data.get('msg_text')
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug = team_slug)
    message = Message()
    message.msg_text = msg_text
    message.type = 'txt'
    message.img = None
    message.sender = user
    message.save()

    team_mail_box = TeamMailBox()
    team_mail_box.team = team
    team_mail_box.message = message
    team_mail_box.save()
    return Response({
        'msg': 'message sent successfully'
    })


# Fetch all team messages

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_team_msg(request):
    team_slug = request.data.get('team_slug')
    print(team_slug)
    user = request.user
    if not TeamParticipants.objects.filter(user = user, team__team_slug = team_slug).exists():
        return Response({
            'msg': 'You are not authorised for this request'
        })

    team = Teams.objects.get(team_slug=team_slug)
    mail_box = TeamMailBox.objects.filter(team = team)
    all_msgs = []
    for msg in mail_box:
        m = {
            'sender_name': msg.message.sender.get_full_name(),
            'sent_time': msg.message.created_at,
            'msg_text': msg.message.msg_text,
            'type': 'other' if msg.message.sender != user else "",
            'type1': msg.message.type,
            'img': msg.message.img.url if msg.message.img else '',
        }
        all_msgs.append(m)
    return Response({
        'all_msgs': all_msgs,
        'name': user.get_full_name()
    })


# Send image in teams

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_team_img(request):
    user = request.user
    img = request.data.get('img')
    team_slug = request.data.get('team_slug')
    team = Teams.objects.get(team_slug = team_slug)
    message = Message()
    message.msg_text = None
    message.type = 'img'
    message.img = img
    message.sender = user
    message.save()

    team_mail_box = TeamMailBox()
    team_mail_box.team = team
    team_mail_box.message = message
    team_mail_box.save()
    return Response({
        'msg': 'message sent successfully',
        'imgUrl': message.img.url,
    })


# Video call message

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_video_msg(request):
    user = request.user
    msg_text = request.data.get('msg_text')
    meeting_slug = request.data.get('meeting_slug')
    video = Videocall.objects.get(meeting_slug = meeting_slug)
    message = Message()
    message.msg_text = msg_text
    message.type = 'txt'
    message.img = None
    message.sender = user
    message.save()

    video_mail_box = VideoCallMailBox()
    video_mail_box.video = video
    video_mail_box.message = message
    video_mail_box.save()
    return Response({
        'msg': 'message sent successfully'
    })


# Fetch all video call messages

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_video_msg(request):
    meeting_slug = request.data.get('meeting_slug')
    print(meeting_slug)
    user = request.user
    video = Videocall.objects.filter(meeting_slug = meeting_slug)
    if not video.exists():
        return Response({
            'error': True,
            'msg': 'Video call does not exists'
        })
    video = video.get()
    team = video.team_associated
    if not TeamParticipants.objects.filter(user = user, team = team).exists():
        return Response({
            'error': True,
            'msg': 'You are not authorised for this call'
        })

    mail_box = VideoCallMailBox.objects.filter(video = video)
    all_msgs = []
    for msg in mail_box:
        m = {
            'sender_name': msg.message.sender.get_full_name(),
            'sent_time': msg.message.created_at,
            'msg_text': msg.message.msg_text,
            'type': 'other' if msg.message.sender != user else "",
            'type1': msg.message.type,
            'img': msg.message.img.url if msg.message.img else '',
        }
        all_msgs.append(m)
    return Response({
        'all_msgs': all_msgs,
        'name': user.get_full_name()
    })


# Send image in video call chat

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_video_img(request):
    user = request.user
    img = request.data.get('img')
    meeting_slug = request.data.get('meeting_slug')
    video = Videocall.objects.get(meeting_slug = meeting_slug)
    message = Message()
    message.msg_text = None
    message.type = 'img'
    message.img = img
    message.sender = user
    message.save()

    video_mail_box = VideoCallMailBox()
    video_mail_box.video = video
    video_mail_box.message = message
    video_mail_box.save()
    return Response({
        'msg': 'message sent successfully',
        'imgUrl': message.img.url,
    })


# Get slug for video call

def getSlug(title):
    title = title.lower()
    title = re.sub('\s+', ' ', title).strip()
    title = title.replace(" ", "-")
    if Videocall.objects.filter(meeting_slug=title).exists():    
        c = Videocall.objects.all().last()
        title = title+'-'+str(c.id+1)
    return title

# Get p2p video call slug

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


# Add participants to video call

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


# Create Twilio call


def create_twilio_call(meeting_slug):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    try:
        room = client.video.rooms.create(unique_name=meeting_slug)
    except:
        room = client.video.rooms(meeting_slug).fetch()
    return room.sid


# Check video call status

def check_room_status(s_id):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    room = client.video.rooms(s_id).fetch()
    return room.status


# FCM Call Modal


def call(other_user,user,slug):
    devices = FCMDevice.objects.filter(user = other_user)
    title = "Incoming call from " + user.get_full_name()
    devices.send_message(title=title, data={
        'person': user.get_full_name(),
        'type': 'call',
        'uuid': slug,
    })

# New message notification in FCM

def send_msg_notification(other_user,user):
    devices = FCMDevice.objects.filter(user = other_user)
    title = "Message from " + user.get_full_name()
    devices.send_message(title=title, data={
        'type': 'msg',
    })
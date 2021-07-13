# from backend.msteams.teams.models import Teams
# from backend.msteams.teams.models import TeamTodo
from celery import Celery
import time
from django.core.mail import send_mail
from communication.models import Videocall,VideoCallParticipant
from teams.models import Teams, TeamParticipants, TeamTodo
app = Celery('tasks', broker='redis://localhost')

# from celery.decorators import task
from twilio.rest import Client
from django.conf import settings 


@app.task
def test():
    print("running")

    return "running"


@app.task
def clear_video_calls():
    call = Videocall.objects.filter(is_completed = False).exclude(s_id__isnull = True)
    for c in call:
        try:
            status = get_status(c.s_id)
            if status == 'completed':
                c.is_completed = True
                c.is_active = False
                c.save()
        except:
            c.is_completed = True
            c.is_active = False
            c.save()
    return "Ran successfully" 
   

@app.task
def meeting_reminder():
    calls = Videocall.objects.filter(is_scheduled= True, schedule_time__lt = time.time()*1000 + 900000, reminder=False)
    teams = []
    for c in calls:
        team = c.team_associated
        c.reminder = True
        c.save()
        teams.append(team)
    for t in teams:
        participants = TeamParticipants.objects.filter(team = t)
        for p in participants:
            email = p.user.email
            send_mail('Meeting reminder!',
            'Hello '+p.user.first_name+' '+p.user.last_name+', you have a meeting scheduled in less than 15 minutes in your team named '+p.team.team_name+'. Please be on time',
            'msteamsclone@gmail.com',
            [email],
            fail_silently=False
            )
    return "Reminder sent successfully"


@app.task
def start_meeting():
    calls = Videocall.objects.filter(is_scheduled = True, schedule_time__lt = time.time()*1000)
    for c in calls:
        c.is_active = True
        c.started_at = c.schedule_time
        c.is_scheduled = False
        c.s_id = create_twilio_call(c.meeting_slug)
        c.save()
    return "Scheduled call changed to Active call successfully"



@app.task
def task_reminder():
    tasks = TeamTodo.objects.filter(is_completed=False, expected_completion_unix_time__lt = time.time()*1000+43200000, reminder=False)
    for t in tasks:
        email = t.assigned_to.email
        team = t.associated_team.team_name
        t.reminder = True
        t.save()
        created_by = t.created_by.first_name+" "+t.created_by.last_name
        send_mail('Task Deadline Approaching!',
            'Hello '+t.assigned_to.first_name+' '+t.assigned_to.last_name+', this is a gentle reminder of the task deadline created by '+created_by+' in the team named '+team+'. Your task deadline is in less than 12 hours.',
            'msteamsclone@gmail.com',
            [email],
            fail_silently=False
            )
    return "Task reminder mail sent successfully"



def get_status(s_id):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    room = client.video.rooms(s_id).fetch()
    return room.status
    
def create_twilio_call(meeting_slug):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    try:
        room = client.video.rooms.create(unique_name=meeting_slug)
    except:
        room = client.video.rooms(meeting_slug).fetch()
    return room.sid


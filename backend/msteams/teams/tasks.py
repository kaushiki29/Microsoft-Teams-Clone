from celery import Celery
from communication.models import Videocall
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
   

def get_status(s_id):
    client = Client(settings.ACCOUNT_SID, settings.ORIGINAL_AUTH_TOKEN)
    room = client.video.rooms(s_id).fetch()
    return room.status
    

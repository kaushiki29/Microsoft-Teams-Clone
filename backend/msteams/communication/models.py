from enum import unique
from django.db import models
from django.contrib.auth.models import User
from teams.models import Teams
import uuid
from teams.models import Teams
# Create your models here.

class ChatUUID(models.Model):
    user_a = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user_a")
    user_b = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user_b")
    thread_id = models.UUIDField(default = uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
    msg_text = models.TextField(null=True)
    sender = models.ForeignKey(User,on_delete=models.CASCADE, related_name="sender")
    img = models.FileField(null=True)
    type = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserMailbox(models.Model):
    mail_box_user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    thread_id = models.ForeignKey(ChatUUID, on_delete=models.CASCADE)
    has_seen = models.BooleanField(null=True, blank=True, default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

class TeamMailBox(models.Model):
    team = models.ForeignKey(Teams, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Videocall(models.Model):
    unique_code = models.CharField(max_length=50)
    meeting_slug = models.CharField(max_length=100)
    team_associated = models.ForeignKey(Teams, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=False)
    reminder = models.BooleanField(default=False)
    started_at = models.BigIntegerField()
    is_scheduled = models.BooleanField(default=False)
    schedule_time = models.BigIntegerField()
    schedule_duration = models.IntegerField()
    is_completed= models.BooleanField(default=False)
    s_id = models.CharField(max_length=500, blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class VideoCallMailBox(models.Model):
    video = models.ForeignKey(Videocall, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class VideoCallParticipant(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    call = models.ForeignKey(Videocall,on_delete=models.CASCADE)
    joined_at = models.BigIntegerField()
    role = models.IntegerField()
    in_call = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class P2PVideocall(models.Model):
    meeting_slug = models.CharField(max_length=100)
    user_a = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user_c")
    user_b = models.ForeignKey(User,on_delete=models.CASCADE, related_name="user_d")
    is_active = models.BooleanField(default=False)
    started_at = models.BigIntegerField()
    is_completed= models.BooleanField(default=False)
    s_id = models.CharField(max_length=500, blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
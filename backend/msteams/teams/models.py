from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Teams(models.Model):
    unique_code = models.CharField(max_length=50)
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    team_slug = models.CharField(max_length=100)
    team_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TeamParticipants(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Teams, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TeamTodo(models.Model):
    todo_item = models.CharField(max_length=500)
    created_by = models.ForeignKey(User,on_delete=models.CASCADE, related_name="created_by")
    expected_completion_unix_time = models.BigIntegerField()
    reminder = models.BooleanField(default=False)
    associated_team = models.ForeignKey(Teams,on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User,on_delete=models.CASCADE,null=True,related_name="assigned_to")
    completed_by = models.ForeignKey(User,on_delete=models.CASCADE,null=True,related_name="completed_by")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

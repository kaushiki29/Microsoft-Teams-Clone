from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class userData(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(null=True,blank=True,max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


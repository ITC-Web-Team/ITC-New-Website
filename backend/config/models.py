from django.db import models
from minio_storage.storage import MinioMediaStorage

#----------- Clubs, Tech Team and Other Bodies
class Body(models.Model):
  name = models.CharField(max_length=100)
  type = models.IntegerField(choices=[(0, 'CLUBS'), (1, 'TECH TEAM'), (2, 'COMMUNITY')])
  short_description = models.CharField(max_length=100)
  description = models.TextField()
  contact_email = models.EmailField()
  instagram = models.URLField(blank=True, null=True)
  facebook = models.URLField(blank=True, null=True)
  github = models.URLField(blank=True, null=True)
  linkedin = models.URLField(blank=True, null=True)
  website = models.URLField(blank=True, null=True)
  logo = models.ImageField(
    upload_to='logos/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True,
    default='logos/default_logo.png'
  )

  def __str__(self):
    return self.name

  def get_logo_url(self):
    if self.logo:
      try:
        return self.logo.url
      except:
        return 'https://avatar.iran.liara.run/public'
    return 'https://avatar.iran.liara.run/public'

class Member(models.Model):
  body = models.ForeignKey('Body', on_delete=models.CASCADE)
  name = models.CharField(max_length=100)
  position = models.CharField(max_length=100)
  priority = models.IntegerField(default=0)
  image = models.ImageField(
    upload_to='members/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )

  def __str__(self):
    return self.name + ' - ' + self.position

  def get_image_url(self):
    if self.image:
      try:
        return self.image.url
      except:
        return 'https://avatar.iran.liara.run/public'
    return 'https://avatar.iran.liara.run/public'
  
#----------- Achievements 
class Achievement (models.Model):
  body = models.ForeignKey('Body', on_delete=models.CASCADE)
  date = models.DateField()
  title = models.CharField(max_length=100)
  description = models.TextField()

  def __str__(self):
    return self.title


#----------- Portals and TechStacks 
class Portal(models.Model):
  name = models.CharField(max_length=100)
  description = models.TextField()
  link = models.URLField()
  banner = models.ImageField(
    upload_to='banners/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )
  techstacks = models.ManyToManyField('TechStack')

  def __str__(self):
    return self.name
  
class TechStack(models.Model):
  name = models.CharField(max_length=100)
  logo = models.ImageField(
    upload_to='techstack/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )

  def get_logo_url(self):
    if self.logo:
      return self.logo.url
    return None

  def __str__(self):
    return self.name
  
# -------- cabinet and contacts
class Cabinet(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    priority = models.IntegerField(default=0)
    image = models.ImageField(
        upload_to='cabinet/',
        storage=MinioMediaStorage(),
        blank=True,
        null=True
    )
    email = models.EmailField(blank=True, null=True)  
    phone = models.CharField(max_length=15, blank=True, null=True)  
    linkedin = models.URLField(blank=True, null=True) 
    instagram = models.URLField(blank=True, null=True)  
    facebook = models.URLField(blank=True, null=True)  

    def __str__(self):
        return f'{self.name} - {self.position}'

    def get_image_url(self):
        if self.image:
            return self.image.url
        return 'https://avatar.iran.liara.run/public'


#-----------  WorkReports

class WorkReport(models.Model):
  title = models.CharField(max_length=100)
  image = models.ImageField(
    upload_to='workreports/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )
  url = models.URLField()

  def __str__(self):
    return self.title
  

#-----------  Hall of Fame

class InterIIT(models.Model):
  logo = models.ImageField(
    upload_to='interiit/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )
  year = models.IntegerField(null=True)
  title = models.CharField(max_length=100)
  subtitle = models.CharField(max_length=100, blank=True)
  description = models.TextField()
  img = models.ImageField(
    upload_to='interiit/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )
  gold = models.IntegerField(default=0)
  silver = models.IntegerField(default=0)
  bronze = models.IntegerField(default=0)  

  def __str__(self):
    return self.title
  

class ProblemStatements(models.Model):
  interiit = models.ForeignKey('InterIIT', on_delete=models.CASCADE)
  title = models.CharField(max_length=100)
  position = models.IntegerField(default=0)

  def __str__(self):
    return self.title
  

class Gallery(models.Model):
  title = models.CharField(max_length=100)
  image = models.ImageField(
    upload_to='gallery/',
    storage=MinioMediaStorage(),
    blank=True,
    null=True
  )

  def __str__(self):
    return self.title
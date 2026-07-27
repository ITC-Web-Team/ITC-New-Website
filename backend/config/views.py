from django.shortcuts import render, get_object_or_404
from .models import Body, Member, Achievement, Portal, TechStack, Cabinet, WorkReport, InterIIT, ProblemStatements, Gallery
from collections import defaultdict

def home(request):
    workreports = WorkReport.objects.all().order_by('-title').reverse()
    gallery = Gallery.objects.all()
    
    # Get all bodies with logos
    clubs = Body.objects.filter(type=0, logo__isnull=False)
    techteams = Body.objects.filter(type=1, logo__isnull=False)
    communities = Body.objects.filter(type=2, logo__isnull=False)
    
    # Get recent achievements (last 6)
    recent_achievements = Achievement.objects.all().order_by('-date')[:6]
    
    # Get latest Inter IIT results
    latest_interiit = InterIIT.objects.all().order_by('-year').first()
    if latest_interiit:
        latest_problemstatements = ProblemStatements.objects.filter(interiit=latest_interiit)
    else:
        latest_problemstatements = None
    
    context = {
        'workreports': workreports,
        'gallery': gallery,
        'clubs': clubs,
        'techteams': techteams,
        'communities': communities,
        'recent_achievements': recent_achievements,
        'latest_interiit': latest_interiit,
        'latest_problemstatements': latest_problemstatements,
    }
    return render(request, 'home.html', context)

def clubs_list(request):
    clubs = Body.objects.filter(type=0).order_by('name')
    return render(request, 'body_list.html', {
        'bodies': clubs, 
        'type': 'CLUBS',
        'seo_title': 'IITB Tech Clubs | Innovative Student Organizations',
        'seo_description': 'Discover the diverse and dynamic tech clubs at IIT Bombay. From coding to robotics, explore student-led technical communities.',
        'seo_keywords': 'IITB Clubs, Tech Clubs, Student Organizations, IIT Bombay Clubs'
    })

def techteam_list(request):
    techteam = Body.objects.filter(type=1).order_by('name')
    return render(request, 'body_list.html', {
        'bodies': techteam, 
        'type': 'TECH TEAMS',
        'seo_title': 'IITB Tech Teams | Cutting-Edge Technical Innovation',
        'seo_description': 'Explore the innovative tech teams at IIT Bombay driving technological advancements and solving real-world challenges.',
        'seo_keywords': 'IITB Tech Teams, Technical Innovation, Student Projects'
    })

def otherbodies_list(request):
    otherbodies = Body.objects.filter(type=2).order_by('name')
    return render(request, 'body_list.html', {'bodies': otherbodies , 'type': 'COMMUNITIES'})

def body_detail(request, name):
    body = get_object_or_404(Body, name=name)
    members = Member.objects.filter(body=body)
    return render(request, 'body_detail.html', {'body': body, 'members': members})

def portal_list(request):
    portals = Portal.objects.all().order_by('name')
    return render(request, 'portal_list.html', {
        'portals': portals,
        'seo_title': 'IITB Tech Portals | Digital Platforms by Tech Council',
        'seo_description': 'Discover the digital platforms and web applications developed by IIT Bombay Tech Council students.',
        'seo_keywords': 'IITB Portals, Student Web Applications, Tech Projects'
    })

def achievement_list(request):
    bodylist = Body.objects.all()
    selected_body = request.GET.get('body', '')
    
    if selected_body:
        achievements = Achievement.objects.filter(body__name=selected_body)
    else:
        achievements = Achievement.objects.all()
    
    achievements_by_year = defaultdict(list)
    for achievement in achievements.order_by('-date'):
        achievements_by_year[achievement.date.year].append(achievement)
    
    sorted_achievements = dict(sorted(achievements_by_year.items(), reverse=True))
    
    context = {
        'achievements_by_year': sorted_achievements,
        'bodylist': bodylist,
        'selected_body': selected_body,
    }
    return render(request, 'achievements.html', context)

def achievement_detail(request, name):
    body = get_object_or_404(Body, name = name)    
    achievements = Achievement.objects.filter(body=body)

    bodylist = Achievement.objects.all()
    return render(request, 'achievement_list.html', {'achievements': achievements, 'bodylist': bodylist})

def halloffame(request):
    interiit_list = InterIIT.objects.all().order_by('year').reverse()
    problemstatements = ProblemStatements.objects.all()
    data = []
    for i in interiit_list:
        data.append({
            'interiit': i,
            'problemstatements': problemstatements.filter(interiit=i)
        } )

    return render(request, 'halloffame.html', {'data': data})

def contact(request):
    cabinet = Cabinet.objects.all()
    return render(request, 'contact.html', {'cabinet': cabinet})

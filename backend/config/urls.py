from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import home, clubs_list, techteam_list, otherbodies_list, body_detail, portal_list, achievement_list, achievement_detail, halloffame, contact, health_check
from .api import (
    BodyViewSet, MemberViewSet, AchievementViewSet, PortalViewSet,
    TechStackViewSet, CabinetViewSet, InterIITViewSet,
    ProblemStatementsViewSet, GalleryViewSet, WorkReportViewSet
)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from .sitemaps import StaticViewSitemap
from django.http import HttpResponse

# Setup DRF Router
router = DefaultRouter()
router.register(r'bodies', BodyViewSet, basename='body')
router.register(r'members', MemberViewSet, basename='member')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'portals', PortalViewSet, basename='portal')
router.register(r'techstacks', TechStackViewSet, basename='techstack')
router.register(r'cabinet', CabinetViewSet, basename='cabinet')
router.register(r'interiit', InterIITViewSet, basename='interiit')
router.register(r'problemstatements', ProblemStatementsViewSet, basename='problemstatement')
router.register(r'gallery', GalleryViewSet, basename='gallery')
router.register(r'workreports', WorkReportViewSet, basename='workreport')

sitemaps = {
    'static': StaticViewSitemap,
}

def robots_txt(request):
    content = "User-agent: *\nDisallow: /admin/\nSitemap: https://tech-iitb.org/sitemap.xml"
    return HttpResponse(content, content_type="text/plain")



urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('api/health/', health_check, name='api_health_check'),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap' ),
    path('robots.txt', robots_txt),
    path('grappelli/', include('grappelli.urls')),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', include(router.urls)),
    path('clubs/', clubs_list, name='club_list'),
    path('techteam/', techteam_list, name='techteam_list'),
    path('otherbodies/', otherbodies_list, name='otherbodies_list'),
    path('bodies/<str:name>/', body_detail, name='body_detail'),
    path('portals/', portal_list, name='portal_list'),
    path('achievements/', achievement_list, name='achievement_list'),
    path('achievement/<str:name>/', achievement_detail, name='achievement_detail'),
    path('halloffame/', halloffame, name='halloffame_list'),
    path('contact/', contact, name='contact'),
    path('', home, name='home'),
    
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



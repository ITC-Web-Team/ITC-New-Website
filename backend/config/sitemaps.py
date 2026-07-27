#sitemap.py

from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'daily'

    def items(self):
        return ['home', 'club_list', 'techteam_list', 'otherbodies_list', 'portal_list', 'achievement_list', 'halloffame_list', 'contact']

    def location(self, item):
        return reverse(item)
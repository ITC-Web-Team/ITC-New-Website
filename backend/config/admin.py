from django.contrib import admin
from .models import Body, Member, Achievement, Portal, TechStack, Cabinet, WorkReport, InterIIT, ProblemStatements, Gallery

# Admin for Body Model
class BodyAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'contact_email', 'website')
    search_fields = ('name', 'description', 'contact_email')
    list_filter = ('type',)
    ordering = ('name',)

# Admin for Member Model
class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'body', 'priority')
    search_fields = ('name', 'position', 'body__name')
    list_filter = ('body',)
    ordering = ('priority',)

# Admin for Achievement Model
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'body', 'date')
    search_fields = ('title', 'body__name')
    list_filter = ('body', 'date')
    ordering = ('-date',)

# Admin for Portal Model
class PortalAdmin(admin.ModelAdmin):
    list_display = ('name', 'link')
    search_fields = ('name', 'description')
    ordering = ('name',)

# Admin for TechStack Model
class TechStackAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

# Admin for Cabinet Model
class CabinetAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'priority', 'email')
    search_fields = ('name', 'position')
    list_filter = ('position',)
    ordering = ('priority',)

# Admin for WorkReport Model
class WorkReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'url')
    search_fields = ('title',)
    ordering = ('title',)

# Admin for InterIIT Model
class InterIITAdmin(admin.ModelAdmin):
    list_display = ('title', 'gold', 'silver', 'bronze')
    search_fields = ('title', 'description')
    ordering = ('title',)

# Admin for ProblemStatements Model
class ProblemStatementsAdmin(admin.ModelAdmin):
    list_display = ('title', 'interiit', 'position')
    search_fields = ('title', 'interiit__title')
    ordering = ('position',)

# Admin for Gallery Model
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)
    ordering = ('title',)


# Registering the models with admin classes
admin.site.register(Body, BodyAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(Achievement, AchievementAdmin)
admin.site.register(Portal, PortalAdmin)
admin.site.register(TechStack, TechStackAdmin)
admin.site.register(Cabinet, CabinetAdmin)
admin.site.register(WorkReport, WorkReportAdmin)
admin.site.register(InterIIT, InterIITAdmin)
admin.site.register(ProblemStatements, ProblemStatementsAdmin)
admin.site.register(Gallery, GalleryAdmin)



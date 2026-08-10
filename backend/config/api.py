from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from collections import defaultdict
import traceback
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        tb = traceback.format_exc()
        return Response({
            'error': str(exc),
            'type': exc.__class__.__name__,
            'traceback': tb
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return response

from .models import Body, Member, Achievement, Portal, TechStack, Cabinet, WorkReport, InterIIT, ProblemStatements, Gallery
from .serializers import (
    BodySerializer, MemberSerializer, AchievementSerializer,
    PortalSerializer, TechStackSerializer, CabinetSerializer,
    InterIITSerializer, ProblemStatementsSerializer,
    GallerySerializer, WorkReportSerializer
)


class BodyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Body.objects.all()
    serializer_class = BodySerializer
    
    def get_queryset(self):
        queryset = Body.objects.all()
        body_type = self.request.query_params.get('type')
        
        if body_type is not None:
            queryset = queryset.filter(type=int(body_type))
        
        return queryset.order_by('name')
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        body = self.get_object()
        members = Member.objects.filter(body=body).order_by('-priority')
        serializer = MemberSerializer(members, many=True)
        return Response(serializer.data)


class MemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    
    def get_queryset(self):
        queryset = Achievement.objects.all()
        body_name = self.request.query_params.get('body')
        
        if body_name:
            queryset = queryset.filter(body__name=body_name)
        
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['get'])
    def by_year(self, request):
        """Get achievements grouped by year"""
        body_name = request.query_params.get('body')
        
        if body_name:
            achievements = Achievement.objects.filter(body__name=body_name)
        else:
            achievements = Achievement.objects.all()
        
        achievements_by_year = defaultdict(list)
        for achievement in achievements.order_by('-date'):
            year = achievement.date.year if achievement.date else 2026
            achievements_by_year[year].append(AchievementSerializer(achievement).data)
        
        # Sort by year descending, converting keys to strings/ints safely
        sorted_achievements = dict(sorted(achievements_by_year.items(), key=lambda x: int(x[0]) if str(x[0]).isdigit() else 0, reverse=True))
        
        return Response(sorted_achievements)
    
    @action(detail=False, methods=['get'])
    def bodies(self, request):
        """Get all bodies for filter dropdown"""
        bodies = Body.objects.all().order_by('name')
        serializer = BodySerializer(bodies, many=True)
        return Response(serializer.data)


class PortalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Portal.objects.all().order_by('name')
    serializer_class = PortalSerializer


class TechStackViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TechStack.objects.all()
    serializer_class = TechStackSerializer


class CabinetViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cabinet.objects.all().order_by('priority')
    serializer_class = CabinetSerializer


class InterIITViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InterIIT.objects.all().order_by('-year')
    serializer_class = InterIITSerializer


class ProblemStatementsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProblemStatements.objects.all()
    serializer_class = ProblemStatementsSerializer


class GalleryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer


class WorkReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WorkReport.objects.all().order_by('-title').reverse()
    serializer_class = WorkReportSerializer

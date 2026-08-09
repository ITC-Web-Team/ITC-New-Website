from rest_framework import serializers
from .models import Body, Member, Achievement, Portal, TechStack, Cabinet, WorkReport, InterIIT, ProblemStatements, Gallery


class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = ['id', 'name', 'logo']


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'name', 'position', 'priority', 'image']


class BodySerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, source='member_set', read_only=True)
    
    class Meta:
        model = Body
        fields = [
            'id', 'name', 'type', 'short_description', 'description',
            'contact_email', 'instagram', 'facebook', 'github', 'linkedin',
            'website', 'logo', 'members'
        ]


class AchievementSerializer(serializers.ModelSerializer):
    body = BodySerializer(read_only=True)
    
    class Meta:
        model = Achievement
        fields = ['id', 'body', 'date', 'title', 'description']


class PortalSerializer(serializers.ModelSerializer):
    techstacks = TechStackSerializer(many=True, read_only=True)
    
    class Meta:
        model = Portal
        fields = ['id', 'name', 'description', 'link', 'banner', 'techstacks']


class CabinetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cabinet
        fields = [
            'id', 'name', 'position', 'priority', 'image', 'email',
            'phone', 'linkedin', 'instagram', 'facebook'
        ]


class ProblemStatementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemStatements
        fields = ['id', 'title', 'position']


class InterIITSerializer(serializers.ModelSerializer):
    problemstatements = ProblemStatementsSerializer(
        many=True, source='problemstatements_set', read_only=True
    )
    
    class Meta:
        model = InterIIT
        fields = [
            'id', 'logo', 'year', 'title', 'subtitle', 'description',
            'img', 'gold', 'silver', 'bronze', 'problemstatements'
        ]


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['id', 'title', 'image']


class WorkReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkReport
        fields = ['id', 'title', 'image', 'url']

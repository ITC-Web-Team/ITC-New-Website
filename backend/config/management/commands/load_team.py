import json
from pathlib import Path

from django.core.management.base import BaseCommand

from config.models import TeamMember

FIXTURE = Path(__file__).resolve().parents[2] / 'fixtures' / 'team.json'


class Command(BaseCommand):
    help = "Load team members (config/fixtures/team.json). Safe to re-run; never touches uploaded images."

    def handle(self, *args, **options):
        with open(FIXTURE, encoding='utf-8') as f:
            rows = json.load(f)
        created = updated = 0
        for row in rows:
            _, was_created = TeamMember.objects.update_or_create(
                name=row['name'], defaults=row)
            created += was_created
            updated += not was_created
        self.stdout.write(self.style.SUCCESS(f"Team loaded: {created} created, {updated} updated"))

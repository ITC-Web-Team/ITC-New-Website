import json
from pathlib import Path

from django.core.management.base import BaseCommand

from config.models import Event

FIXTURE = Path(__file__).resolve().parents[2] / 'fixtures' / 'events.json'


class Command(BaseCommand):
    help = "Load the events calendar timeline (config/fixtures/events.json). Safe to re-run."

    def handle(self, *args, **options):
        with open(FIXTURE, encoding='utf-8') as f:
            rows = json.load(f)
        created = updated = 0
        for row in rows:
            _, was_created = Event.objects.update_or_create(
                name=row['name'], start_date=row['start_date'], defaults=row)
            created += was_created
            updated += not was_created
        self.stdout.write(self.style.SUCCESS(f"Events loaded: {created} created, {updated} updated"))

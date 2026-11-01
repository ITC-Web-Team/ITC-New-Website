from django.db import migrations, models


def csec_body_filter(Body):
    return models.Q(name__iexact='CSEC') | models.Q(
        name__iexact='Cyber Security Community'
    ) | models.Q(name__iexact='Cybersecurity Community')


def move_csec_to_clubs(apps, schema_editor):
    Body = apps.get_model('config', 'Body')
    Body.objects.using(schema_editor.connection.alias).filter(
        csec_body_filter(Body), type=2
    ).update(type=0)


def move_csec_back_to_community(apps, schema_editor):
    Body = apps.get_model('config', 'Body')
    Body.objects.using(schema_editor.connection.alias).filter(
        csec_body_filter(Body), type=0
    ).update(type=2)


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0008_alter_body_logo_alter_body_type_alter_cabinet_image_and_more'),
    ]

    operations = [
        migrations.RunPython(move_csec_to_clubs, move_csec_back_to_community),
    ]

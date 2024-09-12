# Generated by Django 5.0.7 on 2024-09-10 11:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0010_collection_image_playlist_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='artist',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='artist_events', to='music.artist'),
        ),
    ]

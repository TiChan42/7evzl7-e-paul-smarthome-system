# Generated by Django 4.2.7 on 2024-03-14 23:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_paul_smarthome_system', '0008_remove_log_date_log_time_alter_log_bodyrequest_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='pin',
            field=models.CharField(blank=True, default='', max_length=60),
        ),
    ]

# Generated by Django 4.2.7 on 2024-03-18 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_paul_smarthome_system', '0003_alter_commandoption_value'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='command',
            name='type',
        ),
        migrations.AddField(
            model_name='command',
            name='description',
            field=models.CharField(default='', max_length=50, verbose_name='Description'),
        ),
    ]

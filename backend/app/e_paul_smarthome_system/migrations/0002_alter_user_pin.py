# Generated by Django 4.2.7 on 2024-02-29 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_paul_smarthome_system', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='pin',
            field=models.CharField(default='', max_length=32),
        ),
    ]

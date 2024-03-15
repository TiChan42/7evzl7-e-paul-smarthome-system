# Generated by Django 4.2.7 on 2024-03-13 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('e_paul_smarthome_system', '0007_group_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='log',
            name='date',
        ),
        migrations.AddField(
            model_name='log',
            name='time',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='log',
            name='bodyRequest',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='log',
            name='bodyResponse',
            field=models.TextField(blank=True, null=True),
        ),
    ]

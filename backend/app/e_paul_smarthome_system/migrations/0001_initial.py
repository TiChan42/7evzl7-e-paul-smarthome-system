# Generated by Django 5.0.1 on 2024-03-31 01:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=40, unique=True)),
                ('description', models.CharField(blank=True, max_length=100, null=True)),
                ('emailVerified', models.BooleanField(default=False)),
                ('key', models.CharField(blank=True, max_length=60, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Command',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(default='', max_length=50, verbose_name='Description')),
            ],
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('groupType', models.TextField(blank=True, choices=[('Standard', 'Standard'), ('Favorite', 'Favorite'), ('Assignment', 'Assignment')], default='Standard', null=True)),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CommandOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=50, verbose_name='Key')),
                ('static', models.BooleanField(verbose_name='Static')),
                ('value', models.CharField(blank=True, max_length=50, null=True, verbose_name='Value')),
                ('command', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commandOption', to='e_paul_smarthome_system.command', verbose_name='Command')),
            ],
        ),
        migrations.CreateModel(
            name='KnownControllerType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(blank=True, max_length=50, null=True)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='knownControllerType', to='e_paul_smarthome_system.account', verbose_name='Account')),
            ],
        ),
        migrations.CreateModel(
            name='Microcontroller',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(blank=True, max_length=60, null=True, unique=True)),
                ('name', models.CharField(default='ESP8266', max_length=20)),
                ('type', models.CharField(max_length=32)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='microcontroller', to='e_paul_smarthome_system.account', verbose_name='Account')),
            ],
        ),
        migrations.CreateModel(
            name='Port',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=20, null=True)),
                ('type', models.CharField(blank=True, max_length=50, null=True)),
                ('currentStatus', models.JSONField(blank=True, null=True)),
                ('microcontroller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='port', to='e_paul_smarthome_system.microcontroller', verbose_name='Microcontroller')),
            ],
        ),
        migrations.CreateModel(
            name='GroupPort',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=20, null=True, verbose_name='Name')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='groupPort', to='e_paul_smarthome_system.group', verbose_name='Group')),
                ('port', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='groupPort', to='e_paul_smarthome_system.port', verbose_name='Port')),
            ],
        ),
        migrations.CreateModel(
            name='PortTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status_default', models.JSONField(blank=True, null=True)),
                ('knownControllerType', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='portTemplate', to='e_paul_smarthome_system.knowncontrollertype', verbose_name='Microcontroller')),
            ],
        ),
        migrations.AddField(
            model_name='port',
            name='portTemplate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='port', to='e_paul_smarthome_system.porttemplate', verbose_name='PortTemplate'),
        ),
        migrations.AddField(
            model_name='command',
            name='portTemplate',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='command', to='e_paul_smarthome_system.porttemplate', verbose_name='PortTemplate'),
        ),
        migrations.CreateModel(
            name='Scene',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scene', to='e_paul_smarthome_system.group', verbose_name='Group')),
            ],
        ),
        migrations.CreateModel(
            name='State',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('state', models.JSONField()),
                ('port', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='state', to='e_paul_smarthome_system.port', verbose_name='Port')),
                ('scene', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='state', to='e_paul_smarthome_system.scene', verbose_name='Scene')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(blank=True, max_length=12, null=True)),
                ('pin', models.CharField(blank=True, default='', max_length=60)),
                ('role', models.TextField(choices=[('superuser', 'Superuser'), ('admin', 'Admin'), ('user', 'User')])),
                ('imageName', models.CharField(blank=True, max_length=32, null=True)),
                ('gender', models.TextField(blank=True, choices=[('männlich', 'Männlich'), ('weiblich', 'Weiblich'), ('divers', 'Divers')], null=True)),
                ('birthdate', models.DateField(blank=True, null=True)),
                ('rights', models.JSONField(blank=True, null=True)),
                ('account', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to='e_paul_smarthome_system.account', verbose_name='Account')),
            ],
        ),
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('endpoint', models.CharField(max_length=100, null=True)),
                ('responseCode', models.PositiveSmallIntegerField()),
                ('method', models.CharField(max_length=10, null=True)),
                ('status', models.TextField(blank=True, choices=[('ok', 'Ok'), ('error', 'Error'), ('clientError', 'Clienterror'), ('serverError', 'Servererror'), ('warning', 'Warning'), ('message', 'Meassage')], null=True)),
                ('remoteAddress', models.CharField(max_length=20, null=True)),
                ('execTime', models.IntegerField(null=True)),
                ('time', models.IntegerField(blank=True, null=True)),
                ('bodyResponse', models.TextField(blank=True, null=True)),
                ('bodyRequest', models.TextField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='Log', to='e_paul_smarthome_system.user', verbose_name='Log')),
            ],
        ),
        migrations.AddField(
            model_name='group',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group', to='e_paul_smarthome_system.user', verbose_name='User'),
        ),
    ]

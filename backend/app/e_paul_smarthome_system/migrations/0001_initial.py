# Generated by Django 4.2.7 on 2023-11-23 08:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Microcontroller",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                ("ip", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("firstname", models.CharField(max_length=40)),
                ("lastname", models.CharField(max_length=40)),
                ("email", models.CharField(max_length=50, unique=True)),
                ("password", models.CharField(max_length=50)),
                ("key", models.CharField(max_length=50, unique=True)),
                (
                    "gender",
                    models.TextField(
                        choices=[
                            ("männlich", "Männlich"),
                            ("weiblich", "Weiblich"),
                            ("divers", "Divers"),
                        ]
                    ),
                ),
                ("birthdate", models.DateField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Pin",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "art",
                    models.CharField(
                        choices=[("Eingang", "Eingang"), ("Ausgang", "Ausgang")],
                        max_length=50,
                    ),
                ),
                ("used", models.BooleanField(default=False)),
                (
                    "mikrocontroller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="e_paul_smarthome_system.microcontroller",
                        verbose_name="Microcontroller",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="microcontroller",
            name="User",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="e_paul_smarthome_system.user",
                verbose_name="User",
            ),
        ),
        migrations.CreateModel(
            name="Group",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=40, unique=True)),
                ("description", models.CharField(max_length=100)),
                ("kindOf", models.CharField(max_length=50)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="e_paul_smarthome_system.user",
                        verbose_name="User",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Function",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("function", models.CharField(max_length=50, unique=True)),
                ("description", models.CharField(max_length=100)),
                (
                    "microcontroller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="e_paul_smarthome_system.microcontroller",
                        verbose_name="Microcontroller",
                    ),
                ),
            ],
        ),
    ]

# Generated by Django 4.2.7 on 2023-12-01 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("e_paul_smarthome_system", "0005_rename_used_pin_inuse"),
    ]

    operations = [
        migrations.CreateModel(
            name="Log",
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
                    "status",
                    models.TextField(
                        choices=[
                            ("error", "Error"),
                            ("warning", "Warning"),
                            ("notification", "Notification"),
                        ]
                    ),
                ),
                ("date", models.DateField(auto_now_add=True)),
                ("message", models.TextField()),
                ("description", models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name="Scene",
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
                ("startTime", models.DateTimeField()),
                ("endTime", models.DateTimeField()),
                (
                    "description",
                    models.CharField(blank=True, max_length=100, null=True),
                ),
                (
                    "function",
                    models.ManyToManyField(to="e_paul_smarthome_system.function"),
                ),
            ],
        ),
    ]

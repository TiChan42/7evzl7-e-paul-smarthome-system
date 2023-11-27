# Generated by Django 4.2.7 on 2023-11-27 15:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("e_paul_smarthome_system", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="group",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="e_paul_smarthome_system.group",
                verbose_name="Group",
            ),
        ),
    ]

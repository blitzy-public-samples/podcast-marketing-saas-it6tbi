"""
Initial migration for the Django backend application.

This migration creates the database schema for all models defined in the backend services,
including podcast, marketing, authentication, analytics, AI, and storage services.

Requirements Addressed:
- Database Schema Initialization (7.2 Component Details/Data Storage Components):
  Defines the initial database schema for all backend services, ensuring data persistence
  and integrity.
"""

# django.db.migrations v4.2
from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):
    """Defines the operations for creating the initial database schema."""

    initial = True

    dependencies = []

    operations = [
        # Podcast Service Models
        migrations.CreateModel(
            name='Podcast',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='The title of the podcast', max_length=255)),
                ('description', models.TextField(help_text='Detailed description of the podcast')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Timestamp when the podcast was created')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Timestamp when the podcast was last updated')),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [
                    models.Index(fields=['title'], name='podcast_title_idx'),
                    models.Index(fields=['created_at'], name='podcast_created_idx'),
                ],
            },
        ),
        migrations.CreateModel(
            name='Episode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='The title of the episode', max_length=255)),
                ('audio_file', models.FileField(help_text='Audio file for the episode. Supported formats: .mp3, .wav, .aac', upload_to='episodes/audio/%Y/%m/%d/')),
                ('duration', models.PositiveIntegerField(help_text='Duration of the episode in seconds')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Timestamp when the episode was created')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Timestamp when the episode was last updated')),
                ('podcast', models.ForeignKey(help_text='The podcast this episode belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='episodes', to='podcast_service.podcast')),
            ],
            options={
                'ordering': ['-created_at'],
                'indexes': [
                    models.Index(fields=['title'], name='episode_title_idx'),
                    models.Index(fields=['created_at'], name='episode_created_idx'),
                    models.Index(fields=['podcast', 'created_at'], name='episode_podcast_created_idx'),
                ],
            },
        ),

        # Marketing Service Models
        migrations.CreateModel(
            name='SocialMediaPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform', models.CharField(choices=[('FB', 'Facebook'), ('TW', 'Twitter'), ('LI', 'LinkedIn'), ('IG', 'Instagram')], help_text='Social media platform for the post', max_length=2)),
                ('content', models.TextField(help_text='Post content with platform-specific formatting', max_length=2200)),
                ('scheduled_time', models.DateTimeField(help_text='Scheduled publication time for the post')),
                ('status', models.CharField(choices=[('DRAFT', 'Draft'), ('SCHEDULED', 'Scheduled'), ('PUBLISHED', 'Published'), ('FAILED', 'Failed')], default='DRAFT', help_text='Current status of the post', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('media_url', models.URLField(blank=True, help_text='URL to attached media content', null=True)),
                ('media_type', models.CharField(blank=True, choices=[('IMAGE', 'Image'), ('VIDEO', 'Video'), ('AUDIO', 'Audio')], help_text='Type of attached media', max_length=10, null=True)),
            ],
            options={
                'ordering': ['-scheduled_time'],
                'indexes': [
                    models.Index(fields=['platform', 'status', 'scheduled_time'], name='post_platform_status_idx'),
                    models.Index(fields=['scheduled_time'], name='post_scheduled_idx'),
                ],
            },
        ),

        # Authentication Service Models
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(db_index=True, help_text="User's email address for authentication and communication", max_length=255, unique=True, verbose_name='Email Address')),
                ('password_hash', models.CharField(help_text='Hashed user password', max_length=128, verbose_name='Password Hash')),
                ('role', models.CharField(choices=[('admin', 'Administrator'), ('creator', 'Content Creator'), ('editor', 'Content Editor'), ('viewer', 'Content Viewer')], default='viewer', help_text="User's role determining their permissions", max_length=20, verbose_name='User Role')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active', verbose_name='Active Status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into the admin site', verbose_name='Staff Status')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them', verbose_name='Superuser Status')),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Timestamp when the user was created', verbose_name='Created At')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Timestamp when the user was last updated', verbose_name='Updated At')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'ordering': ['-created_at'],
            },
        ),

        # Analytics Service Models
        migrations.CreateModel(
            name='EngagementMetric',
            fields=[
                ('id', models.UUIDField(default=models.UUIDField.default, editable=False, primary_key=True, serialize=False)),
                ('likes', models.IntegerField(default=0, help_text='Number of likes/reactions received')),
                ('shares', models.IntegerField(default=0, help_text='Number of times the content was shared')),
                ('comments', models.IntegerField(default=0, help_text='Number of comments received')),
                ('impressions', models.IntegerField(default=0, help_text='Total number of times the content was displayed')),
                ('timestamp', models.DateTimeField(auto_now_add=True, help_text='When these metrics were recorded')),
                ('podcast', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='engagement_metrics', to='podcast_service.podcast')),
            ],
            options={
                'ordering': ['-timestamp'],
                'indexes': [
                    models.Index(fields=['podcast', 'timestamp'], name='engagement_podcast_time_idx'),
                    models.Index(fields=['timestamp'], name='engagement_time_idx'),
                ],
            },
        ),

        # AI Service Models
        migrations.CreateModel(
            name='TranscriptionTask',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, help_text='Unique identifier for the transcription task', primary_key=True, serialize=False)),
                ('audio_file_path', models.CharField(help_text='S3 path to the audio file for transcription', max_length=512)),
                ('transcription_text', models.TextField(blank=True, help_text='The transcribed text output from Whisper AI', null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, help_text='Timestamp when the task was created')),
                ('updated_at', models.DateTimeField(auto_now=True, help_text='Timestamp when the task was last updated')),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('PROCESSING', 'Processing'), ('COMPLETED', 'Completed'), ('FAILED', 'Failed')], default='PENDING', help_text='Current status of the transcription task', max_length=20)),
                ('error_message', models.TextField(blank=True, help_text='Error message if the transcription task failed', null=True)),
            ],
            options={
                'db_table': 'ai_transcription_tasks',
                'ordering': ['-created_at'],
                'indexes': [
                    models.Index(fields=['status', 'created_at'], name='transcription_status_idx'),
                    models.Index(fields=['audio_file_path'], name='transcription_path_idx'),
                ],
            },
        ),

        # Storage Service Models
        migrations.CreateModel(
            name='FileStorage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.CharField(help_text='Original name of the uploaded file', max_length=255)),
                ('file_size', models.PositiveIntegerField(help_text='Size of the file in bytes')),
                ('file_format', models.CharField(help_text='File format extension (e.g., .mp3, .wav)', max_length=10)),
                ('s3_url', models.URLField(help_text='Complete S3 URL for file access', max_length=2048)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True, help_text='Timestamp when the file was uploaded')),
            ],
            options={
                'db_table': 'storage_file_storage',
                'verbose_name': 'File Storage',
                'verbose_name_plural': 'File Storage',
                'indexes': [
                    models.Index(fields=['file_name'], name='storage_filename_idx'),
                    models.Index(fields=['uploaded_at'], name='storage_uploaded_idx'),
                ],
            },
        ),
    ]
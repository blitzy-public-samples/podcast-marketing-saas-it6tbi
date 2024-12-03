"""
Unit tests for marketing service models.

Requirements Addressed:
- Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation):
  Tests ensure models support multi-platform post scheduling, content optimization, and campaign analytics.
- Social Media Integration (1.3 Scope/Implementation Boundaries/Supported Platforms):
  Tests validate models for integration with Facebook, Twitter, LinkedIn, and Instagram.

Human Tasks:
1. Configure test database with appropriate test data
2. Set up mock social media API responses for testing
3. Review test coverage and add additional test cases as needed
4. Verify test environment variables are properly configured
"""

from django.test import TestCase  # Django 4.2
from django.utils import timezone
from datetime import timedelta
from ..models import SocialMediaPost, MarketingCampaign, CampaignPost
from ...common.exceptions import ValidationError

class TestSocialMediaPost(TestCase):
    """Test cases for the SocialMediaPost model."""

    def setUp(self):
        """Set up test data."""
        self.post_data = {
            'platform': 'FB',
            'content': 'Test post content',
            'scheduled_time': timezone.now() + timedelta(hours=1),
            'status': 'DRAFT'
        }

    def test_social_media_post_creation(self):
        """Tests the creation of a SocialMediaPost instance and validates its fields."""
        post = SocialMediaPost.objects.create(**self.post_data)
        
        # Assert post was created successfully
        self.assertIsNotNone(post.id)
        
        # Validate fields
        self.assertEqual(post.platform, 'FB')
        self.assertEqual(post.content, 'Test post content')
        self.assertEqual(post.status, 'DRAFT')
        self.assertIsNotNone(post.created_at)
        self.assertIsNotNone(post.updated_at)

    def test_social_media_post_platform_validation(self):
        """Tests platform validation for social media posts."""
        invalid_data = self.post_data.copy()
        invalid_data['platform'] = 'INVALID'
        
        with self.assertRaises(ValidationError):
            post = SocialMediaPost(**invalid_data)
            post.clean()

    def test_social_media_post_content_length(self):
        """Tests content length validation for different platforms."""
        platforms_and_limits = {
            'FB': 63206,
            'TW': 280,
            'LI': 2200,
            'IG': 2200
        }
        
        for platform, limit in platforms_and_limits.items():
            test_data = self.post_data.copy()
            test_data['platform'] = platform
            
            # Test valid content length
            test_data['content'] = 'a' * limit
            post = SocialMediaPost(**test_data)
            post.clean()  # Should not raise ValidationError
            
            # Test invalid content length
            test_data['content'] = 'a' * (limit + 1)
            post = SocialMediaPost(**test_data)
            with self.assertRaises(ValidationError):
                post.clean()

    def test_publish_social_media_post(self):
        """Tests the publish method of the SocialMediaPost model."""
        post = SocialMediaPost.objects.create(**self.post_data)
        
        # Test successful publish
        success = post.publish()
        self.assertTrue(success)
        self.assertEqual(post.status, 'PUBLISHED')
        
        # Test publish with invalid content
        invalid_post = SocialMediaPost.objects.create(
            platform='TW',
            content='a' * 281,  # Exceeds Twitter's limit
            scheduled_time=timezone.now() + timedelta(hours=1)
        )
        success = invalid_post.publish()
        self.assertFalse(success)
        self.assertEqual(invalid_post.status, 'FAILED')

class TestMarketingCampaign(TestCase):
    """Test cases for the MarketingCampaign model."""

    def setUp(self):
        """Set up test data."""
        self.campaign_data = {
            'name': 'Test Campaign',
            'start_date': timezone.now(),
            'end_date': timezone.now() + timedelta(days=30),
            'description': 'Test campaign description'
        }
        
        self.post_data = {
            'platform': 'FB',
            'content': 'Test post content',
            'scheduled_time': timezone.now() + timedelta(hours=1),
            'status': 'DRAFT'
        }

    def test_marketing_campaign_creation(self):
        """Tests the creation of a MarketingCampaign instance and validates its fields."""
        campaign = MarketingCampaign.objects.create(**self.campaign_data)
        
        # Assert campaign was created successfully
        self.assertIsNotNone(campaign.id)
        
        # Validate fields
        self.assertEqual(campaign.name, 'Test Campaign')
        self.assertEqual(campaign.description, 'Test campaign description')
        self.assertTrue(campaign.is_active)
        self.assertIsNotNone(campaign.created_at)
        self.assertIsNotNone(campaign.updated_at)

    def test_campaign_date_validation(self):
        """Tests date validation for marketing campaigns."""
        invalid_data = self.campaign_data.copy()
        invalid_data['end_date'] = timezone.now() - timedelta(days=1)  # End date before start date
        
        with self.assertRaises(ValidationError):
            campaign = MarketingCampaign(**invalid_data)
            campaign.clean()

    def test_add_post_to_campaign(self):
        """Tests the add_post method of the MarketingCampaign model."""
        campaign = MarketingCampaign.objects.create(**self.campaign_data)
        post = SocialMediaPost.objects.create(**self.post_data)
        
        # Test successful post addition
        success = campaign.add_post(post)
        self.assertTrue(success)
        
        # Verify the relationship was created
        campaign_post = CampaignPost.objects.filter(campaign=campaign, post=post).first()
        self.assertIsNotNone(campaign_post)
        
        # Test adding invalid post type
        success = campaign.add_post("invalid_post")
        self.assertFalse(success)
        
        # Test adding duplicate post
        success = campaign.add_post(post)
        self.assertFalse(success)

    def test_campaign_insights(self):
        """Tests the get_campaign_insights method of the MarketingCampaign model."""
        campaign = MarketingCampaign.objects.create(**self.campaign_data)
        
        # Create posts with different statuses and platforms
        posts_data = [
            {'platform': 'FB', 'status': 'PUBLISHED'},
            {'platform': 'TW', 'status': 'SCHEDULED'},
            {'platform': 'LI', 'status': 'FAILED'},
            {'platform': 'FB', 'status': 'PUBLISHED'}
        ]
        
        for post_data in posts_data:
            test_post_data = self.post_data.copy()
            test_post_data.update(post_data)
            post = SocialMediaPost.objects.create(**test_post_data)
            campaign.add_post(post)
        
        insights = campaign.get_campaign_insights()
        
        # Verify metrics
        self.assertEqual(insights['total_posts'], 4)
        self.assertEqual(insights['published_posts'], 2)
        self.assertEqual(insights['scheduled_posts'], 1)
        self.assertEqual(insights['failed_posts'], 1)
        self.assertEqual(insights['posts_by_platform']['Facebook'], 2)
        self.assertEqual(insights['posts_by_platform']['Twitter'], 1)
        self.assertEqual(insights['posts_by_platform']['LinkedIn'], 1)
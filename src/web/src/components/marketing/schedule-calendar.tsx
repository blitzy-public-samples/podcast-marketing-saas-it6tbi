/**
 * Human Tasks:
 * 1. Verify calendar accessibility with screen readers
 * 2. Test keyboard navigation across different devices
 * 3. Validate campaign status color scheme with design team
 * 4. Ensure responsive layout works on all screen sizes
 */

// react v18.0.0
import { useState, useEffect } from 'react';

// Internal imports
import Calendar from '../ui/calendar';
import { Button } from '../ui/button';
import { useFetchMarketingCampaigns } from '../../hooks/use-marketing';
import useAnalytics from '../../hooks/use-analytics';
import type { MarketingCampaign } from '../../types/marketing';
import type { AnalyticsData } from '../../types/analytics';

// Requirement: Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
const ScheduleCalendar: React.FC = () => {
  // State for selected date and campaigns
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredCampaigns, setFilteredCampaigns] = useState<MarketingCampaign[]>([]);

  // Fetch marketing campaigns
  const { campaigns, loading: campaignsLoading, error: campaignsError, refetch } = useFetchMarketingCampaigns();

  // Fetch analytics data
  const { 
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    fetchAnalyticsData
  } = useAnalytics();

  // Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
  useEffect(() => {
    if (campaigns) {
      const filtered = campaigns.filter(campaign => {
        const campaignDate = new Date(campaign.scheduleDate);
        return (
          campaignDate.getDate() === selectedDate.getDate() &&
          campaignDate.getMonth() === selectedDate.getMonth() &&
          campaignDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      setFilteredCampaigns(filtered);
    }
  }, [campaigns, selectedDate]);

  // Fetch analytics when date changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        await fetchAnalyticsData(`/analytics/marketing?date=${selectedDate.toISOString()}`);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchAnalytics();
  }, [selectedDate, fetchAnalyticsData]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Calendar Section */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Marketing Schedule</h2>
          <Calendar
            value={selectedDate}
            onChange={handleDateSelect}
            className="w-full"
            ariaLabel="Marketing campaign calendar"
          />
        </div>
      </div>

      {/* Campaign Details Section */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Campaigns for {selectedDate.toLocaleDateString()}
            </h3>
            <Button
              label="Add Campaign"
              variant="primary"
              size="small"
              onClick={() => {/* Add campaign handler */}}
              icon={<span>+</span>}
            />
          </div>

          {/* Campaign List */}
          {campaignsLoading ? (
            <div className="flex justify-center py-4">
              <span className="animate-spin">⌛</span>
            </div>
          ) : campaignsError ? (
            <div className="text-red-500 p-4 text-center">
              Failed to load campaigns
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{campaign.title}</h4>
                      <div className="flex gap-2 mt-1">
                        {campaign.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                </div>
              ))}
              {filteredCampaigns.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No campaigns scheduled for this date
                </div>
              )}
            </div>
          )}

          {/* Analytics Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Analytics Insights</h3>
            {analyticsLoading ? (
              <div className="flex justify-center py-4">
                <span className="animate-spin">⌛</span>
              </div>
            ) : analyticsError ? (
              <div className="text-red-500 p-4 text-center">
                Failed to load analytics
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData?.data.map((metric: AnalyticsData) => (
                  <div
                    key={metric.metric}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{metric.metric}</span>
                    <span className="text-primary-600">{metric.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCalendar;
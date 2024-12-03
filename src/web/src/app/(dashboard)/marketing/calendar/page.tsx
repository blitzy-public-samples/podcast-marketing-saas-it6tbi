/**
 * Human Tasks:
 * 1. Verify calendar accessibility with screen readers
 * 2. Test keyboard navigation for calendar interactions
 * 3. Validate campaign status color scheme with design team
 * 4. Ensure responsive layout works on all screen sizes
 */

// react v18.0.0
'use client';
import { useState, useEffect } from 'react';
// react-redux v8.0.5
import { useDispatch, useSelector } from 'react-redux';

// Internal imports
import ScheduleCalendar from '../../../components/marketing/schedule-calendar';
import { useFetchMarketingCampaigns } from '../../../hooks/use-marketing';
import { actions } from '../../../store/marketing-slice';
import Calendar from '../../../components/ui/calendar';

// Requirement: Marketing Automation (1.3 Scope/Core Features and Functionalities/Marketing Automation)
const MarketingCalendarPage = () => {
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Fetch marketing campaigns using custom hook
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns
  } = useFetchMarketingCampaigns();

  // Local state for selected date
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Requirement: Frontend State Management (8.1 User Interface Design/8.1.3 Critical User Flows)
  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(actions.clearError());

    // Set selected campaign to null when date changes
    dispatch(actions.setSelectedCampaign(null));
  }, [dispatch, selectedDate]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle campaign selection
  const handleCampaignSelect = (campaignId: string) => {
    const selectedCampaign = campaigns?.find(campaign => campaign.id === campaignId);
    if (selectedCampaign) {
      dispatch(actions.setSelectedCampaign(selectedCampaign));
    }
  };

  // Handle campaign status update
  const handleStatusUpdate = async (campaignId: string, newStatus: 'draft' | 'scheduled' | 'published') => {
    try {
      dispatch(actions.updateCampaignStatus({ id: campaignId, status: newStatus }));
      await refetchCampaigns();
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    }
  };

  // Requirement: Responsive Design (8.1 User Interface Design/Design Specifications/Responsive Design)
  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Marketing Calendar
        </h1>
        <div className="flex items-center gap-2">
          {campaignsLoading && (
            <span className="text-sm text-gray-500">
              Loading campaigns...
            </span>
          )}
        </div>
      </div>

      {/* Error Display */}
      {campaignsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {campaignsError}
        </div>
      )}

      {/* Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-8">
          <ScheduleCalendar
            campaigns={campaigns || []}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onCampaignSelect={handleCampaignSelect}
            onStatusUpdate={handleStatusUpdate}
            isLoading={campaignsLoading}
          />
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Date Overview
              </h2>
            </div>
            <div className="p-4">
              <Calendar
                value={selectedDate}
                onChange={handleDateSelect}
                className="w-full"
                ariaLabel="Select date for marketing campaigns"
              />
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Campaign Status Legend
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Published</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Scheduled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-500" />
                    <span>Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCalendarPage;
// @testing-library/react v14.0.0
import { render, fireEvent, screen } from '@testing-library/react';
// jest v29.0.0
import { jest } from '@jest/globals';
// jest-mock v29.0.0
import { mocked } from 'jest-mock';

// Internal imports
import ContentGenerator from '../../../src/components/marketing/content-generator';
import { Button } from '../../../src/components/ui/button';
import { useFetchMarketingCampaigns, useCreateMarketingCampaign } from '../../../src/hooks/use-marketing';
import { fetchData } from '../../../src/lib/api';

// Mock the hooks and API functions
jest.mock('../../../src/hooks/use-marketing');
jest.mock('../../../src/lib/api');

// Mock implementations
const mockUseFetchMarketingCampaigns = mocked(useFetchMarketingCampaigns);
const mockUseCreateMarketingCampaign = mocked(useCreateMarketingCampaign);
const mockFetchData = mocked(fetchData);

describe('ContentGenerator Component', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockUseFetchMarketingCampaigns.mockReturnValue({
      campaigns: [
        {
          id: '1',
          title: 'Test Campaign',
          content: 'Test content',
          platforms: ['facebook', 'twitter'],
          scheduleDate: new Date(),
          status: 'draft'
        }
      ],
      loading: false,
      error: null,
      refetch: jest.fn()
    });

    mockUseCreateMarketingCampaign.mockReturnValue({
      createCampaign: jest.fn().mockResolvedValue({
        id: '2',
        title: 'New Campaign',
        content: 'Generated content',
        platforms: ['instagram'],
        scheduleDate: new Date(),
        status: 'draft'
      }),
      loading: false,
      error: null
    });
  });

  /**
   * Test: Component renders correctly with default props
   * Requirements addressed:
   * - Testing and Quality Assurance (9.5 Development & Deployment/9.5.1 Development Environment)
   */
  test('renders correctly with default props', () => {
    render(<ContentGenerator />);

    // Verify platform selector is rendered
    expect(screen.getByLabelText(/select platforms/i)).toBeInTheDocument();

    // Verify content editor is rendered
    expect(screen.getByLabelText(/marketing content/i)).toBeInTheDocument();

    // Verify action buttons are rendered
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  /**
   * Test: Component handles button clicks correctly
   * Requirements addressed:
   * - Testing and Quality Assurance (9.5 Development & Deployment/9.5.1 Development Environment)
   */
  test('handles button clicks correctly', async () => {
    const mockOnComplete = jest.fn();
    const { createCampaign } = mockUseCreateMarketingCampaign();

    render(
      <ContentGenerator 
        initialContent="Test content"
        onComplete={mockOnComplete}
      />
    );

    // Select a platform
    const platformSelector = screen.getByLabelText(/select platforms/i);
    fireEvent.change(platformSelector, { target: { value: 'facebook' } });

    // Enter content
    const contentEditor = screen.getByLabelText(/marketing content/i);
    fireEvent.change(contentEditor, { target: { value: 'Updated test content' } });

    // Click generate button
    const generateButton = screen.getByRole('button', { name: /generate/i });
    fireEvent.click(generateButton);

    // Verify campaign creation was called
    expect(createCampaign).toHaveBeenCalledWith(expect.objectContaining({
      content: 'Updated test content',
      platforms: ['facebook'],
      status: 'draft'
    }));

    // Verify onComplete callback was triggered
    await expect(mockOnComplete).toHaveBeenCalled();
  });

  /**
   * Test: Component handles API errors gracefully
   * Requirements addressed:
   * - Testing and Quality Assurance (9.5 Development & Deployment/9.5.1 Development Environment)
   */
  test('handles API errors gracefully', async () => {
    // Mock API error
    const mockError = new Error('API Error');
    mockFetchData.mockRejectedValue(mockError);

    mockUseCreateMarketingCampaign.mockReturnValue({
      createCampaign: jest.fn().mockRejectedValue(mockError),
      loading: false,
      error: 'Failed to create campaign'
    });

    render(<ContentGenerator />);

    // Select a platform and enter content
    const platformSelector = screen.getByLabelText(/select platforms/i);
    fireEvent.change(platformSelector, { target: { value: 'facebook' } });

    const contentEditor = screen.getByLabelText(/marketing content/i);
    fireEvent.change(contentEditor, { target: { value: 'Test content' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Verify error message is displayed
    expect(await screen.findByText(/failed to create campaign/i)).toBeInTheDocument();
  });

  /**
   * Test: Component validates required fields
   * Requirements addressed:
   * - Testing and Quality Assurance (9.5 Development & Deployment/9.5.1 Development Environment)
   */
  test('validates required fields before submission', () => {
    render(<ContentGenerator />);

    // Click save button without entering content or selecting platforms
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    // Verify validation error is displayed
    expect(screen.getByText(/please enter some content/i)).toBeInTheDocument();
  });
});
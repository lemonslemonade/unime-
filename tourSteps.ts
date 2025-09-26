import { TourStep, View } from './types';

export const tourSteps: TourStep[] = [
  {
    targetSelector: '#onboarding-start', // Dummy selector for centered modal
    isCentered: true,
    title: 'Welcome to UniMe!',
    content: 'Let\'s take a quick tour to see how you can manage your digital identity with ease. This will only take a minute.',
    view: View.Dashboard,
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="dashboard-greeting"]',
    title: 'Your Dashboard',
    content: 'This is your central hub. At a glance, you can see your profile information and recent account activity.',
    view: View.Dashboard,
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="security-health-card"]',
    title: 'Security Health',
    content: 'Keep an eye on your account\'s security score. We provide actionable steps to help you keep your data safe.',
    view: View.Dashboard,
    position: 'left',
  },
  {
    targetSelector: '[data-tour="nav-Consent"]',
    title: 'Navigate Your Profile',
    content: 'Use this sidebar to navigate between different sections of your UniMe profile.',
    view: View.Dashboard,
    position: 'right',
  },
  {
    targetSelector: '[data-tour="consent-card"]',
    title: 'Manage Consent',
    content: 'Here, you can see which businesses have requested your data and for what purpose. Click "Manage" to grant or revoke access to specific data points.',
    view: View.Consent,
    position: 'bottom',
  },
  {
    targetSelector: '[data-tour="partner-card"]',
    title: 'Data Sharing Overview',
    content: 'This page shows you a clear overview of which businesses you are actively sharing data with. You can revoke access at any time.',
    view: View.DataSharing,
    position: 'bottom',
  },
  {
    targetSelector: '#onboarding-end', // Dummy selector for centered modal
    isCentered: true,
    title: 'You\'re All Set!',
    content: 'That\'s it! You\'re now ready to take full control of your data. Feel free to explore the other sections on your own.',
    view: View.DataSharing,
    position: 'bottom',
  }
];

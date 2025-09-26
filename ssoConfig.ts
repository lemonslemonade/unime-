/**
 * Configuration for Enterprise Single Sign-On (SSO) integrations.
 * This file centralizes all SSO-related settings, making it easy to update
 * provider details without modifying component code.
 */
export const ssoConfig = {
  /**
   * The display name of the SSO provider.
   * Example: 'Okta', 'Azure AD', 'Auth0'
   */
  providerName: 'Global Retail Inc.',

  /**
   * The URL for the SSO provider's logo.
   */
  providerLogoUrl: 'https://logo.clearbit.com/walmart.com',

  /**
   * The endpoint URL for initiating the SSO authentication flow.
   * This is a placeholder and should be replaced with a real URL.
   */
  endpointUrl: 'https://sso.globalretail.com/auth',

  /**
   * The client ID provided by the SSO provider for this application.
   * This is a placeholder and should be replaced with a real client ID.
   */
  clientId: 'unime-app-client-id-12345',
};
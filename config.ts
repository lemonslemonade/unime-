// config.ts

/**
 * Configuration object for the application.
 * It's responsible for sourcing environment variables and other configuration values.
 * This provides a single source of truth for configuration and makes it easier
 * to manage different environments (development, staging, production).
 */

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This check ensures the application fails fast if the essential API key is not provided.
  throw new Error("API_KEY environment variable not set. Please ensure it is configured in your environment.");
}

export const config = {
  apiKey: API_KEY,
  // Future configuration can be added here, e.g.:
  // logLevel: process.env.LOG_LEVEL || 'info',
  // apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
};

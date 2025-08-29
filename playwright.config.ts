import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './RunYourTestHere',
  fullyParallel: false, // Ensure tests run sequentially
  workers: 3, // Run one test at a time
  reporter: [['html'], ['list']], // Added list reporter for better visibility
  
  use: {
    trace: 'on', // Enable tracing
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    // First run all Chromium viewports for each test
    {
      name: 'CHROMIUM-1920x1080',
      testMatch: /.*.spec.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'CHROMIUM-1680x1050',
      testMatch: /.*.spec.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1680, height: 1050 },
      },
      dependencies: ['CHROMIUM-1920x1080'],
    },
    {
      name: 'CHROMIUM-1366x768',
      testMatch: /.*.spec.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
      dependencies: ['CHROMIUM-1680x1050'],
    },

    // Then run all Firefox viewports after Chromium completes
    {
      name: 'FIREFOX-1920x1080',
      testMatch: /.*.spec.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
      dependencies: ['CHROMIUM-1366x768'], // Wait for all Chromium to finish
    },
    {
      name: 'FIREFOX-1680x1050',
      testMatch: /.*.spec.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1680, height: 1050 },
      },
      dependencies: ['FIREFOX-1920x1080'],
    },
    {
      name: 'FIREFOX-1366x768',
      testMatch: /.*.spec.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1366, height: 768 },
      },
      dependencies: ['FIREFOX-1680x1050'],
    },
  ],
});

import { defineConfig, devices } from '@playwright/test';

const CHROME1920 = { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } };
const CHROME1680 = { ...devices['Desktop Chrome'], viewport: { width: 1680, height: 1050 } };
const FIREFOX1920 = { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } };
const FIREFOX1680 = { ...devices['Desktop Firefox'], viewport: { width: 1680, height: 1050 } };

export default defineConfig({
  testDir: './RunYourTestHere',

  // Run everything serially (one worker total)
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: { trace: 'on-first-retry'},

  projects: [
      // --- Single Item - General Info chain ---
      {
        name: 'CHROMIUM-1920x1080: General Info',
        use: CHROME1920, grep: /Single Item - General Info/
      },
      { name: 'CHROMIUM-1680x1050: General Info', use: CHROME1680,
        grep: /Single Item - General Info/,
        dependencies: ['CHROMIUM-1920x1080: General Info']
      },
      { name: 'FIREFOX-1920x1080: General Info', 
        use: FIREFOX1920,
        grep: /Single Item - General Info/,
        dependencies: ['CHROMIUM-1680x1050: General Info']
      },

      // --- Single Item - Price: Platform Pricing chain ---
      { name: 'CHROMIUM-1920x1080: Price Platform',
        use: CHROME1920,
        grep: /Single Item - Price: Platform Pricing/, 
        dependencies: ['FIREFOX-1920x1080: General Info']
      },
      { name: 'CHROMIUM-1680x1050: Price Platform', 
        use: CHROME1680, grep: /Single Item - Price: Platform Pricing/, 
        dependencies: ['CHROMIUM-1920x1080: Price Platform']
      },
      { name: 'FIREFOX-1920x1080: Price Platform',  
        use: FIREFOX1920, 
        grep: /Single Item - Price: Platform Pricing/, 
        dependencies: ['CHROMIUM-1680x1050: Price Platform'] 
      },

      // --- Single Item - Price: Apply All chain ---
      { name: 'CHROMIUM-1920x1080: Price Apply All',
        use: CHROME1920,
        grep: /Single Item - Price: Apply All/, 
        dependencies: ['FIREFOX-1920x1080: Price Platform']
      },
      { name: 'CHROMIUM-1680x1050: Price Apply All', 
        use: CHROME1680, grep: /Single Item - Price: Apply All/, 
        dependencies: ['CHROMIUM-1920x1080: Price Apply All']
      },
      { name: 'FIREFOX-1920x1080: Price Apply All',  
        use: FIREFOX1920, 
        grep: /Single Item - Price: Apply All/, 
        dependencies: ['CHROMIUM-1680x1050: Price Apply All'] 
      },

      // --- Single Item - Current Toppings & Condiment Group chain ---
      { name: 'CHROMIUM-1920x1080: Current Toppings & Condiment Group',
        use: CHROME1920,
        grep: /Single Item - Current Toppings & Condiment Group/, 
        dependencies: ['FIREFOX-1920x1080: Price Apply All']
      },
      { name: 'CHROMIUM-1680x1050: Current Toppings & Condiment Group', 
        use: CHROME1680, grep: /Single Item - Current Toppings & Condiment Group/, 
        dependencies: ['CHROMIUM-1920x1080: Current Toppings & Condiment Group']
      },
      { name: 'FIREFOX-1920x1080: Current Toppings & Condiment Group',  
        use: FIREFOX1920, 
        grep: /Single Item - Current Toppings & Condiment Group/, 
        dependencies: ['CHROMIUM-1680x1050: Current Toppings & Condiment Group'] 
      },

      // --- Single Item - Modifiers chain ---
      { name: 'CHROMIUM-1920x1080: Modifiers',
        use: CHROME1920,
        grep: /Single Item - Modifiers/, 
        dependencies: ['FIREFOX-1920x1080: Current Toppings & Condiment Group']
      },
      { name: 'CHROMIUM-1680x1050: Modifiers', 
        use: CHROME1680, grep: /Single Item - Modifiers/, 
        dependencies: ['CHROMIUM-1920x1080: Modifiers']
      },
      { name: 'FIREFOX-1920x1080: Modifiers',  
        use: FIREFOX1920, 
        grep: /Single Item - Modifiers/, 
        dependencies: ['CHROMIUM-1680x1050: Modifiers'] 
      },

      // --- Single Item - Advance chain ---
      { name: 'CHROMIUM-1920x1080: Advance',
        use: CHROME1920,
        grep: /Single Item - Advance/, 
        dependencies: ['FIREFOX-1920x1080: Modifiers']
      },
      { name: 'CHROMIUM-1680x1050: Advance', 
        use: CHROME1680, grep: /Single Item - Advance/, 
        dependencies: ['CHROMIUM-1920x1080: Advance']
      },
      { name: 'FIREFOX-1920x1080: Advance',  
        use: FIREFOX1920, 
        grep: /Single Item - Advance/, 
        dependencies: ['CHROMIUM-1680x1050: Advance'] 
      },

      // --- Single Item - ALL ---
      { name: 'CHROMIUM-1920x1080: ALL',
        use: CHROME1920,
        grep: /Single Item - ALL/, 
        dependencies: ['FIREFOX-1920x1080: Advance']
      },
      { name: 'CHROMIUM-1680x1050: ALL', 
        use: CHROME1680, grep: /Single Item - ALL/, 
        dependencies: ['CHROMIUM-1920x1080: ALL']
      },
      { name: 'FIREFOX-1920x1080: ALL',  
        use: FIREFOX1920, 
        grep: /Single Item - ALL/, 
        dependencies: ['CHROMIUM-1680x1050: ALL'] 
      },
      // Repeat the same 4-project chain for your other tests (Apply All, Ingredients, Modifiers, Advance, ALL)
    ],
});


// import { defineConfig, devices } from '@playwright/test';

// /**
//  * Read environment variables from file.
//  * https://github.com/motdotla/dotenv
//  */
// // import dotenv from 'dotenv';
// // import path from 'path';
// // dotenv.config({ path: path.resolve(__dirname, '.env') });

// /**
//  * See https://playwright.dev/docs/test-configuration.
//  */
// export default defineConfig({
//   testDir: './RunYourTestHere',
//   /* Run tests in files in parallel */
//   fullyParallel: true,
//   /* Fail the build on CI if you accidentally left test.only in the source code. */
//   forbidOnly: !!process.env.CI,
//   /* Retry on CI only */
//   retries: process.env.CI ? 2 : 0,
//   /* Opt out of parallel tests on CI. */
//   workers: process.env.CI ? 1 : undefined,
//   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
//   reporter: 'html',
//   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
//   use: {
//     /* Base URL to use in actions like `await page.goto('/')`. */
//     // baseURL: 'http://localhost:3000',

//     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
//     trace: 'on-first-retry',
//   },

//   /* Configure projects for major browsers */
//   projects: [
//     // Chromium-based browsers
//     {
//       name: 'CHROMIUM-1920x1080',
//       use: { ...devices['Desktop Chrome'],
//         viewport: { width: 1920, height: 1080 },
//       },
//     },
//     {
//       name: 'CHROMIUM-1680x1050',
//       use: { ...devices['Desktop Chrome'],
//         viewport: { width: 1680, height: 1050 },
//       },
//     },
//     {
//       name: 'CHROMIUM-1366x768',
//       use: { ...devices['Desktop Chrome'],
//         viewport: { width: 1366, height: 768 },
//       },
//     },

//     // Firefox-based browsers
//     {
//       name: 'FIREFOX-1920x1080',
//       use: { ...devices['Desktop Firefox'],
//         viewport: { width: 1920, height: 1080 },  
//       },
//     },
//     // {
//     //   name: 'FIREFOX-1680x1050',
//     //   use: { ...devices['Desktop Firefox'],
//     //     viewport: { width: 1680, height: 1050 },  
//     //   },
//     // },
//     // {
//     //   name: 'FIREFOX-1366x768',
//     //   use: { ...devices['Desktop Firefox'],
//     //     viewport: { width: 1366, height: 768 },  
//     //   },
//     // },

//     // MSEDGE-based browsers
//     // {
//     //   name: 'EDGE-1920x1080',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge',
//     //     viewport: { width: 1920, height: 1080 },  
//     //   },
//     // },
//     // {
//     //   name: 'EDGE-1680x1050',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge',
//     //     viewport: { width: 1680, height: 1050 },  
//     //   },
//     // },
//     // {
//     //   name: 'EDGE-1366x768',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge',
//     //     viewport: { width: 1366, height: 768 },  
//     //   },
//     // },

//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     // },

//     /* Test against mobile viewports. */
//     // {
//     //   name: 'Mobile Chrome',
//     //   use: { ...devices['Pixel 5'] },
//     // },
//     // {
//     //   name: 'Mobile Safari',
//     //   use: { ...devices['iPhone 12'] },
//     // },

//     /* Test against branded browsers. */
//     // {
//     //   name: 'Microsoft Edge',
//     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
//     // },
//     // {
//     //   name: 'Google Chrome',
//     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
//     // },
//   ],

//   /* Run your local dev server before starting the tests */
//   // webServer: {
//   //   command: 'npm run start',
//   //   url: 'http://localhost:3000',
//   //   reuseExistingServer: !process.env.CI,
//   // },
// });

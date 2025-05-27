import { defineConfig } from '@playwright/test';

export default defineConfig({
    globalSetup: './setup/global-setup.ts',
    globalTeardown: './teardown/global-teardown.ts',
    testDir: './tests',
    timeout: 30000,
    retries: 1,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        headless: true,
    },
    projects: [
        {
            name: 'form-runner',
            testDir: './tests/form-runner',
        }
    ],
});
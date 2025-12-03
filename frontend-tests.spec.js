/**
 * Frontend E2E Tests using Playwright
 * Tests user interface, navigation, and user flows
 */

import { test, expect } from '@playwright/test';

const FRONTEND_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:5000/api';

// Test data
const clientUser = {
  name: 'E2E Test Client',
  email: 'e2eclient@example.com',
  password: 'TestClient123!',
  role: 'client'
};

const freelancerUser = {
  name: 'E2E Test Freelancer',
  email: 'e2efreelancer@example.com',
  password: 'TestFreelancer123!',
  role: 'freelancer',
  skills: ['JavaScript', 'React', 'Node.js']
};

test.describe('FreelanceHub Frontend Tests', () => {
  
  test.describe('Authentication Flow', () => {
    
    test('should load homepage', async ({ page }) => {
      await page.goto(FRONTEND_URL);
      await expect(page).toHaveTitle(/FreelanceHub|Worksera/i);
    });
    
    test('should navigate to register page', async ({ page }) => {
      await page.goto(FRONTEND_URL);
      await page.click('text=Register');
      await expect(page).toHaveURL(/.*register/);
    });
    
    test('should register new client', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/register`);
      
      await page.fill('input[name="name"]', clientUser.name);
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      await page.selectOption('select[name="role"]', 'client');
      
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await page.waitForURL(/.*dashboard/, { timeout: 5000 });
    });
    
    test('should register new freelancer', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/register`);
      
      await page.fill('input[name="name"]', freelancerUser.name);
      await page.fill('input[name="email"]', freelancerUser.email);
      await page.fill('input[name="password"]', freelancerUser.password);
      await page.selectOption('select[name="role"]', 'freelancer');
      
      await page.click('button[type="submit"]');
      
      await page.waitForURL(/.*dashboard/, { timeout: 5000 });
    });
    
    test('should login with valid credentials', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      
      await page.click('button[type="submit"]');
      
      await page.waitForURL(/.*dashboard/, { timeout: 5000 });
    });
    
    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      
      await page.fill('input[name="email"]', 'wrong@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=/invalid|error|wrong/i')).toBeVisible({ timeout: 3000 });
    });
    
    test('should logout successfully', async ({ page }) => {
      // Login first
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      // Logout
      await page.click('text=/logout|sign out/i');
      await expect(page).toHaveURL(/.*login|\/$/);
    });
  });
  
  test.describe('Job Management (Client)', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login as client
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });
    
    test('should navigate to post job page', async ({ page }) => {
      await page.click('text=/post.*job|create.*job/i');
      await expect(page).toHaveURL(/.*post|create|new.*job/i);
    });
    
    test('should create new job posting', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs/post`);
      
      await page.fill('input[name="title"]', 'E2E Test Job - Web Development');
      await page.fill('textarea[name="description"]', 'This is a test job posting for E2E testing');
      await page.fill('input[name="budget"]', '5000');
      await page.fill('input[name="duration"]', '2 months');
      
      await page.click('button[type="submit"]');
      
      // Should show success message or redirect
      await page.waitForTimeout(2000);
    });
    
    test('should view posted jobs', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs/my-jobs`);
      
      // Should display jobs list
      await expect(page.locator('text=/E2E Test Job/i')).toBeVisible({ timeout: 5000 });
    });
    
    test('should edit job posting', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs/my-jobs`);
      
      await page.click('text=/edit/i');
      await page.fill('input[name="budget"]', '6000');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
    });
  });
  
  test.describe('Job Browsing (Freelancer)', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login as freelancer
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', freelancerUser.email);
      await page.fill('input[name="password"]', freelancerUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });
    
    test('should browse available jobs', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs`);
      
      // Should display jobs
      await expect(page.locator('[data-testid="job-card"]').first()).toBeVisible({ timeout: 5000 });
    });
    
    test('should view job details', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs`);
      
      await page.click('[data-testid="job-card"]');
      
      // Should show job details
      await expect(page.locator('text=/description|budget|skills/i')).toBeVisible();
    });
    
    test('should search jobs', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs`);
      
      await page.fill('input[placeholder*="search"]', 'Web Development');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
    });
    
    test('should filter jobs by category', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs`);
      
      await page.selectOption('select[name="category"]', 'Web Development');
      
      await page.waitForTimeout(1000);
    });
  });
  
  test.describe('Proposal Submission', () => {
    
    test.beforeEach(async ({ page }) => {
      // Login as freelancer
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', freelancerUser.email);
      await page.fill('input[name="password"]', freelancerUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });
    
    test('should submit proposal on job', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/jobs`);
      
      // Click on first job
      await page.click('[data-testid="job-card"]');
      
      // Submit proposal
      await page.click('text=/submit.*proposal|apply/i');
      
      await page.fill('textarea[name="coverLetter"]', 'I am interested in this project...');
      await page.fill('input[name="proposedBudget"]', '5500');
      await page.fill('input[name="estimatedDuration"]', '1.5 months');
      
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(2000);
    });
    
    test('should view submitted proposals', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/proposals/my-proposals`);
      
      // Should display proposals
      await expect(page.locator('[data-testid="proposal-card"]')).toBeVisible({ timeout: 5000 });
    });
  });
  
  test.describe('Messaging', () => {
    
    test.beforeEach(async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });
    
    test('should navigate to messages', async ({ page }) => {
      await page.click('text=/messages|inbox/i');
      await expect(page).toHaveURL(/.*messages/);
    });
    
    test('should send message', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/messages`);
      
      // Select conversation or start new
      await page.click('[data-testid="conversation"]');
      
      await page.fill('input[name="message"]', 'Hello, this is a test message');
      await page.click('button[type="submit"]');
      
      // Message should appear
      await expect(page.locator('text=Hello, this is a test message')).toBeVisible({ timeout: 3000 });
    });
  });
  
  test.describe('Dashboard', () => {
    
    test('should display client dashboard', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      // Should show client-specific content
      await expect(page.locator('text=/posted jobs|active contracts/i')).toBeVisible();
    });
    
    test('should display freelancer dashboard', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', freelancerUser.email);
      await page.fill('input[name="password"]', freelancerUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      // Should show freelancer-specific content
      await expect(page.locator('text=/available jobs|my proposals/i')).toBeVisible();
    });
  });
  
  test.describe('Navigation', () => {
    
    test('should navigate between pages', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      await page.fill('input[name="email"]', clientUser.email);
      await page.fill('input[name="password"]', clientUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
      
      // Navigate to different pages
      await page.click('text=/jobs/i');
      await expect(page).toHaveURL(/.*jobs/);
      
      await page.click('text=/contracts/i');
      await expect(page).toHaveURL(/.*contracts/);
      
      await page.click('text=/messages/i');
      await expect(page).toHaveURL(/.*messages/);
    });
  });
  
  test.describe('Responsive Design', () => {
    
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(FRONTEND_URL);
      
      // Should display mobile menu
      await expect(page).toBeVisible();
    });
    
    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(FRONTEND_URL);
      
      await expect(page).toBeVisible();
    });
  });
  
  test.describe('Form Validation', () => {
    
    test('should validate registration form', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/register`);
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=/required|invalid/i')).toBeVisible({ timeout: 2000 });
    });
    
    test('should validate email format', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/register`);
      
      await page.fill('input[name="email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=/invalid.*email/i')).toBeVisible({ timeout: 2000 });
    });
  });
});

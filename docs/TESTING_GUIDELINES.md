# Testing Guidelines

This document provides comprehensive guidance for testing the Bowie's Books application, covering unit tests with React Testing Library (RTL) and end-to-end tests with Playwright.

## 📋 Table of Contents

1. [Prerequisites & Installation](#prerequisites--installation)
2. [Running Tests](#running-tests)
3. [Directory Structure](#directory-structure)
4. [Unit Testing with RTL](#unit-testing-with-rtl)
5. [E2E Testing with Playwright](#e2e-testing-with-playwright)
6. [Coverage Requirements](#coverage-requirements)
7. [Debugging Test Failures](#debugging-test-failures)
8. [Best Practices](#best-practices)

## 🔧 Prerequisites & Installation

### System Requirements
- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Git for version control

### Installation Steps

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd bowie-book
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (for E2E tests):
   ```bash
   npx playwright install
   ```

4. **Verify installation**:
   ```bash
   npm run test:unit
   npm run e2e
   ```

## 🏃 Running Tests

### Unit Tests (Vitest + RTL)

```bash
# Run all unit tests once
npm run test:unit

# Run tests in watch mode (recommended during development)
npm run test:watch
# Alternative watch mode command
npm run test:unit:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm run test:unit -- Book.test.tsx

# Run tests matching a pattern
npm run test:unit -- --grep "navigation"
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run e2e

# Run E2E tests with CI reporter (less verbose)
npm run e2e:ci

# Run specific test file
npx playwright test book-navigation.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests on specific browser
npx playwright test --project=chromium
```

### Complete Test Suite

```bash
# Run all tests (unit + E2E)
npm run test

# Run all tests with coverage and CI reporters (as in CI)
npm run ci:test
```

## 📁 Directory Structure

```
bowie-book/
├── src/
│   ├── components/
│   │   ├── Book/
│   │   │   ├── Book.tsx
│   │   │   ├── Book.test.tsx          # Unit tests for Book component
│   │   │   └── Book.css
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   ├── Home.test.tsx          # Unit tests for Home component
│   │   │   ├── Home.css
│   │   │   └── __snapshots__/         # Jest snapshots
│   │   └── ...
│   ├── setupTests.tsx                 # Test configuration and utilities
│   └── ...
├── tests/
│   └── e2e/                          # Playwright E2E tests
│       ├── book-navigation.spec.ts    # Book navigation tests
│       ├── home.spec.ts              # Home page tests
│       └── routing.spec.ts           # Router tests
├── test-results/                     # Generated test artifacts
├── coverage/                         # Coverage reports
├── vitest.config.ts                  # Vitest configuration
└── playwright.config.ts              # Playwright configuration
```

### Naming Conventions

- **Unit Tests**: `ComponentName.test.tsx` (co-located with components)
- **E2E Tests**: `feature-name.spec.ts` (in `tests/e2e/`)
- **Test Utilities**: `setupTests.tsx`, `test-utils.ts`
- **Snapshots**: `__snapshots__/TestName.test.tsx.snap`

## 🧪 Unit Testing with RTL

### Test Structure

Our unit tests follow this pattern:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  describe('Feature Group', () => {
    it('should do something specific', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ComponentName />);
      
      // Act
      await user.click(screen.getByRole('button', { name: /click me/i }));
      
      // Assert
      await waitFor(() => {
        expect(screen.getByText('Expected Result')).toBeInTheDocument();
      });
    });
  });
});
```

### Key Testing Utilities

1. **renderWithRouter** - Custom utility for components requiring router context:
   ```typescript
   export const renderWithRouter = (
     ui: ReactElement,
     initialPath: string = '/'
   ) => {
     // Prepend the test-book prefix to the path
     const fullPath = `/test-book${initialPath === '/' ? '' : initialPath}`;
     return render(
       <MemoryRouter initialEntries={[fullPath]}>
         {ui}
       </MemoryRouter>
     );
   };
   ```

2. **Mocking Images** - Mock image loading for consistent tests:
   ```typescript
   beforeEach(() => {
     Object.defineProperty(global, 'Image', {
       value: class MockImage {
         constructor() {
           setTimeout(() => {
             if (this.onload) this.onload();
           }, 0);
         }
         set src(value: string) {
           setTimeout(() => {
             if (this.onload) this.onload();
           }, 0);
         }
         onload: (() => void) | null = null;
         onerror: (() => void) | null = null;
       },
       configurable: true,
     });
   });
   ```

### Writing RTL Tests

#### 1. Testing User Interactions

```typescript
it('should navigate to next page when next button is clicked', async () => {
  const user = userEvent.setup();
  renderWithRouter('/book/1');
  
  const nextButton = screen.getByRole('button', { name: /next page/i });
  await user.click(nextButton);
  
  await waitFor(() => {
    expect(screen.getByAltText('Page 2')).toBeInTheDocument();
  });
});
```

#### 2. Testing Keyboard Navigation

```typescript
it('should navigate with arrow keys', async () => {
  renderWithRouter('/book/1');
  
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  
  await waitFor(() => {
    expect(screen.getByAltText('Page 2')).toBeInTheDocument();
  });
});
```

#### 3. Testing Loading States

```typescript
it('should show loading spinner while image loads', async () => {
  renderWithRouter('/book/1');
  
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
  });
});
```

#### 4. Testing Error Boundaries

```typescript
it('should handle image load errors gracefully', async () => {
  // Mock image error
  Object.defineProperty(global, 'Image', {
    value: class MockImage {
      set src(value: string) {
        setTimeout(() => {
          if (this.onerror) this.onerror();
        }, 0);
      }
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
    },
    configurable: true,
  });
  
  renderWithRouter('/book/1');
  
  // Verify graceful handling
  expect(screen.getByAltText('Page 1')).toBeInTheDocument();
});
```

## 🎭 E2E Testing with Playwright

### Test Structure

E2E tests follow this pattern:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Area', () => {
  test('should accomplish end-to-end workflow', async ({ page }) => {
    // Navigate to starting point
    await page.goto('/');
    
    // Perform actions
    await page.click('text=Book Title');
    
    // Assert expected outcomes
    await expect(page).toHaveURL('/book-slug');
    await expect(page.locator('img[alt="Page 0"]')).toBeVisible();
  });
});
```

### Writing Playwright Tests

#### 1. Navigation Testing

```typescript
test('should navigate through book pages', async ({ page }) => {
  await page.goto('/super-bowie');
  
  // Navigate forward
  await page.click('button:has-text("Next")');
  await expect(page).toHaveURL(/\/super-bowie\/1/);
  
  // Navigate backward
  await page.click('button:has-text("Previous")');
  await expect(page).toHaveURL(/\/super-bowie$/);
});
```

#### 2. Keyboard Navigation

```typescript
test('should handle keyboard navigation', async ({ page }) => {
  await page.goto('/super-bowie');
  
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/super-bowie\/1/);
  
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/\/super-bowie$/);
});
```

#### 3. Mobile/Touch Testing

```typescript
test('should handle touch navigation', async ({ page }) => {
  await page.goto('/super-bowie');
  
  // Tap right side of screen
  await page.touchscreen.tap(1000, 400);
  await expect(page).toHaveURL(/\/super-bowie\/1/);
  
  // Tap left side of screen
  await page.touchscreen.tap(280, 400);
  await expect(page).toHaveURL(/\/super-bowie$/);
});
```

#### 4. Visual Testing

```typescript
test('should take screenshots for visual regression', async ({ page }) => {
  await page.goto('/super-bowie');
  
  // Take screenshot
  await page.screenshot({ 
    path: 'test-results/super-bowie-cover.png' 
  });
  
  // Navigate and capture each page
  for (let i = 1; i <= 3; i++) {
    await page.click('button:has-text("Next")');
    await page.screenshot({ 
      path: `test-results/super-bowie-page-${i}.png` 
    });
  }
});
```

## 📊 Coverage Requirements

### Current Coverage Thresholds

Our Vitest configuration enforces minimum coverage:

```typescript
// vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'html'],
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80,
}
```

### Coverage Expectations

- **Statements**: 80% minimum
- **Branches**: 80% minimum (all conditional paths)
- **Functions**: 80% minimum (all exported functions)
- **Lines**: 80% minimum (executable code lines)

### Checking Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# CI-friendly text output
npm run test:coverage -- --reporter=text
```

### Coverage Exemptions

Some code may be exempt from coverage requirements:

```typescript
// Istanbul ignore comments
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  // Development-only code
}

// Vitest ignore comments
// @vitest-ignore
const debugFunction = () => { /* debug only */ };
```

## 🐛 Debugging Test Failures

### Unit Test Debugging

#### 1. Using Debug Output

```typescript
import { screen, render, debug } from '@testing-library/react';

it('should debug render output', () => {
  render(<Component />);
  
  // Print current DOM
  screen.debug();
  
  // Print specific element
  debug(screen.getByRole('button'));
});
```

#### 2. Using Queries to Find Elements

```typescript
// Use getBy* queries to assert presence
expect(screen.getByRole('button')).toBeInTheDocument();

// Use queryBy* queries to assert absence
expect(screen.queryByRole('button')).not.toBeInTheDocument();

// Use findBy* queries for async elements
await screen.findByRole('button');
```

#### 3. Debugging Async Issues

```typescript
// Use waitFor for async state changes
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Use waitForElementToBeRemoved for cleanup
await waitForElementToBeRemoved(screen.getByText('Loading'));
```

### E2E Test Debugging

#### 1. Running in Headed Mode

```bash
npx playwright test --headed
```

#### 2. Using Playwright Inspector

```bash
npx playwright test --debug
```

#### 3. Capturing Screenshots/Videos

```typescript
// In test
await page.screenshot({ path: 'debug-screenshot.png' });

// Configure in playwright.config.ts
use: {
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
}
```

#### 4. Slow Motion for Debugging

```typescript
// playwright.config.ts
use: {
  launchOptions: {
    slowMo: 1000, // 1 second delay between actions
  },
}
```

### Common Debugging Scenarios

#### 1. Element Not Found

```typescript
// Check if element exists with different selector
await expect(page.locator('button')).toBeVisible();
await expect(page.locator('[data-testid="submit"]')).toBeVisible();
await expect(page.locator('text=Submit')).toBeVisible();
```

#### 2. Timing Issues

```typescript
// Wait for specific condition
await page.waitForSelector('img[alt="Page 1"]');
await page.waitForURL(/\/book\/1/);
await page.waitForLoadState('networkidle');
```

#### 3. Memory Router Issues

```typescript
// Ensure proper router context
const renderWithRouter = (initialPath = '/') => {
  const fullPath = `/test-book${initialPath === '/' ? '' : initialPath}`;
  return render(
    <MemoryRouter initialEntries={[fullPath]}>
      <Component />
    </MemoryRouter>
  );
};
```

## 📝 Best Practices

### Unit Testing Best Practices

1. **Test User Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state directly

2. **Use Semantic Queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

3. **Test Accessibility**
   - Ensure proper ARIA labels and roles
   - Test keyboard navigation

4. **Mock External Dependencies**
   - Mock API calls, timers, and browser APIs
   - Use `vi.mock()` for module mocks

5. **Clean Up After Tests**
   - Use `afterEach(() => cleanup())`
   - Clear mocks and timers

### E2E Testing Best Practices

1. **Test Critical User Journeys**
   - Focus on happy path scenarios
   - Test error conditions sparingly

2. **Use Page Object Models**
   - Create reusable page representations
   - Encapsulate selectors and actions

3. **Wait for Conditions**
   - Use `waitFor*` methods instead of `sleep`
   - Wait for specific elements or states

4. **Parallelize Tests**
   - Use `test.describe.configure({ mode: 'parallel' })`
   - Ensure tests are independent

5. **Use Stable Selectors**
   - Prefer data-testid over CSS selectors
   - Use semantic selectors when possible

### General Testing Best Practices

1. **Write Descriptive Test Names**
   ```typescript
   // Good
   it('should navigate to next page when next button is clicked')
   
   // Bad
   it('should work')
   ```

2. **Follow AAA Pattern**
   - **Arrange**: Set up test data
   - **Act**: Perform the action
   - **Assert**: Verify the outcome

3. **Test One Thing at a Time**
   - Each test should verify one specific behavior
   - Avoid testing multiple scenarios in one test

4. **Use Data-Driven Tests**
   ```typescript
   const testCases = [
     { input: '/1', expected: 'Page 1' },
     { input: '/2', expected: 'Page 2' },
   ];
   
   testCases.forEach(({ input, expected }) => {
     it(`should show ${expected} for ${input}`, () => {
       // Test implementation
     });
   });
   ```

5. **Keep Tests Independent**
   - Each test should be able to run in isolation
   - Don't rely on test execution order

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

For questions or improvements to this guide, please create an issue or submit a pull request.

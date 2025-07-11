# Bowie's Books

An enchanting, rainbow-themed children's book application built with React and TypeScript, featuring a collection of magical illustrated stories designed for young readers.

## 📚 Project Overview

This vibrant application provides a delightful reading experience for children's books, featuring:

- A colorful home page with animated book covers in a responsive grid
- Interactive storybook pages with floating illustrations and text
- Rainbow-themed navigation with colorful buttons
- Responsive design optimized for iPad and other devices
- Fun animations and playful visual effects

## 📋 Features

- **Rainbow Theme**: Colorful gradients, animations, and interactive elements designed for children
- **Multiple Books**: A growing collection of beautifully illustrated stories
- **Touch-Friendly Navigation**: Large, colorful buttons and swipe navigation
- **Responsive Layout**: Adapts beautifully to iPads, phones, and desktop screens
- **Animated Elements**: Subtle animations like floating images and gradient shifts
- **Custom Typography**: Uses the Texturina font for an enchanting storybook feel

## 🚀 Getting Started

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint to check code quality
- `npm run format` - Formats code using Prettier
- `npm run typecheck` - Runs TypeScript type checking
- `npm run preview` - Previews the production build locally
- `npm run test` - Runs complete test suite (unit + E2E)
- `npm run test:watch` - Runs unit tests in watch mode
- `npm run test:unit` - Runs unit tests once
- `npm run test:unit:watch` - Runs unit tests in watch mode
- `npm run test:coverage` - Runs unit tests with coverage report
- `npm run e2e` - Runs end-to-end tests
- `npm run e2e:ci` - Runs end-to-end tests with CI reporter
- `npm run ci:test` - Runs complete test suite with coverage and CI reporters

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The CI pipeline automatically runs on every push to the main branch and on pull requests.

### CI Jobs Overview

The CI pipeline consists of several jobs that run in parallel to ensure code quality:

#### 1. **Prettier Check** (`prettier`)
- **Purpose**: Ensures code formatting consistency across the project
- **Runs**: `npm run format:check`
- **Local equivalent**: `npm run format:check` (check) or `npm run format` (auto-fix)
- **What it does**: Validates that all source files follow the configured Prettier formatting rules

#### 2. **Linting** (`lint`)
- **Purpose**: Checks code quality and catches potential issues
- **Runs**: `npm run lint`
- **Local equivalent**: `npm run lint`
- **What it does**: Runs ESLint to identify code quality issues, unused variables, and potential bugs

#### 3. **Type Checking** (`typecheck`)
- **Purpose**: Validates TypeScript types without emitting files
- **Runs**: `npm run typecheck`
- **Local equivalent**: `npm run typecheck`
- **What it does**: Ensures all TypeScript code is properly typed and catches type errors

#### 4. **Unit Tests** (`unit-tests`)
- **Purpose**: Runs unit tests with coverage reporting
- **Runs**: `npm run test:coverage`
- **Local equivalent**: `npm run test:coverage` (with coverage) or `npm run test:unit` (without coverage)
- **Dependencies**: Waits for `lint`, `prettier`, and `typecheck` jobs to complete
- **What it does**: Executes all unit tests using Vitest and generates coverage reports

#### 5. **End-to-End Tests** (`e2e`)
- **Purpose**: Runs browser-based integration tests
- **Runs**: `npm run e2e:ci`
- **Local equivalent**: `npm run e2e` (with UI) or `npm run e2e:ci` (headless)
- **Dependencies**: Waits for `lint`, `prettier`, and `typecheck` jobs to complete
- **What it does**: Builds the project and runs Playwright tests to verify the application works end-to-end

#### 6. **Comprehensive Test & Build** (`test-and-build`)
- **Purpose**: Complete validation including type checking, formatting, unit tests, build, and E2E tests
- **What it does**: Runs all checks in sequence and uploads test results and build artifacts
- **Includes**: Type checking, formatting check, unit tests with coverage, build process, and E2E tests

### Running CI Commands Locally

To replicate the CI environment locally, run these commands in order:

```bash
# Install dependencies (equivalent to npm ci in CI)
npm install

# 1. Check code formatting
npm run format:check
# Or auto-fix formatting issues:
npm run format

# 2. Run linting
npm run lint

# 3. Run type checking
npm run typecheck

# 4. Run unit tests with coverage
npm run test:coverage

# 5. Build the project
npm run build

# 6. Install Playwright browsers (first time only)
npx playwright install --with-deps

# 7. Run E2E tests
npm run e2e:ci

# Or run everything at once:
npm run ci:test
```

### Viewing Coverage Reports

After running tests with coverage, you can view the reports in several ways:

#### Terminal Output
The coverage summary is displayed directly in the terminal after running:
```bash
npm run test:coverage
```

#### HTML Coverage Report
A detailed HTML report is generated in the `coverage/` directory:
```bash
# Run tests with coverage
npm run test:coverage

# Open the HTML report in your browser
# On macOS:
open coverage/index.html

# On Linux:
xdg-open coverage/index.html

# On Windows:
start coverage/index.html
```

#### Coverage Artifacts in CI
- **Unit test coverage**: Uploaded as `vitest-coverage` artifact
- **E2E test results**: Uploaded as `playwright-report` artifact (on failure)
- **Build artifacts**: Uploaded as `build-artifacts` artifact

These artifacts are retained for 30 days and can be downloaded from the GitHub Actions run page.

### Troubleshooting CI Issues

**Formatting Issues:**
```bash
# Check what files have formatting issues
npm run format:check

# Fix formatting issues automatically
npm run format
```

**Linting Issues:**
```bash
# See detailed linting errors
npm run lint

# Some issues can be auto-fixed
npm run lint -- --fix
```

**Type Errors:**
```bash
# See detailed type errors
npm run typecheck

# Or use your IDE's TypeScript integration for real-time feedback
```

**Test Failures:**
```bash
# Run unit tests in watch mode for development
npm run test:unit:watch

# Run specific test files
npm run test:unit -- src/components/Book/Book.test.tsx

# Run E2E tests with UI for debugging
npm run e2e
```

**Build Issues:**
```bash
# Run build locally to see detailed errors
npm run build

# Check build output
npm run preview
```

## 📱 Deployment

This project is configured for deployment to Cloudflare Pages.

### Deployment to Cloudflare Pages

1. Push your changes to the main branch of your GitHub repository
2. Cloudflare Pages will automatically build and deploy the app
3. Configuration settings for Cloudflare Pages:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: 18 (or latest LTS)

## 🧩 Project Structure

```
bowie-book/
├── public/               # Static assets
│   ├── books/            # Book images
│   ├── fonts/            # Custom fonts
│   └── ...               # Favicons and other assets
├── src/
│   ├── components/       # React components
│   │   ├── Book/         # Book component with Tailwind classes
│   │   └── Home/         # Home component with Tailwind classes
│   ├── books/            # Book content components
│   │   ├── bonne-adventure/
│   │   ├── dragon-fighter/
│   │   ├── skyward-bound/
│   │   └── ziggy-the-bunny/
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── index.css         # Tailwind CSS imports and custom styles
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Project dependencies and scripts
```

## 🧠 Architecture

The application uses a functional component architecture with TypeScript and Tailwind CSS:

- `Book.tsx` - Reusable component utilizing Tailwind CSS for styling.
- Book components are content-driven and provide:
  - `bookKey` - Unique identifier for the book.
  - `pages` - Array of page objects with image and text content, all styled via Tailwind utility classes.

### Migration Rationale

With Tailwind CSS, the application has minimized the need for maintaining multiple CSS modules. The utility-first approach allows for rapid UI development with less focus on custom classes. Custom theme configurations ensure consistency in design while maintaining flexibility.

## 🎨 Design Features

- **Rainbow Theme**: Vibrant colors and gradients throughout the application
- **Animation Effects**: Achieved through Tailwind CSS utilities
- **Child-Friendly UI**: Large touch targets and intuitive navigation
- **iPad-Optimized**: Special styling for the primary device (iPad), using Tailwind's responsive utilities
- **Responsive Design**: Adapts to different screen sizes and orientations with Tailwind's grid system

## 🎨 Tailwind CSS Setup

The project uses **Tailwind CSS v4** with a custom theme configuration that includes:

- **Custom Colors**: Rainbow palette with semantic color names
- **Design Tokens**: Consistent spacing, typography, and border radius values
- **Custom Animations**: Utilized through Tailwind's animation utilities
- **CSS Variables**: Both Tailwind v4 `@theme` and traditional `:root` variables for compatibility
- **Custom Utilities**: Dynamic utility classes

### Key Tailwind Features Used:
- **Utility-First Approach**: All styling done with utility classes
- **Custom Theme**: Defined in `src/index.css` using `@theme` directive
- **Responsive Design**: Mobile-first breakpoints for all screen sizes
- **Custom Animations**: Tailwind classes for interactive elements
- **CSS Variables**: Seamless integration with existing custom properties

## 🔨 Technologies

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React Router](https://reactrouter.com/) - Routing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Vitest](https://vitest.dev/) - Unit testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing utilities
- [Playwright](https://playwright.dev/) - End-to-end testing framework

## 📖 Documentation

- [Testing Guidelines](./docs/TESTING_GUIDELINES.md) - Comprehensive guide for running and writing tests

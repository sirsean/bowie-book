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
│   │   ├── Book/         # Book component with styles
│   │   └── Home/         # Home component with styles
│   ├── books/            # Book content components
│   │   ├── bonne-adventure/
│   │   ├── dragon-fighter/
│   │   ├── skyward-bound/
│   │   └── ziggy-the-bunny/
│   ├── styles/           # Global styles
│   │   ├── global.css    # Global style rules
│   │   ├── variables.css # CSS variables and theme
│   │   └── reset.css     # CSS reset
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Project dependencies and scripts
```

## 🧠 Architecture

The application uses a functional component architecture with TypeScript:

- `Book.tsx` - Reusable component for displaying any book with navigation
- Individual book components provide content to the Book component:
  - `bookKey` - Unique identifier for the book
  - `images` - Array of image paths
  - `texts` - Array of text content for each page

## 🎨 Design Features

- **Rainbow Theme**: Vibrant colors and gradients throughout the application
- **Animation Effects**: Floating images, gradient shifts, and interactive elements
- **Child-Friendly UI**: Large touch targets and intuitive navigation
- **iPad-Optimized**: Special styling for the primary device (iPad)
- **Responsive Design**: Adapts to different screen sizes and orientations

## 🛠️ Technologies

- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React Router](https://reactrouter.com/) - Routing
- [Vite](https://vitejs.dev/) - Build tool and development server
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Vitest](https://vitest.dev/) - Unit testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing utilities
- [Playwright](https://playwright.dev/) - End-to-end testing framework

## 📖 Documentation

- [Testing Guidelines](./docs/TESTING_GUIDELINES.md) - Comprehensive guide for running and writing tests

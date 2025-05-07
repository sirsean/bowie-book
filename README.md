# Bowie's Books

An interactive children's book application built with React and Vite, featuring a collection of illustrated stories.

## 📚 Project Overview

This application provides an interactive reading experience for children's books, featuring:

- A home page with a grid of book covers
- Individual book pages with illustrations and text
- Navigation controls for moving between pages
- Responsive design that works on various devices

## 📋 Features

- **Multiple Books**: A collection of different stories to choose from
- **Interactive Navigation**: Easy-to-use buttons for moving between pages
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Custom Typography**: Uses the Texturina font for a storybook feel

## 🚀 Getting Started

### Installation

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run lint` - Runs ESLint to check code quality
- `npm run format` - Formats code using Prettier
- `npm run typecheck` - Runs TypeScript type checking
- `npm run preview` - Previews the production build locally

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
│   ├── books/            # Book components
│   │   ├── Book.tsx      # Base Book component (functional)
│   │   └── */            # Individual book folders
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   ├── App.css           # Application styles
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Project dependencies and scripts
```

## 🧠 Architecture

The application uses a functional component pattern with composition:

- `Book.tsx` - Base functional component with common book functionality
- Individual book components use the Book component and provide:
  - `bookKey` - Unique identifier for the book
  - `images` - Array of image paths
  - `texts` - Array of text content for each page
  
TypeScript provides static type checking and better documentation throughout the application.

## 🛠️ Technologies

- [React](https://reactjs.org/) - UI library
- [React Router](https://reactrouter.com/) - Routing
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

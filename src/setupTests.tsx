import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReactElement } from 'react';

afterEach(() => cleanup());

// Helper function to render components with router context
export const renderWithRouter = (ui: ReactElement, initialPath: string = '/') => {
  // Prepend the test-book prefix to the path
  const fullPath = `/test-book${initialPath === '/' ? '' : initialPath}`;
  return render(<MemoryRouter initialEntries={[fullPath]}>{ui}</MemoryRouter>);
};

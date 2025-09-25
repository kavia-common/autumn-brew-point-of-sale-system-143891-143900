import { render, screen } from '@testing-library/react';
import App from './App';

test('renders layout navigation', () => {
  render(<App />);
  expect(screen.getByText(/Autumn Brew POS/i)).toBeInTheDocument();
  expect(screen.getByText(/Orders/i)).toBeInTheDocument();
  expect(screen.getByText(/Menu/i)).toBeInTheDocument();
  expect(screen.getByText(/Sales/i)).toBeInTheDocument();
});

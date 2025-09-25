import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app without crashing", () => {
  render(<App />);
  // Ensure header brand renders
  const brandText = screen.getByText(/Autumn Brew POS/i);
  expect(brandText).toBeInTheDocument();
});

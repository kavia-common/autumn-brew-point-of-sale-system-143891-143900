import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// PUBLIC_INTERFACE
test("renders app without crashing", () => {
  /**
   * Render the app inside a MemoryRouter so components relying on
   * react-router hooks (e.g., useLocation in Header) have a router context
   * during tests.
   */
  render(
    <MemoryRouter initialEntries={["/orders"]}>
      <App />
    </MemoryRouter>
  );
  // Ensure header brand renders
  const brandText = screen.getByText(/Autumn Brew POS/i);
  expect(brandText).toBeInTheDocument();
});

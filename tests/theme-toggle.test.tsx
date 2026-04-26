import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeToggle } from "../components/ui/ThemeToggle";

describe("theme toggle accessibility", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("exposes the current pressed state and keeps theme persistence in sync", async () => {
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", {
      name: /switch to light mode/i,
    });

    await waitFor(() => {
      expect(button).toHaveAttribute("aria-pressed", "true");
    });
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("inkwell-theme")).toBe("dark");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAccessibleName("Switch to dark mode");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("inkwell-theme")).toBe("light");
  });
});

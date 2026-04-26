import { render, screen } from "@testing-library/react";
import { Navbar } from "../components/layout/Navbar";

const mockedUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockedUsePathname(),
}));

describe("primary navigation accessibility", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
  });

  it("marks the current route in the navbar", () => {
    mockedUsePathname.mockReturnValue("/blog");

    render(<Navbar />);

    expect(
      screen.getByRole("link", {
        name: /blog/i,
      }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", {
        name: /about/i,
      }),
    ).not.toHaveAttribute("aria-current");
  });
});

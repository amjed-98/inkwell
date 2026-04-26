import { render, screen } from "@testing-library/react";
import AboutPage from "../app/about/page";

describe("about page", () => {
  it("presents the author profile, social links, and recent writing", async () => {
    render(await AboutPage());

    expect(
      screen.getByRole("heading", {
        name: /amjad yahia builds calm, search-ready products for content-heavy teams/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/full-stack engineer focused on editorial systems/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /github/i,
      }),
    ).toHaveAttribute("href", "https://github.com/amjed-98");
    expect(
      screen.getByRole("link", {
        name: /linkedin/i,
      }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/amjedyahia");
    expect(
      screen.getByRole("heading", {
        name: /recent writing/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /read designing archive pages that carry their own seo weight/i,
      }),
    ).toHaveAttribute("href", "/blog/designing-archive-pages-that-carry-their-own-seo-weight");
    expect(
      screen.getByRole("link", {
        name: /read building a static search experience that stays lightweight/i,
      }),
    ).toHaveAttribute("href", "/blog/building-a-static-search-experience-that-stays-lightweight");
  });
});

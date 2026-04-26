import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("homepage", () => {
  it("presents Inkwell as an editorial SEO portfolio with primary navigation", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /writing about the web, one post at a time/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/editorial next\.js seo showcase/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /explore the blog/i,
      }),
    ).toHaveAttribute("href", "/blog");
    expect(
      screen.getByRole("link", {
        name: /about amjad/i,
      }),
    ).toHaveAttribute("href", "/about");
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { metadata } from "../app/layout";
import Loading from "../app/loading";
import NotFound from "../app/not-found";

describe("application shell", () => {
  it("exports Inkwell-branded metadata", () => {
    expect(metadata.title).toEqual("Inkwell | Editorial Next.js SEO Portfolio");
    expect(metadata.description).toMatch(/editorial next\.js seo showcase/i);
  });

  it("renders a useful not-found page with recovery links", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", {
        name: "404",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /return home/i,
      }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", {
        name: /browse articles/i,
      }),
    ).toHaveAttribute("href", "/blog");
  });

  it("announces loading progress for assistive technology", () => {
    render(<Loading />);

    expect(screen.getByRole("status")).toHaveTextContent(
      /loading the inkwell shell/i,
    );
  });
});

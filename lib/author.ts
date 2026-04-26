export type AuthorProfile = {
  bio: string;
  focus: string[];
  location: string;
  name: string;
  role: string;
  socials: {
    github: string;
    linkedin: string;
    x: string;
  };
  summary: string;
};

export const AUTHOR_PROFILE: AuthorProfile = {
  name: "Amjad Yahia",
  role: "Full-stack engineer, editorial systems builder, and technical writer",
  location: "Gaza, Palestine",
  summary:
    "Full-stack engineer focused on editorial systems, technical SEO, and performance-conscious product delivery for content-heavy teams.",
  bio: "Amjad designs and ships calm publishing experiences that make content easier to discover, maintain, and trust. Inkwell is his proving ground for route-level SEO, MDX workflows, and static-first product decisions that hold up under inspection.",
  focus: [
    "Next.js architecture for editorial products",
    "Structured content models and MDX workflows",
    "Search, crawlability, and performance tuning",
  ],
  socials: {
    github: "https://github.com/amjed-98",
    linkedin: "https://www.linkedin.com/in/amjedyahia",
    x: "https://x.com/amjed_98",
  },
};

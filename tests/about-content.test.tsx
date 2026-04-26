import { getAllCategories, getAllPosts, getFeaturedPost } from "../lib/posts";

describe("expanded editorial library", () => {
  it("loads multiple authored posts and keeps them sorted newest first", async () => {
    const posts = await getAllPosts();

    expect(posts).toHaveLength(3);
    expect(posts.map((post) => post.slug)).toEqual([
      "designing-archive-pages-that-carry-their-own-seo-weight",
      "building-a-static-search-experience-that-stays-lightweight",
      "introducing-inkwell",
    ]);
    expect(posts.every((post) => post.author.name === "Amjad Yahia")).toBe(true);
  });

  it("keeps a single featured post while exposing broader category coverage", async () => {
    await expect(getFeaturedPost()).resolves.toMatchObject({
      slug: "introducing-inkwell",
    });

    await expect(getAllCategories()).resolves.toEqual([
      {
        slug: "content-strategy",
        name: "Content strategy",
        postCount: 1,
      },
      {
        slug: "editorial-systems",
        name: "Editorial systems",
        postCount: 1,
      },
      {
        slug: "search-experience",
        name: "Search experience",
        postCount: 1,
      },
    ]);
  });
});

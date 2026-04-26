import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { GET as getRss } from "../app/rss.xml/route";

describe("crawl and feed surfaces", () => {
  it("publishes sitemap entries for static pages, posts, and category archives", async () => {
    const entries = await sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://inkwell-demo.netlify.app/",
          changeFrequency: "monthly",
          priority: 1,
        }),
        expect.objectContaining({
          url: "https://inkwell-demo.netlify.app/about",
          changeFrequency: "monthly",
          priority: 0.8,
        }),
        expect.objectContaining({
          url: "https://inkwell-demo.netlify.app/blog",
          changeFrequency: "weekly",
          priority: 0.9,
        }),
        expect.objectContaining({
          url: "https://inkwell-demo.netlify.app/blog/introducing-inkwell",
          lastModified: "2026-04-26",
          changeFrequency: "monthly",
          priority: 0.7,
        }),
        expect.objectContaining({
          url: "https://inkwell-demo.netlify.app/blog/category/editorial-systems",
          changeFrequency: "weekly",
          priority: 0.6,
        }),
      ]),
    );
  });

  it("publishes a robots policy that allows public routes and points crawlers at the sitemap", () => {
    expect(robots()).toEqual({
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/search"],
        },
      ],
      sitemap: "https://inkwell-demo.netlify.app/sitemap.xml",
    });
  });

  it("publishes an RSS feed with content-derived metadata for each post", async () => {
    const response = await getRss();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(body).toContain("<title>Inkwell</title>");
    expect(body).toContain(
      "<link>https://inkwell-demo.netlify.app/blog/introducing-inkwell</link>",
    );
    expect(body).toContain(
      "<category>Editorial systems</category>",
    );
    expect(body).toContain("<dc:creator>Amjad Yahia</dc:creator>");
    expect(body).toContain(
      "<pubDate>Sun, 26 Apr 2026 00:00:00 GMT</pubDate>",
    );
    expect(body).toContain(
      "<guid>https://inkwell-demo.netlify.app/blog/designing-archive-pages-that-carry-their-own-seo-weight</guid>",
    );
  });
});

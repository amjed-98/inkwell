import { getAllPosts } from "../../lib/posts";
import { buildRssFeed } from "../../lib/seo";

export async function GET() {
  const posts = await getAllPosts();
  const body = buildRssFeed(posts);

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}

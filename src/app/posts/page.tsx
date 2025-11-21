import { prisma } from "../lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.slug}`} className="block mb-4 border p-4 rounded">
          {post.coverImageUrl && (
            <div className="w-full h-48 relative mb-2">
              <img src={post.coverImageUrl} className="w-full h-full object-cover" alt={post.title} />
            </div>
          )}
          <h2 className="text-xl font-bold">{post.title}</h2>
          <div className="text-gray-600 prose" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
        </Link>
      ))}
    </div>
  );
}

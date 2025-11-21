import { prisma } from "../../lib/prisma";
import Image from "next/image";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      {post.coverImageUrl && (
        <div className="w-full h-64 relative mb-4">
          <Image src={post.coverImageUrl} fill style={{ objectFit: "cover" }} alt={post.title} />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

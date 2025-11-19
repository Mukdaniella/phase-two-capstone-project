import { getPosts } from '../../lib/api';
import Link from 'next/link';

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <Link href="/posts/create" className="text-blue-500 mb-4 block">Create New Post</Link>
      <div className="grid gap-4">
        {posts.map((post: any) => (
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            {post.image_url && <img src={post.image_url} className="w-full h-48 object-cover rounded" />}
            <p>{post.content.substring(0, 100)}...</p>
            <Link href={`/posts/${post.slug}`} className="text-blue-500">Read More</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

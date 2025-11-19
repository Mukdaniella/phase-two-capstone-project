'use client';
import PostForm from '../../../components/postform';
import { createPost } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreate = async (postData: any) => {
    const slug = postData.title.toLowerCase().replace(/\s+/g, '-');
    await createPost({ ...postData, slug });
    router.push('/posts');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostForm onSubmit={handleCreate} />
    </div>
  );
}

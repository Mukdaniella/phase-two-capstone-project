'use client';
import { useState } from 'react';
import JoditEditor from 'jodit-react';

interface PostFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function PostForm({ onSubmit, initialData }: PostFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || { title: '', content: '', status: 'draft', image_url: '' },
  });

  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      // Temporary use local URL
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const submitForm = (data: any) => {
    onSubmit({ ...data, content, image_url: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
      <input {...register('title')} placeholder="Title" className="border p-2 w-full" />
      <input type="file" onChange={handleImageChange} />
      {imageUrl && <img src={imageUrl} alt="preview" className="w-64 h-40 object-cover" />}
      <JoditEditor value={content} onChange={setContent} />
      <select {...register('status')} className="border p-2">
        <option value="draft">Draft</option>
        <option value="published">Publish</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Save Post</button>
    </form>
  );
}
function useForm(arg0: { defaultValues: any; }): { register: any; handleSubmit: any; } {
    throw new Error('Function not implemented.');
}


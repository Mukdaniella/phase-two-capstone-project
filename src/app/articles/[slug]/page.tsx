interface Props {
  params: { slug: string };
}

export default function PostPage({ params }: Props) {
  return (
    <div style={{ padding: '1rem 0' }}>
      <h2>Post: {params.slug}</h2>
      <p>This is where full post content will appear in later labs.</p>
    </div>
  );
}

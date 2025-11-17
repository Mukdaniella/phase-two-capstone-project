'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts?authorId=${session.user.id}`,
          {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          }
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must log in to view your profile.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>{session.user.name}'s Profile</h2>
      <p>Email: {session.user.email}</p>

      {session.user.image && (
        <img src={session.user.image} alt="avatar" width={80} height={80} />
      )}

      <button onClick={() => signOut()}>Sign Out</button>

      <h3>My Posts</h3>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <div>
      <h1>Dashboard</h1>
      {status === "loading" && <p>Loading...</p>}
      {session && <p>Welcome {session.user?.email}</p>}
    </div>
  );
}

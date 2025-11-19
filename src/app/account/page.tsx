// app/account/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

const schema = z.object({
  avatar: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
  bio: z.string().max(200, "Bio too long").optional(),
})

type FormData = z.infer<typeof schema>

export default function AccountPage() {
  const { data: session, update } = useSession() // update() is magic!
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: session?.user?.avatar || "",
      bio: session?.user?.bio || "",
    },
  })

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session?.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar: data.avatar || null,
          bio: data.bio || null,
        }),
      })

      if (res.ok) {
        const updatedUser = await res.json()
        // This updates the session instantly without re-login!
        await update({
          ...session,
          user: {
            ...session?.user,
            avatar: updatedUser.avatar,
            bio: updatedUser.bio,
          },
        })
        router.refresh() // refreshes server components too
      }
    })
  }

  if (!session) return null // middleware already protects, but safe

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <img
          src={session.user.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-medium">{session.user.name}</p>
          <p className="text-gray-600">{session.user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input
            {...register("avatar")}
            placeholder="https://example.com/my-photo.jpg"
            className="w-full p-3 border rounded-lg"
          />
          {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full p-3 border rounded-lg"
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
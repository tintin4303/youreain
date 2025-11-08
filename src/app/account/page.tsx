"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [userDoc, setUserDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local editable state
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      setUserDoc(null);
      return;
    }

    const fetchOrCreateUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const clerkId = user?.id;
        const u: any = user;
        const clerkAvatar =
          u?.profileImageUrl ??
          u?.imageUrl ??
          (typeof u?.imageUrl === "function" ? u.imageUrl() : undefined) ??
          "";

        const email =
          u?.primaryEmailAddress?.emailAddress ||
          (u?.emailAddresses && u.emailAddresses[0]?.emailAddress) ||
          "";

        const nameFromClerk = user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

        // try fetch existing user by clerkId
        const res = await fetch(`/api/users?clerkId=${encodeURIComponent(clerkId)}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const existing = await res.json();

        if (existing) {
          setUserDoc(existing);
          setName(existing.name || nameFromClerk || "");
          setAvatar(existing.avatar || clerkAvatar || "");
          setLoading(false);
          return;
        }

        // create new user record
        const createRes = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId, email, name: nameFromClerk, avatar: clerkAvatar }),
        });
        if (!createRes.ok) throw new Error("Failed to create user");
        const created = await createRes.json();
        setUserDoc(created);
        setName(created.name || nameFromClerk || "");
        setAvatar(created.avatar || clerkAvatar || "");
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return <div className="p-6">Loading...</div>;
  if (!isSignedIn)
    return (
      <div className="p-6">
        <p className="mb-4">You are not signed in.</p>
        <Link href="/" className="text-indigo-600">
          Go home
        </Link>
      </div>
    );

  const clerkEmail =
    (user as any)?.primaryEmailAddress?.emailAddress ||
    ((user as any)?.emailAddresses && (user as any).emailAddresses[0]?.emailAddress) ||
    "";

  const displayedAvatar = avatar || clerkEmail ? avatar : "/default-avatar.png";

  const handleSave = async () => {
    if (!userDoc) return;
    setSaving(true);
    setError(null);
    try {
      // Update our DB user document
      const res = await fetch(`/api/users/${userDoc._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "", avatar: avatar || "" }),
      });
      if (!res.ok) throw new Error("Failed to update user in DB");
      const updated = await res.json();
      setUserDoc(updated);

      // Try to update Clerk profile as well (best-effort; cast to any for typings)
      try {
        const uAny: any = user;
        if (typeof uAny.update === "function") {
          const [firstName, ...rest] = (name || "").trim().split(" ");
          const lastName = rest.join(" ") || "";
          await uAny.update({
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            profileImageUrl: avatar || undefined,
          });
        }
      } catch (clerkErr) {
        console.warn("Clerk profile update failed:", clerkErr);
      }

      setSaving(false);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save");
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mx-6 p-6">
        <div className="max-w-3xl  glass p-6 rounded-2xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Account</h1>
            <div className="flex items-center gap-3">
              <UserButton />
              <button
                onClick={() => signOut()}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {loading && <p>Loading account...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {displayedAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayedAvatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
              )}

              <div>
                <div className="text-lg font-semibold">{userDoc?.name || user?.fullName || "No name"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{clerkEmail}</div>
                <div className="text-xs text-gray-500">Role: {userDoc?.role || "user"}</div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Edit profile</h2>
              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm">
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Full name"
                  />
                </label>

                <label className="text-sm">
                  Avatar URL
                  <input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://..."
                  />
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>

                  <Link
                    href="/"
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </Link>

                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 mb-2">Account details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-sm">{clerkEmail}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-sm">{userDoc ? new Date(userDoc.createdAt).toLocaleString() : "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

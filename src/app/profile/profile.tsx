"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { logout, updateSession } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { VerifySessionResult } from "@/lib/dal";

export default function Profile({
  me,
  session,
}: {
  me: unknown;
  session: VerifySessionResult;
}) {
  const { data: userData } = useQuery({
    queryKey: [session.accessToken, "me"],
    queryFn: async () => {
      // Try with current token
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      // If unauthorized, try to refresh
      if (response.status === 401) {
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: session.refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          // Update session with new tokens
          await updateSession({
            accessToken: refreshData.accessToken,
            refreshToken: refreshData.refreshToken || session.refreshToken,
          });

          // Retry with new token
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
          });
        }
      }

      if (!response.ok) throw new Error("Failed to fetch user data");
      return response.json();
    },
    initialData: me,
  });

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      {userData ? (
        <div className="rounded-large flex w-full max-w-sm flex-col gap-8 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="text-6xl mb-3">👽</div>
            <p className="text-3xl font-bold">
              {userData?.first_name || "User"}
            </p>
            <p className="text-lg font-medium text-gray-600">
              @{userData?.username}
            </p>
            <p className="text-sm text-gray-500">{userData?.email}</p>
          </div>
          <Button
            onPress={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="rounded-large flex w-full max-w-sm flex-col gap-8 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="text-6xl mb-3">👽</div>
            <p className="text-3xl font-bold">Eunoia</p>
            <p className="text-lg font-medium text-gray-600">Welcome</p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              as="a"
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/spotify/login`}
              startContent={
                <Image
                  width="20"
                  height="20"
                  src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
                  alt="Spotify"
                  className="h-5"
                />
              }
              variant="bordered"
              size="lg"
            >
              Sign up with Spotify
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ModalBody } from "@heroui/react";
import { VerifySessionResult } from "@/lib/dal";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
}

export default function Daily({ session }: { session: VerifySessionResult }) {
  const refreshToken = session.refreshToken;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [refreshToken, "recently-played"],
      queryFn: async ({ pageParam }) => {
        if (!refreshToken) return { items: [] };

        const url = pageParam
          ? `https://api.spotify.com/v1/me/player/recently-played?limit=50&before=${pageParam}`
          : `https://api.spotify.com/v1/me/player/recently-played?limit=50`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch recently played");
        return response.json();
      },
      getNextPageParam: (lastPage) => {
        return lastPage.cursors?.before;
      },
      enabled: !!session,
      initialPageParam: undefined,
    });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <ModalBody
      className="p-0 h-full w-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
      onScroll={handleScroll}
    >
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.items?.map((item: { track: Track; played_at: string }) => (
            <div
              key={`${item.track.id}-${item.played_at}`}
              className="h-screen snap-start flex items-center justify-center p-8"
            >
              <div className="flex flex-col items-center gap-4">
                {/* {item.track.album.images[0] && ( */}
                {/*   <img */}
                {/*     src={item.track.album.images[0].url} */}
                {/*     alt={item.track.name} */}
                {/*     className="w-64 h-64 rounded-lg shadow-lg" */}
                {/*   /> */}
                {/* )} */}
                <h2 className="text-2xl font-bold text-center">
                  {item.track.name}
                </h2>
                <p className="text-lg text-gray-400">
                  {item.track.artists.map((a) => a.name).join(", ")}
                </p>
                <p className="text-sm text-gray-500">{item.track.album.name}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="h-screen snap-start flex items-center justify-center">
          <p>Loading more...</p>
        </div>
      )}
    </ModalBody>
  );
}

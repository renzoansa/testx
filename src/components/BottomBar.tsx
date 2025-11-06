"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";

export default function BottomBar() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent">
      <div className="flex justify-around items-center p-4">
        <Button as={Link} href="/" isIconOnly variant="light">
          <Icon
            icon={segment === null ? "solar:home-bold" : "solar:home-linear"}
            width={24}
          />
        </Button>
        <Button as={Link} href="/profile" isIconOnly variant="light">
          <Icon
            icon={
              segment === "profile" ? "solar:user-bold" : "solar:user-linear"
            }
            width={24}
          />
        </Button>
      </div>
    </div>
  );
}

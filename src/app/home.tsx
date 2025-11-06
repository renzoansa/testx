"use client";

import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react";
import Daily from "@/components/Daily";
import { VerifySessionResult } from "@/lib/dal";
import { redirect } from "next/navigation";

export default function Home(props: { session: VerifySessionResult }) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const session = props?.session;

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full">
        <ModalContent className="p-0 bg-black">
          {() => <Daily session={session} />}
        </ModalContent>
      </Modal>
      <div className="h-full w-full flex items-center justify-center">
        <Button
          onPress={() => {
            if (!session?.isAuth) {
              redirect("/profile");
            }
            onOpen();
          }}
        >
          Daily Review
        </Button>
      </div>
    </>
  );
}

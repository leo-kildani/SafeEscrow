"use client";

import { Web3Provider } from "@/contexts/Web3Context";

export default function TestConfirmDeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Web3Provider>{children}</Web3Provider>;
}

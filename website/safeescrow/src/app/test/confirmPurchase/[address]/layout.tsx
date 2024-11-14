"use client";

import { Web3Provider } from "@/contexts/Web3Context";

export default function TestConfirmPurchaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Web3Provider>{children}</Web3Provider>;
}

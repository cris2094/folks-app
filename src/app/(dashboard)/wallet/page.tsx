import { getWalletSummary } from "@/features/wallet/queries/get-wallet-summary";
import { WalletClient } from "@/features/wallet/components/wallet-client";

export default async function WalletPage() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const data = await getWalletSummary(currentMonth);

  return <WalletClient initialData={data} initialMonth={currentMonth} />;
}

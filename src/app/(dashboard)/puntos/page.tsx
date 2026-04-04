import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getMyPoints, getNextLevel } from "@/features/gamificacion/queries/get-my-points";
import { getMyBadges } from "@/features/gamificacion/queries/get-my-badges";
import { getLeaderboard } from "@/features/gamificacion/queries/get-leaderboard";
import { PointsCard } from "@/features/gamificacion/components/points-card";
import { EarnPointsGrid } from "@/features/gamificacion/components/earn-points-grid";
import { BadgesGrid } from "@/features/gamificacion/components/badges-grid";
import { Leaderboard } from "@/features/gamificacion/components/leaderboard";
import { TransactionHistory } from "@/features/gamificacion/components/transaction-history";
import { FadeIn, FadeInUp } from "@/components/motion";
import type { PointLevel } from "@/types/database";

export default async function PuntosPage() {
  const [pointsData, badges, leaderboard] = await Promise.all([
    getMyPoints(),
    getMyBadges(),
    getLeaderboard(),
  ]);

  const currentPoints = pointsData.points?.points ?? 0;
  const currentLevel = (pointsData.points?.level ?? "bronce") as PointLevel;
  const totalEarned = pointsData.points?.total_earned ?? 0;
  const { next, threshold, currentMin } = getNextLevel(currentLevel);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col">
      {/* Header */}
      <FadeIn>
        <header className="px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="inline-flex items-center gap-0.5 text-[15px] font-medium text-amber-500"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              Inicio
            </Link>
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
              Mis Puntos
            </h1>
            <div className="w-14" />
          </div>
        </header>
      </FadeIn>

      {/* Points Card */}
      <div className="px-5">
        <PointsCard
          points={currentPoints}
          level={currentLevel}
          totalEarned={totalEarned}
          nextLevel={next}
          nextThreshold={threshold}
          currentMin={currentMin}
        />
      </div>

      {/* How to earn */}
      <FadeInUp delay={0.15}>
        <div className="px-5 pt-7">
          <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
            Como ganar puntos
          </p>
          <EarnPointsGrid />
        </div>
      </FadeInUp>

      {/* Badges */}
      <FadeInUp delay={0.25}>
        <div className="px-5 pt-7">
          <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
            Tus Badges
          </p>
          <BadgesGrid badges={badges} />
        </div>
      </FadeInUp>

      {/* Leaderboard */}
      <FadeInUp delay={0.3}>
        <div className="px-5 pt-7">
          <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
            Ranking
          </p>
          <Leaderboard entries={leaderboard} />
        </div>
      </FadeInUp>

      {/* Transaction History */}
      <FadeInUp delay={0.35}>
        <div className="px-5 pt-7">
          <p className="mb-4 text-[15px] font-semibold tracking-tight text-gray-900">
            Historial
          </p>
          <TransactionHistory transactions={pointsData.recentTransactions} />
        </div>
      </FadeInUp>

      {/* Footer */}
      <div className="pb-24 pt-8 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-medium tracking-wider text-gray-300">
          <svg
            className="h-3 w-3"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}

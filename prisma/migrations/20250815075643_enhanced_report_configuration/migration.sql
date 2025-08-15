-- CreateEnum
CREATE TYPE "public"."pricing_models" AS ENUM ('BLACK_SCHOLES', 'MONTE_CARLO', 'BINOMIAL_TREE', 'HESTON', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."chart_types" AS ENUM ('PRICE_EVOLUTION', 'VOLUME_ANALYSIS', 'TECHNICAL_INDICATORS', 'RISK_METRICS', 'CORRELATION_MATRIX', 'VOLATILITY_SURFACE', 'CANDLESTICK', 'BOLLINGER_BANDS', 'FIBONACCI_RETRACEMENT', 'ICHIMOKU_CLOUD');

-- CreateEnum
CREATE TYPE "public"."benchmark_types" AS ENUM ('MARKET_INDEX', 'SECTOR_COMPARISON', 'PEER_COMPARISON', 'RISK_FREE_RATE', 'CUSTOM_BENCHMARK');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."report_types" ADD VALUE 'DETAILED';
ALTER TYPE "public"."report_types" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "public"."reports" ADD COLUMN     "analysisEndDate" TIMESTAMP(3),
ADD COLUMN     "analysisStartDate" TIMESTAMP(3),
ADD COLUMN     "benchmarkTypes" "public"."benchmark_types"[],
ADD COLUMN     "configurationName" TEXT,
ADD COLUMN     "correlationAnalysis" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customBenchmarks" TEXT[],
ADD COLUMN     "customPricingParams" JSONB,
ADD COLUMN     "excelPath" TEXT,
ADD COLUMN     "exportFormats" TEXT[] DEFAULT ARRAY['PDF']::TEXT[],
ADD COLUMN     "fundamentalAnalysis" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "includeRawData" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jsonPath" TEXT,
ADD COLUMN     "movingAverages" JSONB,
ADD COLUMN     "oscillators" JSONB,
ADD COLUMN     "pricingModel" "public"."pricing_models",
ADD COLUMN     "riskMetrics" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "selectedCharts" "public"."chart_types"[],
ADD COLUMN     "sentimentAnalysis" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "technicalAnalysis" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timeframe" TEXT,
ADD COLUMN     "trendIndicators" JSONB,
ADD COLUMN     "volatilityAnalysis" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."report_configurations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "report_configurations_userId_name_key" ON "public"."report_configurations"("userId", "name");

-- AddForeignKey
ALTER TABLE "public"."report_configurations" ADD CONSTRAINT "report_configurations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

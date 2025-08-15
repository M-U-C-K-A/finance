-- CreateEnum
CREATE TYPE "public"."user_roles" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."user_roles" NOT NULL DEFAULT 'USER';

/*
  Warnings:

  - You are about to drop the column `updated_at` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `bare_act_sections` table. All the data in the column will be lost.
  - You are about to drop the column `act_number` on the `bare_acts` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `bare_acts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `contact_messages` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `discussion_invitations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `discussion_reactions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `discussion_replies` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `discussion_reports` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `flashcards` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `legal_dictionary` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mentor_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mentor_queries` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mentor_replies` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `newsletter_subscribers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `newsletter_subscribers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `past_exam_questions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `quiz_retake_requests` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `responses` table. All the data in the column will be lost.
  - The `content_type` column on the `roadmap_modules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `updated_at` on the `study_group_members` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `study_group_messages` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `study_group_messages` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `study_groups` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `token_rules` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `token_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `universities` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_notifications` table. All the data in the column will be lost.
  - The `status` column on the `user_roadmap_progress` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `user_score_history` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_score_history` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_weakness_stats` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_weakness_stats` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `written_submissions` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `written_submissions` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[slug]` on the table `articles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,item_id,item_type]` on the table `favorites` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,announcement_id]` on the table `user_notifications` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,topic]` on the table `user_weakness_stats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PkgDuration" AS ENUM ('monthly', 'm3', 'm6', 'y1', 'y2', 'y3');

-- CreateEnum
CREATE TYPE "PkgKind" AS ENUM ('batch', 'free', 'duration');

-- CreateEnum
CREATE TYPE "PkgProgram" AS ENUM ('bjs', 'bar', 'llb');

-- CreateEnum
CREATE TYPE "PkgTrack" AS ENUM ('preliminary', 'written');

-- CreateEnum
CREATE TYPE "PkgReqStatus" AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "PkgAccStatus" AS ENUM ('active', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "DownloadContentType" AS ENUM ('note', 'question_bank', 'bare_act', 'case_reference', 'legal_research', 'program_pdf', 'live_exam', 'study_material', 'book', 'course_file', 'other');

-- CreateEnum
CREATE TYPE "ResubmissionProgram" AS ENUM ('bjs', 'bar');

-- CreateEnum
CREATE TYPE "ResubmissionStatus" AS ENUM ('pending', 'approved', 'rejected', 'consumed', 'expired', 'revoked');

-- DropForeignKey
ALTER TABLE "discussion_groups" DROP CONSTRAINT "discussion_groups_created_by_fkey";

-- DropForeignKey
ALTER TABLE "discussion_invitations" DROP CONSTRAINT "discussion_invitations_invited_by_fkey";

-- DropForeignKey
ALTER TABLE "discussion_invitations" DROP CONSTRAINT "discussion_invitations_invited_user_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_members" DROP CONSTRAINT "discussion_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_posts" DROP CONSTRAINT "discussion_posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_reactions" DROP CONSTRAINT "discussion_reactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_replies" DROP CONSTRAINT "discussion_replies_author_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_reports" DROP CONSTRAINT "discussion_reports_reporter_id_fkey";

-- DropForeignKey
ALTER TABLE "discussion_reports" DROP CONSTRAINT "discussion_reports_reviewed_by_fkey";

-- DropForeignKey
ALTER TABLE "mentor_profiles" DROP CONSTRAINT "mentor_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_queries" DROP CONSTRAINT "mentor_queries_mentor_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_queries" DROP CONSTRAINT "mentor_queries_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_ratings" DROP CONSTRAINT "mentor_ratings_query_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_replies" DROP CONSTRAINT "mentor_replies_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_created_by_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_quizId_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_question_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "token_transactions" DROP CONSTRAINT "token_transactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tokens" DROP CONSTRAINT "user_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "written_submissions" DROP CONSTRAINT "written_submissions_question_id_fkey";

-- DropIndex
DROP INDEX "idx_discussion_invitations_group";

-- DropIndex
DROP INDEX "favorites_user_id_item_id_key";

-- DropIndex
DROP INDEX "idx_favorites_user";

-- DropIndex
DROP INDEX "mentor_profiles_user_id_key";

-- DropIndex
DROP INDEX "idx_notifications_user";

-- DropIndex
DROP INDEX "idx_questions_quiz";

-- DropIndex
DROP INDEX "idx_quizzes_batch_number";

-- DropIndex
DROP INDEX "idx_responses_quiz";

-- DropIndex
DROP INDEX "idx_responses_user_quiz";

-- DropIndex
DROP INDEX "idx_study_group_messages_group";

-- DropIndex
DROP INDEX "token_tx_idempotent_idx";

-- DropIndex
DROP INDEX "universities_name_key";

-- DropIndex
DROP INDEX "idx_user_roadmap_progress_module";

-- DropIndex
DROP INDEX "idx_user_score_history_user";

-- DropIndex
DROP INDEX "idx_user_weakness_stats_user";

-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "updated_at",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_pinned" BOOLEAN DEFAULT false,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "package_id" TEXT,
ADD COLUMN     "package_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "program" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'general';

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "author_image" TEXT,
ADD COLUMN     "banner_image_url" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "cover_image" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "meta_description" TEXT,
ADD COLUMN     "meta_title" TEXT,
ADD COLUMN     "published_at" TIMESTAMPTZ,
ADD COLUMN     "read_minutes" INTEGER,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "bare_act_sections" DROP COLUMN "updated_at",
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "bare_acts" DROP COLUMN "act_number",
DROP COLUMN "year",
ADD COLUMN     "allow_download" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "content_html" TEXT,
ADD COLUMN     "content_plain" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "download_url" TEXT,
ADD COLUMN     "generated_pdf_url" TEXT,
ADD COLUMN     "pdf_path" TEXT,
ADD COLUMN     "pdf_url" TEXT,
ADD COLUMN     "search_vector" tsvector,
ADD COLUMN     "source_type" TEXT NOT NULL DEFAULT 'text',
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "contact_messages" DROP COLUMN "updated_at",
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "discussion_groups" ADD COLUMN     "category" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "max_members" SET DEFAULT 100;

-- AlterTable
ALTER TABLE "discussion_invitations" DROP COLUMN "updated_at",
ALTER COLUMN "type" SET DEFAULT 'invite';

-- AlterTable
ALTER TABLE "discussion_members" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "discussion_posts" ADD COLUMN     "category" TEXT,
ADD COLUMN     "search_vector" tsvector,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "discussion_reactions" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "discussion_replies" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "discussion_reports" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "flashcard_decks" ADD COLUMN     "allow_download" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "flashcards" DROP COLUMN "updated_at",
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "legal_dictionary" DROP COLUMN "updated_at",
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mentor_profiles" DROP COLUMN "updated_at",
ALTER COLUMN "availability_status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mentor_queries" DROP COLUMN "updated_at",
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "priority" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mentor_replies" DROP COLUMN "updated_at",
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "newsletter_subscribers" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "updated_at",
ADD COLUMN     "allow_download" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "file_mime" TEXT,
ADD COLUMN     "file_path" TEXT,
ADD COLUMN     "free_preview_pages" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "package_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "price_bdt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "section" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "updated_at",
ADD COLUMN     "actor_name" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL,
ALTER COLUMN "type" DROP DEFAULT;

-- AlterTable
ALTER TABLE "past_exam_questions" DROP COLUMN "updated_at",
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "section_id" TEXT,
ADD COLUMN     "section_position" INTEGER,
ALTER COLUMN "quiz_id" DROP NOT NULL,
ALTER COLUMN "question_text" DROP NOT NULL,
ALTER COLUMN "options" DROP NOT NULL,
ALTER COLUMN "options" DROP DEFAULT,
ALTER COLUMN "options" SET DATA TYPE JSON,
ALTER COLUMN "correct_answer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quiz_retake_requests" DROP COLUMN "updated_at",
ADD COLUMN     "exam_session_id" TEXT;

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "quizId",
ADD COLUMN     "access_mode" TEXT NOT NULL DEFAULT 'public',
ADD COLUMN     "access_type" TEXT NOT NULL DEFAULT 'open',
ADD COLUMN     "archive_pdf_url" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "exam_track" TEXT,
ADD COLUMN     "exam_type" TEXT DEFAULT 'preliminary',
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "is_free_demo" BOOLEAN DEFAULT false,
ADD COLUMN     "is_live" BOOLEAN DEFAULT false,
ADD COLUMN     "is_premium" BOOLEAN DEFAULT false,
ADD COLUMN     "live_end_time" TIMESTAMPTZ,
ADD COLUMN     "live_start_time" TIMESTAMPTZ,
ADD COLUMN     "negative_mark_value" DECIMAL(65,30) NOT NULL DEFAULT 0.25,
ADD COLUMN     "prerequisite_quiz_id" TEXT,
ADD COLUMN     "program_type" TEXT DEFAULT 'general',
ADD COLUMN     "program_types" TEXT[] DEFAULT ARRAY['bjs']::TEXT[],
ADD COLUMN     "reminder_sent_at" TIMESTAMPTZ,
ADD COLUMN     "routine_no" TEXT,
ADD COLUMN     "subject_category" TEXT,
ADD COLUMN     "subject_tag" TEXT,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "time_limit" DROP DEFAULT,
ALTER COLUMN "total_questions" DROP DEFAULT,
ALTER COLUMN "total_marks" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "exam_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "cut_mark_percent" DROP DEFAULT,
ALTER COLUMN "cut_mark_percent" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "responses" DROP COLUMN "updated_at",
ADD COLUMN     "package_id" TEXT,
ADD COLUMN     "question_bank_id" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "quiz_id" DROP NOT NULL,
ALTER COLUMN "question_id" DROP NOT NULL,
ALTER COLUMN "selected_answer" DROP NOT NULL,
ALTER COLUMN "is_correct" DROP NOT NULL,
ALTER COLUMN "is_correct" DROP DEFAULT;

-- AlterTable
ALTER TABLE "roadmap_modules" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "content_type",
ADD COLUMN     "content_type" TEXT DEFAULT 'text';

-- AlterTable
ALTER TABLE "roadmap_stages" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "study_group_members" DROP COLUMN "updated_at",
ALTER COLUMN "joined_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "study_group_messages" DROP COLUMN "updated_at",
DROP COLUMN "user_name",
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "study_groups" DROP COLUMN "updated_at",
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "token_rules" DROP COLUMN "created_at",
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "deleted_by" TEXT,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "token_transactions" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "universities" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "user_notifications" DROP COLUMN "updated_at",
ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_roadmap_progress" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT DEFAULT 'not_started';

-- AlterTable
ALTER TABLE "user_score_history" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "accuracy" DECIMAL(5,2),
ADD COLUMN     "net_score" DECIMAL(7,2),
ADD COLUMN     "package_id" TEXT,
ALTER COLUMN "score" DROP DEFAULT,
ALTER COLUMN "total" DROP DEFAULT,
ALTER COLUMN "completed_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_tokens" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "user_weakness_stats" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "year_level" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "written_submissions" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "exam_id" TEXT,
ADD COLUMN     "feedback_breakdown" JSONB,
ADD COLUMN     "package_id" TEXT,
ADD COLUMN     "prior_evaluations" JSONB,
ADD COLUMN     "resubmission_request_id" TEXT,
ADD COLUMN     "submission_cycle" SMALLINT NOT NULL DEFAULT 1,
ALTER COLUMN "quiz_id" DROP NOT NULL,
ALTER COLUMN "question_id" DROP NOT NULL,
ALTER COLUMN "file_type" SET DEFAULT 'image',
ALTER COLUMN "submitted_at" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "score" SET DATA TYPE DECIMAL(65,30);

-- DropEnum
DROP TYPE "ContentType";

-- DropEnum
DROP TYPE "ProgressStatus";

-- CreateTable
CREATE TABLE "account_deletions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email_hash" TEXT NOT NULL,
    "reason" TEXT,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "deleted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_deletions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_deletion_attempts" (
    "user_id" TEXT NOT NULL,
    "last_attempt_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempt_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "account_deletion_attempts_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "program" "PkgProgram" NOT NULL,
    "track" "PkgTrack",
    "kind" "PkgKind" NOT NULL,
    "duration" "PkgDuration",
    "title_bn" TEXT NOT NULL,
    "subtitle_bn" TEXT,
    "batch_number" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_coming_soon" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "batch_started_at" TIMESTAMPTZ,
    "batch_ended_at" TIMESTAMPTZ,
    "batch_locks_new_only" BOOLEAN NOT NULL DEFAULT true,
    "details_json" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details_html" TEXT,
    "allow_program_routine_fallback" BOOLEAN NOT NULL DEFAULT true,
    "includes_all_notes" BOOLEAN NOT NULL DEFAULT false,
    "includes_all_qbanks" BOOLEAN NOT NULL DEFAULT false,
    "includes_all_premium" BOOLEAN NOT NULL DEFAULT false,
    "price_bdt" DECIMAL(65,30) DEFAULT 0,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_content_rules" (
    "id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "match_mode" TEXT NOT NULL,
    "match_value" JSONB NOT NULL DEFAULT '{}',
    "label" TEXT,

    CONSTRAINT "package_content_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_access_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bkash_number" TEXT NOT NULL,
    "message" TEXT,
    "status" "PkgReqStatus" NOT NULL DEFAULT 'pending',
    "decided_by" TEXT,
    "decided_at" TIMESTAMPTZ,
    "decision_note" TEXT,
    "client_request_uuid" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_package_access" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "request_id" TEXT,
    "granted_by" TEXT,
    "granted_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "starts_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ,
    "status" "PkgAccStatus" NOT NULL DEFAULT 'active',
    "revoked_by" TEXT,
    "revoked_at" TIMESTAMPTZ,
    "revoke_reason" TEXT,

    CONSTRAINT "user_package_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_audit_log" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "target_type" TEXT,
    "target_id" TEXT,
    "meta" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_events" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT,
    "package_id" TEXT,
    "event" TEXT NOT NULL,
    "meta" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_grant_audit" (
    "id" TEXT NOT NULL,
    "grant_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT,
    "reason" TEXT,
    "prev_expires_at" TIMESTAMPTZ,
    "new_expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_grant_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_unlocks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "tokens_spent" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_allowed_users" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "granted_by" TEXT,
    "granted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_allowed_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_sections" (
    "id" TEXT NOT NULL,

    CONSTRAINT "exam_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bar_responses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_bank_id" TEXT,
    "package_id" TEXT,

    CONSTRAINT "bar_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_banks" (
    "id" TEXT NOT NULL,
    "program_type" TEXT NOT NULL,
    "exam_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pdf_url" TEXT,
    "is_premium" BOOLEAN DEFAULT false,
    "year" INTEGER,
    "subject" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,
    "content_type" TEXT NOT NULL DEFAULT 'question_answer',
    "access_type" TEXT NOT NULL DEFAULT 'free',
    "pdf_path" TEXT,
    "original_filename" TEXT,
    "file_size_bytes" BIGINT,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "last_downloaded_at" TIMESTAMPTZ,
    "is_token_unlockable" BOOLEAN NOT NULL DEFAULT false,
    "token_price" INTEGER NOT NULL DEFAULT 0,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "price_bdt" INTEGER NOT NULL DEFAULT 0,
    "allow_download" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "question_banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank_purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_bank_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "price_bdt" INTEGER NOT NULL DEFAULT 0,
    "payment_method" TEXT,
    "payment_reference" TEXT,
    "admin_note" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount_bdt" INTEGER NOT NULL DEFAULT 0,
    "payment_ref" TEXT,

    CONSTRAINT "question_bank_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tokens_archive_2026_05" (
    "user_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lifetime_earned" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tokens_archive_2026_05_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "token_transactions_archive_2026_05" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "ref_type" TEXT,
    "ref_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_transactions_archive_2026_05_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bar_favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bar_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bar_user_score_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "net_score" DECIMAL(7,2),
    "accuracy" DECIMAL(5,2),
    "package_id" TEXT,

    CONSTRAINT "bar_user_score_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_references" (
    "id" TEXT NOT NULL,
    "case_title" TEXT NOT NULL,
    "citation" TEXT,
    "court" TEXT,
    "year" INTEGER,
    "summary" TEXT,
    "full_text" TEXT,
    "pdf_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "search_vector" tsvector,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,
    "category" TEXT,
    "slug" TEXT,
    "content_html" TEXT,
    "content_plain" TEXT,
    "pdf_path" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cover_image" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "case_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_research" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "abstract" TEXT,
    "body_md" TEXT,
    "pdf_url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "search_vector" tsvector,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "legal_research_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_pages" (
    "id" TEXT NOT NULL,
    "program_type" TEXT NOT NULL,
    "page_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body_md" TEXT,
    "file_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "track" TEXT DEFAULT 'preliminary',
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "program_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "category" TEXT NOT NULL,
    "subject" TEXT,
    "instructor" TEXT,
    "cover_url" TEXT,
    "price" DECIMAL(65,30) DEFAULT 0,
    "is_premium" BOOLEAN DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_token_unlockable" BOOLEAN NOT NULL DEFAULT false,
    "token_price" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_lessons" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "video_url" TEXT,
    "pdf_url" TEXT,
    "duration_min" INTEGER,
    "is_preview" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "course_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_lesson_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_via" TEXT NOT NULL,
    "enrolled_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress_percent" INTEGER DEFAULT 0,

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_suggestions" (
    "id" TEXT NOT NULL,
    "program_type" TEXT NOT NULL,
    "track" TEXT,
    "category" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "reference_book" TEXT NOT NULL,
    "box_note" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "book_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_score_history_bak_20260424" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "quiz_id" TEXT,
    "score" INTEGER,
    "total" INTEGER,
    "completed_at" TIMESTAMPTZ,
    "net_score" DECIMAL(7,2),
    "accuracy" DECIMAL(5,2),

    CONSTRAINT "user_score_history_bak_20260424_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bar_user_score_history_bak_20260424" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "quiz_id" TEXT,
    "score" INTEGER,
    "total" INTEGER,
    "completed_at" TIMESTAMPTZ,
    "net_score" DECIMAL(7,2),
    "accuracy" DECIMAL(5,2),

    CONSTRAINT "bar_user_score_history_bak_20260424_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "bkash_number" TEXT NOT NULL DEFAULT '',
    "instructions" TEXT NOT NULL DEFAULT 'Send money to the bKash number above and submit your transaction ID below.',
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llb_subject_pdfs" (
    "id" TEXT NOT NULL,
    "year_level" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llb_subject_pdfs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "plan_id" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "payment_ref" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "perks" JSONB DEFAULT '{}',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "university" TEXT,
    "program" TEXT,
    "photo_url" TEXT,
    "text" TEXT NOT NULL,
    "rating" SMALLINT DEFAULT 5,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fcm_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "device_id" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'web',
    "browser" TEXT,
    "os" TEXT,
    "pwa_installed" BOOLEAN DEFAULT false,
    "permission_status" TEXT,
    "user_agent" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_error" TEXT,
    "disabled_at" TIMESTAMPTZ,
    "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fcm_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_preferences" (
    "user_id" TEXT NOT NULL,
    "push_enabled" BOOLEAN NOT NULL DEFAULT false,
    "quiz_reminders" BOOLEAN NOT NULL DEFAULT true,
    "exam_access" BOOLEAN NOT NULL DEFAULT true,
    "written_results" BOOLEAN NOT NULL DEFAULT true,
    "new_articles" BOOLEAN NOT NULL DEFAULT true,
    "announcements" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "push_logs" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "category" TEXT,
    "target_type" TEXT,
    "target_count" INTEGER DEFAULT 0,
    "success_count" INTEGER DEFAULT 0,
    "failed_count" INTEGER DEFAULT 0,
    "cleaned_count" INTEGER DEFAULT 0,
    "created_by" TEXT,
    "metadata" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_knowledge" (
    "id" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content_text" TEXT NOT NULL,
    "url" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT,
    "language" TEXT DEFAULT 'auto',
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "search_vector" tsvector,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_scope" TEXT NOT NULL DEFAULT 'public',
    "program" TEXT,
    "package_id" TEXT,
    "required_role" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "content_hash" TEXT,
    "chunk_index" INTEGER NOT NULL DEFAULT 0,
    "chunk_total" INTEGER NOT NULL DEFAULT 1,
    "priority_weight" DECIMAL NOT NULL DEFAULT 1.0,
    "indexed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_rate_limits" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT,
    "ip_hash" TEXT,
    "window_start" TIMESTAMPTZ NOT NULL,
    "window_kind" TEXT NOT NULL,
    "request_count" INTEGER NOT NULL DEFAULT 0,
    "ai_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "chatbot_rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_synonyms" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "synonym" TEXT NOT NULL,

    CONSTRAINT "chatbot_synonyms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_messages" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "used_ai" BOOLEAN NOT NULL DEFAULT false,
    "related_links" JSONB DEFAULT '[]',
    "feedback" INTEGER,
    "cache_id" TEXT,
    "language" TEXT,
    "latency_ms" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_answer_cache" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "normalized_question" TEXT NOT NULL,
    "question_hash" TEXT,
    "answer" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'auto',
    "source" TEXT NOT NULL,
    "confidence_score" DECIMAL(4,3) DEFAULT 0,
    "related_links" JSONB DEFAULT '[]',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "review_status" TEXT NOT NULL DEFAULT 'pending_review',
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "positive_feedback" INTEGER NOT NULL DEFAULT 0,
    "negative_feedback" INTEGER NOT NULL DEFAULT 0,
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,
    "search_vector" tsvector,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_answer_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_index_sources" (
    "key" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "sql_table" TEXT,
    "id_column" TEXT NOT NULL DEFAULT 'id',
    "title_columns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "body_columns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "access_scope" TEXT NOT NULL DEFAULT 'public',
    "program" TEXT,
    "package_id" TEXT,
    "required_role" TEXT,
    "priority_weight" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "custom_adapter" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "validation_error" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_index_sources_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "chatbot_reindex_jobs" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "source_key" TEXT,
    "item_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total_rows" INTEGER NOT NULL DEFAULT 0,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "triggered_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ,
    "finished_at" TIMESTAMPTZ,

    CONSTRAINT "chatbot_reindex_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatbot_pdf_extractions" (
    "id" TEXT NOT NULL,
    "source_key" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "file_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "text_length" INTEGER,
    "error" TEXT,
    "extracted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_pdf_extractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_stats" (
    "content_type" "DownloadContentType" NOT NULL,
    "content_id" TEXT NOT NULL,
    "total_downloads" BIGINT NOT NULL DEFAULT 0,
    "unique_users" BIGINT NOT NULL DEFAULT 0,
    "last_downloaded_at" TIMESTAMPTZ,

    CONSTRAINT "download_stats_pkey" PRIMARY KEY ("content_type","content_id")
);

-- CreateTable
CREATE TABLE "written_exams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "time_limit" INTEGER,
    "total_marks" INTEGER DEFAULT 100,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "program_types" TEXT[] DEFAULT ARRAY['bjs']::TEXT[],
    "subject" TEXT,
    "exam_date" TIMESTAMPTZ,
    "live_start_time" TIMESTAMPTZ,
    "live_end_time" TIMESTAMPTZ,
    "question_pdf_url" TEXT,
    "answer_sheet_pdf_url" TEXT,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,
    "batch_title" TEXT,
    "batch_number" INTEGER,
    "syllabus_no" TEXT,
    "exam_mode" TEXT NOT NULL DEFAULT 'questions',
    "answer_mode" TEXT NOT NULL DEFAULT 'mixed',
    "question_image_url" TEXT,
    "access_type" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "written_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "written_exam_questions" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_image" TEXT,
    "marks" DECIMAL(65,30) DEFAULT 10,
    "order_index" INTEGER DEFAULT 0,
    "guidelines" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "written_exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "written_exam_allowed_users" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "granted_by" TEXT,
    "granted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "written_exam_allowed_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "written_exam_resubmission_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "program" "ResubmissionProgram" NOT NULL,
    "reason" TEXT NOT NULL,
    "evidence_url" TEXT,
    "status" "ResubmissionStatus" NOT NULL DEFAULT 'pending',
    "decided_by" TEXT,
    "decided_at" TIMESTAMPTZ,
    "decision_note" TEXT,
    "ttl_minutes" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "program_type" "ResubmissionProgram" NOT NULL,
    "user_agent" TEXT,
    "admin_note" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ,
    "evidence_path" TEXT,

    CONSTRAINT "written_exam_resubmission_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "written_exam_resubmission_access" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "program" "ResubmissionProgram" NOT NULL,
    "granted_by" TEXT NOT NULL,
    "granted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "consumed_at" TIMESTAMPTZ,
    "revoked_at" TIMESTAMPTZ,
    "revoked_by" TEXT,
    "program_type" "ResubmissionProgram" NOT NULL,
    "upload_count" INTEGER NOT NULL DEFAULT 0,
    "max_uploads" INTEGER NOT NULL DEFAULT 1,
    "last_uploaded_at" TIMESTAMPTZ,

    CONSTRAINT "written_exam_resubmission_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bar_written_submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT,
    "quiz_id" TEXT,
    "question_id" TEXT,
    "answer_text" TEXT,
    "file_url" TEXT,
    "file_type" TEXT DEFAULT 'text',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "score" DECIMAL DEFAULT 0,
    "feedback" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback_breakdown" JSONB,
    "resubmission_request_id" TEXT,
    "submission_cycle" INTEGER NOT NULL DEFAULT 1,
    "prior_evaluations" JSONB,
    "package_id" TEXT,

    CONSTRAINT "bar_written_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_tasks" (
    "id" TEXT NOT NULL,
    "day_index" INTEGER NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "unlock_at" TIMESTAMPTZ,
    "program" TEXT NOT NULL DEFAULT 'llb',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year_level" INTEGER NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ,
    "deleted_by" TEXT,

    CONSTRAINT "daily_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_archive_pdfs" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exam_archive_pdfs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label_bn" TEXT NOT NULL,
    "program" "PkgProgram",
    "track" "PkgTrack",
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_tag_map" (
    "note_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "note_tag_map_pkey" PRIMARY KEY ("note_id","tag_id")
);

-- CreateTable
CREATE TABLE "note_purchases" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "amount_bdt" INTEGER NOT NULL DEFAULT 0,
    "transaction_id" TEXT NOT NULL,
    "sender_phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_ref" TEXT,
    "admin_note" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "download_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "content_type" "DownloadContentType" NOT NULL,
    "content_id" TEXT NOT NULL,
    "content_title" TEXT,
    "program" TEXT,
    "file_path" TEXT,
    "file_size_bytes" BIGINT,
    "source" TEXT,
    "client" TEXT,
    "session_key" TEXT,
    "downloaded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "download_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_pcr_pkg_type" ON "package_content_rules"("package_id", "resource_type");

-- CreateIndex
CREATE UNIQUE INDEX "package_access_requests_client_request_uuid_key" ON "package_access_requests"("client_request_uuid");

-- CreateIndex
CREATE INDEX "idx_upa_user_status" ON "user_package_access"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_package_access_user_pkg_unique" ON "user_package_access"("user_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_pkg_events_lookup" ON "package_events"("package_id", "event", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_pga_grant" ON "package_grant_audit"("grant_id");

-- CreateIndex
CREATE INDEX "idx_pga_user" ON "package_grant_audit"("user_id");

-- CreateIndex
CREATE INDEX "idx_pga_pkg" ON "package_grant_audit"("package_id");

-- CreateIndex
CREATE INDEX "idx_user_unlocks_user_id" ON "user_unlocks"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_unlocks_item" ON "user_unlocks"("item_type", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_unlocks_user_id_item_type_item_id_key" ON "user_unlocks"("user_id", "item_type", "item_id");

-- CreateIndex
CREATE INDEX "idx_qau_user" ON "quiz_allowed_users"("user_id");

-- CreateIndex
CREATE INDEX "idx_qau_quiz" ON "quiz_allowed_users"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_qau_quiz_user" ON "quiz_allowed_users"("quiz_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_allowed_users_quiz_id_user_id_key" ON "quiz_allowed_users"("quiz_id", "user_id");

-- CreateIndex
CREATE INDEX "bar_responses_qb_idx" ON "bar_responses"("question_bank_id");

-- CreateIndex
CREATE INDEX "bar_responses_user_quiz_pkg_idx" ON "bar_responses"("user_id", "quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "bar_responses_quiz_pkg_idx" ON "bar_responses"("quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_bar_responses_user_quiz" ON "bar_responses"("user_id", "quiz_id");

-- CreateIndex
CREATE INDEX "idx_bar_responses_quiz" ON "bar_responses"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_bar_responses_question" ON "bar_responses"("question_id");

-- CreateIndex
CREATE INDEX "idx_bar_responses_quiz_user" ON "bar_responses"("quiz_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_question_banks_deleted_at" ON "question_banks"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_question_banks_tier" ON "question_banks"("tier");

-- CreateIndex
CREATE INDEX "qb_program_idx" ON "question_banks"("program_type");

-- CreateIndex
CREATE INDEX "qb_exam_idx" ON "question_banks"("exam_type");

-- CreateIndex
CREATE INDEX "qb_content_idx" ON "question_banks"("content_type");

-- CreateIndex
CREATE INDEX "qb_access_idx" ON "question_banks"("access_type");

-- CreateIndex
CREATE INDEX "qb_year_idx" ON "question_banks"("year");

-- CreateIndex
CREATE INDEX "qb_published_idx" ON "question_banks"("is_published");

-- CreateIndex
CREATE INDEX "qb_featured_idx" ON "question_banks"("is_featured");

-- CreateIndex
CREATE INDEX "qb_sort_idx" ON "question_banks"("sort_order");

-- CreateIndex
CREATE INDEX "idx_qbp_user" ON "question_bank_purchases"("user_id");

-- CreateIndex
CREATE INDEX "idx_qbp_qb" ON "question_bank_purchases"("question_bank_id");

-- CreateIndex
CREATE INDEX "idx_qbp_status" ON "question_bank_purchases"("status");

-- CreateIndex
CREATE UNIQUE INDEX "question_bank_purchases_user_id_question_bank_id_key" ON "question_bank_purchases"("user_id", "question_bank_id");

-- CreateIndex
CREATE INDEX "token_transactions_archive_2026_05_user_id_created_at_idx" ON "token_transactions_archive_2026_05"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_bar_fav_user" ON "bar_favorites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bar_favorites_user_id_item_id_item_type_key" ON "bar_favorites"("user_id", "item_id", "item_type");

-- CreateIndex
CREATE INDEX "bar_ush_user_quiz_pkg_idx" ON "bar_user_score_history"("user_id", "quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "bar_ush_quiz_pkg_idx" ON "bar_user_score_history"("quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_bar_score_user" ON "bar_user_score_history"("user_id");

-- CreateIndex
CREATE INDEX "idx_bar_score_quiz" ON "bar_user_score_history"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_bush_quiz_rank" ON "bar_user_score_history"("quiz_id", "net_score" DESC, "accuracy" DESC, "completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "case_references_slug_key" ON "case_references"("slug");

-- CreateIndex
CREATE INDEX "idx_cr_tags" ON "case_references" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_case_references_deleted_at" ON "case_references"("deleted_at");

-- CreateIndex
CREATE INDEX "case_references_category_idx" ON "case_references"("category");

-- CreateIndex
CREATE INDEX "case_references_year_idx" ON "case_references"("year");

-- CreateIndex
CREATE INDEX "case_references_published_idx" ON "case_references"("is_published", "published_at" DESC);

-- CreateIndex
CREATE INDEX "idx_lr_tags" ON "legal_research" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_legal_research_deleted_at" ON "legal_research"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_program_pages_program" ON "program_pages"("program_type", "page_type");

-- CreateIndex
CREATE INDEX "idx_program_pages_deleted_at" ON "program_pages"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "idx_courses_deleted_at" ON "courses"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_cl_course" ON "course_lessons"("course_id", "order_index");

-- CreateIndex
CREATE INDEX "course_lessons_deleted_at_idx" ON "course_lessons"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_course_lessons_deleted_at" ON "course_lessons"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "course_lesson_progress_user_id_lesson_id_key" ON "course_lesson_progress"("user_id", "lesson_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_user_id_course_id_key" ON "course_enrollments"("user_id", "course_id");

-- CreateIndex
CREATE INDEX "idx_book_suggestions_lookup" ON "book_suggestions"("program_type", "track", "category", "order_index");

-- CreateIndex
CREATE INDEX "idx_book_suggestions_deleted_at" ON "book_suggestions"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_llb_pdfs_year_subject" ON "llb_subject_pdfs"("year_level", "subject", "order_index");

-- CreateIndex
CREATE INDEX "idx_us_user_status" ON "user_subscriptions"("user_id", "status", "expires_at");

-- CreateIndex
CREATE INDEX "subscription_plans_deleted_at_idx" ON "subscription_plans"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_subscription_plans_deleted_at" ON "subscription_plans"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "fcm_tokens_token_key" ON "fcm_tokens"("token");

-- CreateIndex
CREATE INDEX "fcm_tokens_user_id_idx" ON "fcm_tokens"("user_id");

-- CreateIndex
CREATE INDEX "fcm_tokens_user_device_idx" ON "fcm_tokens"("user_id", "device_id");

-- CreateIndex
CREATE INDEX "fcm_tokens_active_idx" ON "fcm_tokens"("is_active");

-- CreateIndex
CREATE INDEX "chatbot_knowledge_scope_idx" ON "chatbot_knowledge"("access_scope", "program", "package_id");

-- CreateIndex
CREATE INDEX "chatbot_knowledge_fts_idx" ON "chatbot_knowledge" USING GIN ("search_vector");

-- CreateIndex
CREATE INDEX "chatbot_knowledge_type_idx" ON "chatbot_knowledge"("source_type");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_knowledge_src_chunk_uidx" ON "chatbot_knowledge"("source_type", "source_id", "chunk_index");

-- CreateIndex
CREATE INDEX "rl_window_idx" ON "chatbot_rate_limits"("window_start");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_rate_limits_user_id_window_kind_window_start_key" ON "chatbot_rate_limits"("user_id", "window_kind", "window_start");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_synonyms_term_synonym_key" ON "chatbot_synonyms"("term", "synonym");

-- CreateIndex
CREATE INDEX "msg_user_idx" ON "chatbot_messages"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "msg_session_idx" ON "chatbot_messages"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "cache_fts_idx" ON "chatbot_answer_cache" USING GIN ("search_vector");

-- CreateIndex
CREATE INDEX "cache_status_idx" ON "chatbot_answer_cache"("review_status");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_answer_cache_question_hash_language_key" ON "chatbot_answer_cache"("question_hash", "language");

-- CreateIndex
CREATE INDEX "chatbot_reindex_jobs_status_idx" ON "chatbot_reindex_jobs"("status", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_pdf_extractions_source_key_source_id_key" ON "chatbot_pdf_extractions"("source_key", "source_id");

-- CreateIndex
CREATE INDEX "idx_written_exams_program_types" ON "written_exams" USING GIN ("program_types");

-- CreateIndex
CREATE INDEX "written_exams_deleted_at_idx" ON "written_exams"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_written_exams_deleted_at" ON "written_exams"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_written_exams_access_type" ON "written_exams"("access_type");

-- CreateIndex
CREATE INDEX "written_exam_questions_deleted_at_idx" ON "written_exam_questions"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_weau_user" ON "written_exam_allowed_users"("user_id");

-- CreateIndex
CREATE INDEX "idx_weau_exam" ON "written_exam_allowed_users"("exam_id");

-- CreateIndex
CREATE INDEX "idx_weau_exam_user" ON "written_exam_allowed_users"("exam_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "written_exam_allowed_users_exam_id_user_id_key" ON "written_exam_allowed_users"("exam_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_wer_requests_user" ON "written_exam_resubmission_requests"("user_id");

-- CreateIndex
CREATE INDEX "idx_wer_requests_exam" ON "written_exam_resubmission_requests"("exam_id");

-- CreateIndex
CREATE INDEX "idx_wer_requests_status" ON "written_exam_resubmission_requests"("status");

-- CreateIndex
CREATE INDEX "idx_wer_requests_program" ON "written_exam_resubmission_requests"("program");

-- CreateIndex
CREATE INDEX "idx_wer_requests_user_exam" ON "written_exam_resubmission_requests"("user_id", "exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_wer_requests_one_pending" ON "written_exam_resubmission_requests"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "idx_wer_access_user_exam" ON "written_exam_resubmission_access"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "idx_wer_access_active" ON "written_exam_resubmission_access"("user_id", "exam_id", "expires_at");

-- CreateIndex
CREATE INDEX "bar_ws_user_exam_pkg_idx" ON "bar_written_submissions"("user_id", "exam_id", "package_id");

-- CreateIndex
CREATE INDEX "bar_ws_exam_pkg_idx" ON "bar_written_submissions"("exam_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_bar_ws_user_exam" ON "bar_written_submissions"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "idx_bar_ws_exam" ON "bar_written_submissions"("exam_id");

-- CreateIndex
CREATE INDEX "idx_bar_ws_status" ON "bar_written_submissions"("status");

-- CreateIndex
CREATE INDEX "idx_bar_written_subs_user_pkg" ON "bar_written_submissions"("user_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_bws_resub_req" ON "bar_written_submissions"("resubmission_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "uniq_bar_written_sub_doc" ON "bar_written_submissions"("user_id", "exam_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_daily_tasks_program_year_day" ON "daily_tasks"("program", "year_level", "day_index");

-- CreateIndex
CREATE INDEX "daily_tasks_deleted_at_idx" ON "daily_tasks"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_daily_tasks_deleted_at" ON "daily_tasks"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_tasks_program_day_index_key" ON "daily_tasks"("program", "day_index");

-- CreateIndex
CREATE UNIQUE INDEX "daily_tasks_program_year_day_unique" ON "daily_tasks"("program", "year_level", "day_index");

-- CreateIndex
CREATE UNIQUE INDEX "exam_archive_pdfs_quiz_id_key" ON "exam_archive_pdfs"("quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "note_tags_slug_key" ON "note_tags"("slug");

-- CreateIndex
CREATE INDEX "idx_np_user" ON "note_purchases"("user_id");

-- CreateIndex
CREATE INDEX "idx_np_note" ON "note_purchases"("note_id");

-- CreateIndex
CREATE INDEX "idx_np_status" ON "note_purchases"("status");

-- CreateIndex
CREATE INDEX "download_events_content_idx" ON "download_events"("content_type", "content_id", "downloaded_at" DESC);

-- CreateIndex
CREATE INDEX "download_events_user_idx" ON "download_events"("user_id", "downloaded_at" DESC);

-- CreateIndex
CREATE INDEX "download_events_time_idx" ON "download_events"("downloaded_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "download_events_dedupe" ON "download_events"("user_id", "content_type", "content_id", "session_key");

-- CreateIndex
CREATE INDEX "idx_announcements_package_ids" ON "announcements"("package_ids");

-- CreateIndex
CREATE INDEX "announcements_package_id_idx" ON "announcements"("package_id");

-- CreateIndex
CREATE INDEX "announcements_program_idx" ON "announcements"("program");

-- CreateIndex
CREATE INDEX "idx_announcements_deleted_at" ON "announcements"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "articles"("is_published", "published_at" DESC);

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_tags_gin" ON "articles" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_bare_act_sections_act" ON "bare_act_sections"("act_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_bare_act_sections_deleted_at" ON "bare_act_sections"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_bare_acts_deleted_at" ON "bare_acts"("deleted_at");

-- CreateIndex
CREATE INDEX "bare_acts_search_idx" ON "bare_acts"("search_vector");

-- CreateIndex
CREATE INDEX "idx_dg_tags" ON "discussion_groups" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_dp_tags" ON "discussion_posts" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "idx_favorites_user_type" ON "favorites"("user_id", "item_type");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_item_id_item_type_key" ON "favorites"("user_id", "item_id", "item_type");

-- CreateIndex
CREATE INDEX "idx_flashcard_decks_deleted_at" ON "flashcard_decks"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_flashcards_deleted_at" ON "flashcards"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_legal_dictionary_term" ON "legal_dictionary"("term_en");

-- CreateIndex
CREATE INDEX "idx_legal_dictionary_category" ON "legal_dictionary"("category");

-- CreateIndex
CREATE INDEX "idx_legal_dictionary_deleted_at" ON "legal_dictionary"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_mentor_queries_user" ON "mentor_queries"("user_id");

-- CreateIndex
CREATE INDEX "idx_mentor_replies_query" ON "mentor_replies"("query_id");

-- CreateIndex
CREATE INDEX "notes_package_ids_gin" ON "notes" USING GIN ("package_ids");

-- CreateIndex
CREATE INDEX "idx_notifications_user_created" ON "notifications"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_past_exam_questions_subject" ON "past_exam_questions"("subject", "year");

-- CreateIndex
CREATE INDEX "idx_past_exam_questions_deleted_at" ON "past_exam_questions"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_questions_quiz_section" ON "questions"("quiz_id", "section_id", "section_position");

-- CreateIndex
CREATE INDEX "idx_questions_deleted_at" ON "questions"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_retake_requests_user_quiz" ON "quiz_retake_requests"("user_id", "quiz_id");

-- CreateIndex
CREATE INDEX "idx_retake_requests_status" ON "quiz_retake_requests"("status");

-- CreateIndex
CREATE INDEX "idx_quizzes_exam_type_track" ON "quizzes"("exam_type", "exam_track");

-- CreateIndex
CREATE INDEX "idx_quizzes_program_exam" ON "quizzes"("program_type", "exam_type");

-- CreateIndex
CREATE INDEX "idx_quizzes_live_window" ON "quizzes"("live_start_time", "live_end_time");

-- CreateIndex
CREATE INDEX "idx_quizzes_program_types" ON "quizzes" USING GIN ("program_types");

-- CreateIndex
CREATE INDEX "idx_quizzes_deleted_at" ON "quizzes"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_quizzes_access_type" ON "quizzes"("access_type");

-- CreateIndex
CREATE INDEX "responses_qb_idx" ON "responses"("question_bank_id");

-- CreateIndex
CREATE INDEX "responses_user_quiz_pkg_idx" ON "responses"("user_id", "quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "responses_quiz_pkg_idx" ON "responses"("quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_responses_quiz_user" ON "responses"("quiz_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_roadmap_modules_deleted_at" ON "roadmap_modules"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_roadmap_stages_deleted_at" ON "roadmap_stages"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_study_group_messages_group" ON "study_group_messages"("group_id", "created_at");

-- CreateIndex
CREATE INDEX "token_rules_deleted_at_idx" ON "token_rules"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_notifications_user_id_announcement_id_key" ON "user_notifications"("user_id", "announcement_id");

-- CreateIndex
CREATE INDEX "ush_user_quiz_pkg_idx" ON "user_score_history"("user_id", "quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "ush_quiz_pkg_idx" ON "user_score_history"("quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_ush_quiz_rank" ON "user_score_history"("quiz_id", "net_score" DESC, "accuracy" DESC, "completed_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_weakness_stats_user_id_topic_key" ON "user_weakness_stats"("user_id", "topic");

-- CreateIndex
CREATE INDEX "idx_written_submissions_user" ON "written_submissions"("user_id");

-- CreateIndex
CREATE INDEX "idx_written_submissions_quiz" ON "written_submissions"("quiz_id");

-- CreateIndex
CREATE INDEX "idx_written_submissions_status" ON "written_submissions"("status");

-- CreateIndex
CREATE INDEX "ws_user_exam_pkg_idx" ON "written_submissions"("user_id", "exam_id", "package_id");

-- CreateIndex
CREATE INDEX "ws_exam_pkg_idx" ON "written_submissions"("exam_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_ws_user_quiz_pkg" ON "written_submissions"("user_id", "quiz_id", "package_id");

-- CreateIndex
CREATE INDEX "idx_ws_resub_req" ON "written_submissions"("resubmission_request_id");

-- AddForeignKey
ALTER TABLE "account_deletions" ADD CONSTRAINT "account_deletions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_deletion_attempts" ADD CONSTRAINT "account_deletion_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_content_rules" ADD CONSTRAINT "package_content_rules_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_access_requests" ADD CONSTRAINT "package_access_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_access_requests" ADD CONSTRAINT "package_access_requests_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_access_requests" ADD CONSTRAINT "package_access_requests_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_package_access" ADD CONSTRAINT "user_package_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_package_access" ADD CONSTRAINT "user_package_access_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_package_access" ADD CONSTRAINT "user_package_access_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "package_access_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_package_access" ADD CONSTRAINT "user_package_access_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_package_access" ADD CONSTRAINT "user_package_access_revoked_by_fkey" FOREIGN KEY ("revoked_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_unlocks" ADD CONSTRAINT "user_unlocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_submissions" ADD CONSTRAINT "written_submissions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_queries" ADD CONSTRAINT "mentor_queries_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentor_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_prerequisite_quiz_id_fkey" FOREIGN KEY ("prerequisite_quiz_id") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_allowed_users" ADD CONSTRAINT "quiz_allowed_users_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_allowed_users" ADD CONSTRAINT "quiz_allowed_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "exam_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_question_bank_id_fkey" FOREIGN KEY ("question_bank_id") REFERENCES "question_banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_responses" ADD CONSTRAINT "bar_responses_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_responses" ADD CONSTRAINT "bar_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_responses" ADD CONSTRAINT "bar_responses_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_responses" ADD CONSTRAINT "bar_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_responses" ADD CONSTRAINT "bar_responses_question_bank_id_fkey" FOREIGN KEY ("question_bank_id") REFERENCES "question_banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_bank_purchases" ADD CONSTRAINT "question_bank_purchases_question_bank_id_fkey" FOREIGN KEY ("question_bank_id") REFERENCES "question_banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_score_history" ADD CONSTRAINT "user_score_history_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_favorites" ADD CONSTRAINT "bar_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_user_score_history" ADD CONSTRAINT "bar_user_score_history_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_user_score_history" ADD CONSTRAINT "bar_user_score_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_user_score_history" ADD CONSTRAINT "bar_user_score_history_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lesson_progress" ADD CONSTRAINT "course_lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_lesson_progress" ADD CONSTRAINT "course_lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "course_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fcm_tokens" ADD CONSTRAINT "fcm_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_preferences" ADD CONSTRAINT "push_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_logs" ADD CONSTRAINT "push_logs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_rate_limits" ADD CONSTRAINT "chatbot_rate_limits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_sessions" ADD CONSTRAINT "chatbot_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chatbot_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatbot_messages" ADD CONSTRAINT "chatbot_messages_cache_id_fkey" FOREIGN KEY ("cache_id") REFERENCES "chatbot_answer_cache"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exams" ADD CONSTRAINT "written_exams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_questions" ADD CONSTRAINT "written_exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_allowed_users" ADD CONSTRAINT "written_exam_allowed_users_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_allowed_users" ADD CONSTRAINT "written_exam_allowed_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_requests" ADD CONSTRAINT "written_exam_resubmission_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_requests" ADD CONSTRAINT "written_exam_resubmission_requests_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_access" ADD CONSTRAINT "written_exam_resubmission_access_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "written_exam_resubmission_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_access" ADD CONSTRAINT "written_exam_resubmission_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "written_exam_resubmission_access" ADD CONSTRAINT "written_exam_resubmission_access_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_written_submissions" ADD CONSTRAINT "bar_written_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_written_submissions" ADD CONSTRAINT "bar_written_submissions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "written_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_written_submissions" ADD CONSTRAINT "bar_written_submissions_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bar_written_submissions" ADD CONSTRAINT "bar_written_submissions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_tasks" ADD CONSTRAINT "daily_tasks_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_archive_pdfs" ADD CONSTRAINT "exam_archive_pdfs_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_tag_map" ADD CONSTRAINT "note_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "note_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_purchases" ADD CONSTRAINT "note_purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_purchases" ADD CONSTRAINT "note_purchases_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "download_events" ADD CONSTRAINT "download_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "token_tx_user_created_idx" RENAME TO "idx_tt_user";

import { ReportPostForm } from "@/components/moderation/ReportPostForm";

export default function TestReportPostCard() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="border rounded-md p-4 space-y-3">
        <div className="font-medium">Seed Member</div>
        <div className="text-sm text-muted-foreground">
          Seeded moderation test post
        </div>

        <ReportPostForm
          reporterId="seed-admin-profile"
          reportedUserId="seed-member-profile"
          reportedPostId="61de69f3-9551-4d08-917c-d00e0b2af29d"
        />
      </div>
    </div>
  );
}
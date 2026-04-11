import TestReportPostCard from "./post-card";

type Props = {
  searchParams?: {
    submitted?: string;
  };
};

export default function TestReportPage({ searchParams }: Props) {
  const submitted = searchParams?.submitted === "1";

  return (
    <div className="space-y-4">
      {submitted && (
        <div className="p-4 text-sm border rounded m-4">
          Report submitted.
        </div>
      )}

      <TestReportPostCard />
    </div>
  );
}
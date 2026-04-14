export const dynamic = "force-dynamic";

type JourneyPageProps = {
  searchParams?: {
    payment?: string;
  };
};

export default function JourneyPage({ searchParams }: JourneyPageProps) {
  const paymentSuccess = searchParams?.payment === "success";

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl">Journey Active</h1>

      {paymentSuccess && (
        <p className="mt-4 text-green-400">Payment success confirmed</p>
      )}

      <p className="mt-4">
        Your Journey page is now stable again.
      </p>
    </main>
  );
}
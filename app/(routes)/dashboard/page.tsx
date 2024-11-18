// app/(routes)/dashboard/page.tsx
import FeedbackTable from "../../../app/_components/FeedbackTable";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold text-black">Feedback Dashboard</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-black">All Feedback</h2>
        </div>
        <div className="p-6">
          <FeedbackTable />
        </div>
      </div>
    </div>
  );
}
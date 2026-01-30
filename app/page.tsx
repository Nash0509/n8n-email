"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, AlertTriangle, Folder, Smile, Search, ChevronRight, Loader2 } from "lucide-react";
import {
  Chart as ChartJS,
  LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(LineElement, ArcElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [emails, setEmails] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/emails")
      .then((res) => res.json())
      .then((data) => {
        setEmails(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => ({
    total: emails.length,
    highPriority: emails.filter((e) => e.priority === "High").length,
    actionNeeded: emails.filter((e) => e.action_required === "Yes").length,
    positive: emails.filter((e) => e.sentiment === "Positive").length,
  }), [emails]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    emails.forEach((e) => (counts[e.category] = (counts[e.category] || 0) + 1));
    return counts;
  }, [emails]);

  // Chart Data Configurations
  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      data: Object.values(categoryCounts),
      backgroundColor: ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6"],
      borderWidth: 0,
    }],
  };

  const trendData = {
    labels: emails.slice(0, 10).map((_, i) => `Day ${i + 1}`),
    datasets: [{
      label: "Volume",
      data: [12, 19, 15, 22, 30, 25, 40, 35, 45, 50],
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.12)",
      fill: true,
      tension: 0.4,
    }],
  };

  const filtered = emails.filter((e) =>
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.from.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Analyzing Inbox...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 font-sans">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Email Intelligence</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage and analyze your communication flow.</p>
          </div>
          
          {/* SEARCH BOX FIXED */}
          <div className="relative flex items-center group">
            <Search className="absolute left-3.5 z-20 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
            <input
              type="text"
              placeholder="Filter emails..."
              className="relative z-10 pl-11 pr-4 py-3 w-full md:w-80 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Mail />} label="Inbox Volume" value={stats.total} color="bg-blue-500" />
          <StatCard icon={<AlertTriangle />} label="High Priority" value={stats.highPriority} color="bg-rose-500" />
          <StatCard icon={<Folder />} label="Action Items" value={stats.actionNeeded} color="bg-amber-500" />
          <StatCard icon={<Smile />} label="Positive Sentiment" value={`${stats.total ? Math.round((stats.positive / stats.total) * 100) : 0}%`} color="bg-emerald-500" />
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <ChartCard title="Email Traffic Over Time" className="lg:col-span-2">
            <div className="h-[300px]"><Line data={trendData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
          </ChartCard>
          <ChartCard title="Category Mix">
            <div className="h-[300px] flex items-center justify-center"><Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} /></div>
          </ChartCard>
        </div>

        {/* TABLE */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Recent Communication</h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold uppercase tracking-tight">Live Updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.1em] font-bold">
                <tr>
                  <th className="px-8 py-4">Sender & Subject</th>
                  <th className="px-6 py-4 text-center">Priority</th>
                  <th className="px-6 py-4 text-center">Category</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((e) => (
                  <tr key={e._id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{e.subject}</span>
                        <span className="text-xs text-slate-400 font-medium">{e.from}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center"><PriorityBadge priority={e.priority} /></td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-tight">{e.category}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all"><ChevronRight size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components stay largely the same but with refined padding/styling
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[1.5rem] p-6 shadow-sm border border-slate-200 flex flex-col gap-4 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
      <div className={`${color} w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>{icon}</div>
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black mt-1 text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: any) {
  return (
    <div className={`bg-white/80 backdrop-blur-md rounded-[1.5rem] shadow-sm border border-slate-200 p-8 flex flex-col ${className}`}>
      <h2 className="font-bold mb-6 text-lg text-slate-800">{title}</h2>
      {children}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: any = {
    High: "bg-rose-50 text-rose-600 border-rose-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border-2 ${styles[priority]}`}>{priority}</span>;
}
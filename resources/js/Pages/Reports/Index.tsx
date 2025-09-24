import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Reports() {
  const { props } = usePage<any>();
  const { results, users, filters } = props;

  const [from, setFrom] = useState(filters.from || "");
  const [to, setTo] = useState(filters.to || "");
  const [userId, setUserId] = useState(filters.user_id || "");
  const [status, setStatus] = useState(filters.status || "");

  return (
    <AppLayout >
      <div className="bg-white p-4 rounded shadow">
        <form method="GET" className="grid grid-cols-4 gap-4">
          <input type="date" name="from" value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2 rounded" />
          <input type="date" name="to" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 rounded" />
          <select name="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} className="border p-2 rounded">
            <option value="">All users</option>
            {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
            <option value="">All statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <div className="col-span-4 mt-2">
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Filter</button>
          </div>
        </form>

        <div className="mt-6 overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Activity</th>
                <th className="text-left p-2">Current Status</th>
                <th className="text-left p-2">Latest Update</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.activity_date}</td>
                  <td className="p-2">{r.master?.title}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">
                    {r.updates.length ? (
                      <div>
                        <div className="text-sm">{r.updates[r.updates.length - 1].user?.name}</div>
                        <div className="text-xs">{r.updates[r.updates.length - 1].remark}</div>
                      </div>
                    ) : <span className="text-xs text-gray-500">No updates</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

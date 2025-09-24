import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { Inertia } from "@inertiajs/inertia";
import { route } from "@/lib/route";

export default function Show() {
    const { props } = usePage<any>();
    const activity = props.activity;
    const [remark, setRemark] = useState("");
    const [status, setStatus] = useState(activity.status);

    function submitUpdate(e: React.FormEvent) {
        e.preventDefault();
        Inertia.patch(route("daily.update", activity.id), { status, remark }, {
            onSuccess: () => {
                setRemark("");
                // optionally reload to fetch new history
                Inertia.reload();
            }
        });
    }

    return (
        <AppLayout>
            <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-600">{activity.master?.description}</p>

                <div className="mt-4">
                    <form onSubmit={submitUpdate} className="space-y-3">
                        <div>
                            <label className="block text-sm">Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-48 border rounded p-2">
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm">Remark</label>
                            <textarea value={remark} onChange={(e) => setRemark(e.target.value)} className="mt-1 block w-full border rounded p-2" rows={3} />
                        </div>

                        <div>
                            <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Save update</button>
                        </div>
                    </form>
                </div>

                <div className="mt-6">
                    <h3 className="font-medium">History</h3>
                    <ul className="mt-3 space-y-2">
                        {activity.updates.map((u: any) => (
                            <li key={u.id} className="bg-slate-50 p-2 rounded border">
                                <div className="text-sm"><strong>{u.user?.name}</strong> • {new Date(u.created_at).toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Status: {u.status}</div>
                                <div className="mt-1 text-sm">{u.remark}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}

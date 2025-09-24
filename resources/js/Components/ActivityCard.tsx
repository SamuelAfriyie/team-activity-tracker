import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { route } from "@/lib/route";
import { Link } from "@inertiajs/react";
import { Clock, MessageSquare, Plus, User } from "lucide-react";
import { Button } from "./ui/button";
import { AddRemarkModal } from "./ActivityRemarkModal";
import { ActivityDetailsModal } from "./ActivityDetailsModal";
import axios from "axios";

export default function ActivityCard({ activity }: { activity: any }) {
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const latest = activity.latest_update || null;

    async function handleUpdateRemark(remark: string, timestamp: any) {
        // Inertia.patch(route('daily.update', activity.id), {
        //     remark,
        //     status: activity?.status ?? "pending",
        // });

        await axios.patch(route("daily.update", activity.id), {
            remark,
            status: activity?.status ?? "pending",
        }).then(() => {
            Inertia.reload();
            console.log("Updated successfully");
        });
    }

    return (
        <div className="bg-white p-3 rounded shadow-sm border overflow-y-auto">
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <div className="font-semibold">{activity.master?.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.master?.description}</div>
                </div>
                {/* <div className="text-xs text-gray-600 text-nowrap">{latest ? `${latest.user?.name} • ${new Date(latest.created_at).toLocaleTimeString()}` : ""}</div> */}
            </div>

            <div className="space-y-3 my-4">

                {latest && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-sm">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{latest.user?.name}</span>

                    {latest.user?.department && (
                        <span className="text-xs">• {latest.user.department}</span>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                )} 

                {/* Current Remark */}
                {(activity.remark || (latest && latest.remark)) && (
                    <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5" />
                        <p className="text-card-foreground flex-1 text-xs">
                            {activity.remark || latest?.remark}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-3 flex gap-2">
                <Button
                    onClick={() => { setIsRemarkModalOpen(true); }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Remark
                </Button>
                <Button
                    onClick={() => { setIsDetailsModalOpen(true); }}
                    variant="ghost"
                    size="sm"
                    className="bg-gray-100"

                >
                    Details
                </Button>
            </div>


            <AddRemarkModal
                isOpen={isRemarkModalOpen}
                onClose={() => setIsRemarkModalOpen(false)}
                activity={activity}
                onSubmit={handleUpdateRemark}
            />

            <ActivityDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                activity={activity}
                onAddRemark={() => {
                    setIsDetailsModalOpen(false);
                    setIsRemarkModalOpen(true);
                }}
            />
        </div>
    );
}

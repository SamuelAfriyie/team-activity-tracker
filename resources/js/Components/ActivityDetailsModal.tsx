import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Clock, User, MessageSquare, CheckCircle, Clock3, Plus, LoaderPinwheel } from "lucide-react";

interface ActivityDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: any;
    onAddRemark: () => void;
}

export function ActivityDetailsModal({ isOpen, onClose, activity, onAddRemark }: ActivityDetailsModalProps) {
    const updates = activity.updates || null;

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            done: { variant: "done" as const, icon: CheckCircle, label: "Done" },
            in_progress: { variant: "in_progress" as const, icon: LoaderPinwheel, label: "In Progress" },
            pending: { variant: "pending" as const, icon: Clock3, label: "Pending" }
        };

        const config = (statusConfig[status as keyof typeof statusConfig] || statusConfig.pending) as any;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1 mr-4">
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>{activity.master?.title}</span>
                        {getStatusBadge(activity.status)}
                    </DialogTitle>
                    <DialogDescription>
                        {activity.master?.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Activity Statistics */}
                    <div className="space-y-3">
                        <h4 className="font-medium">Activity Statistics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="text-sm font-medium">Total Updates</div>
                                <div className="text-2xl font-bold text-primary">
                                    {activity?.updates?.length || 0}
                                </div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg">
                                <div className="text-sm font-medium">Activity ID</div>
                                <div className="text-sm font-mono">{activity.id}</div>
                            </div>
                        </div>
                    </div>

                    {/* All updates Update Info */}
                    {updates?.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="font-medium">All Update</h4>
                            <div className="h-[200px] overflow-y-auto space-y-3">
                                {
                                    updates?.reverse()?.map((d: any) => (
                                        <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{d.user?.name}</span>
                                                {d.user?.department && (
                                                    <span className="text-sm text-muted-foreground">• {d.user.department}</span>
                                                )}
                                                {d.user?.role && (
                                                    <span className="text-sm text-muted-foreground">• {d.user.role}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(d.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            {d.remark && (
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                    <p className="text-sm">{d.remark}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    ) :
                        <p>No Updates</p>
                    }

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                        <Button onClick={onAddRemark} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Remark
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
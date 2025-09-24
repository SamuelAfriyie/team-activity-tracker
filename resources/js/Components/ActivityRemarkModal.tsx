import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "./ui/label";
// import { Activity } from "./ActivityCard";

interface AddRemarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: any;
    onSubmit: (remark: string, timestamp: any) => void;
}

export function AddRemarkModal({ isOpen, onClose, activity, onSubmit }: AddRemarkModalProps) {
    const [remark, setRemark] = useState("");


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!remark.trim()) {
            return;
        }

        onSubmit(remark, new Date().toISOString());

        // Reset form
        setRemark("");

    };

    const handleClose = () => {
        setRemark("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Remark</DialogTitle>
                    <DialogDescription>
                        Add a remark for "{activity.master?.title}"
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Remark */}
                        <div className="space-y-2">
                            <Label htmlFor="remark">Remark *</Label>
                            <Textarea
                                id="remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Enter your remark here..."
                                rows={3}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!remark.trim()}
                            className="bg-blue-600  hover:bg-blue-700"
                        >
                            Add Remark
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
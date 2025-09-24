import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import ActivityCard from "@/Components/ActivityCard";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { route } from "@/lib/route";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Activity = any;
type Props = {
  activities: Record<string, Activity[]>;
  date: string;
};

export default function Dashboard() {
  const { props } = usePage<any>();
  const serverActivities: Record<string, Activity[]> = props.activities || { pending: [], done: [] };
  const date: string = props.date;

  const [filterDate, setDate] = useState<Date>();

  // maintain local state for optimistic UI
  const [activities, setActivities] = useState<Record<string, Activity[]>>(serverActivities);

  // update state when server props change (e.g., after navigation)
  useEffect(() => setActivities(serverActivities), [serverActivities]);

  console.log("Activities structure: ", serverActivities)

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    // clone state
    const local = {
      pending: [...(activities.pending || [])],
      // in_progress: [...(activities.in_progress || [])], 
      done: [...(activities.done || [])],
    } as any;

    // remove from source
    const [moved] = local[sourceCol].splice(sourceIndex, 1);
    // insert into destination
    local[destCol].splice(destIndex, 0, moved);

    // optimistic UI update
    setActivities(local);

    // build payload - arrays of ids per column (persistent ordering)
    const payloadColumns: Record<string, number[]> = {};
    (Object.keys(local) as (keyof typeof local)[]).forEach((k: any) => {
      payloadColumns[k] = local[k].map((a: any) => a.id);
    });

    await axios.post(route("daily.reorder"), {
      columns: payloadColumns, date
    }).then(() => {
      console.log("Updated successfully");
    }).catch(() => {
      alert("failed")
      Inertia.reload();
    });
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const columns = ["pending", "done"];

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* 🔹 Top Navbar */}
        <header className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Team Activity Tracker</h1>

          <div className="flex gap-3 items-center">
            <span className="text-gray-600 text-sm">Date: {format(filterDate ?? date, "PPP")}</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size={'sm'} >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Switch Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filterDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* 🔹 Page Content */}
        <main className="flex-1 p-6 overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Daily Board</h2>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-2 gap-6 h-[calc(100vh-140px)]">
              {columns.map((col) => (
                <Droppable droppableId={col} key={col}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col rounded-lg border-2 border-dashed transition-colors
                      ${snapshot.isDraggingOver ? "border-blue-400 bg-blue-50/50" : "border-gray-300 bg-gray-50"}
                      `}
                    >
                      {/* Column Header */}
                      <div className="px-3 py-2 border-b bg-white rounded-t-lg">
                        <h3 className="capitalize font-medium">{col}</h3>
                      </div>

                      {/* Scrollable Task Area */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[400px] max-h-[600px]">
                        {((activities[col] || []) as any[]).map((act: any, index: number) => (
                          <Draggable draggableId={`${act.id}`} index={index} key={act.id}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                                <ActivityCard activity={act} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </main>
      </div>
    </AppLayout>
  );
}

"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Row, Task } from "./board-element";
import { Draggable } from "./draggable";

type DroppableProps = {
  row: Row;
  deleteRow: (id: number) => void;
  tasks: Task[];
};

export function Droppable(props: DroppableProps) {
  const { row, deleteRow, tasks } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    data: {
      type: "Row",
      row,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-sm bg-transparent border border-dashed border-stone-500/20 h-14 flex-1 p-2 cursor-grab"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-sm bg-transparent cursor-grab relative overflow-y-auto"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="font-semibold text-sm flex items-center justify-between gap-2 w-full"
      >
        <button
          className="transition w-auto text-rose-600"
          onClick={() => {
            deleteRow(row.id);
          }}
        >
          remove
        </button>
      </div>

      <div data-isdragging={isDragging} className="flex w-full">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <Draggable key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

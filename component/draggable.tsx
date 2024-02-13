"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./board-element";

type DraggableProps = {
  task: Task;
};

export function Draggable(props: DraggableProps) {
  const { task } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
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
        className="flex-1 rounded-sm border border-stone-500/20 h-14 p-2 cursor-grab"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-1 rounded-sm border border-stone-500/20 h-14 p-2 cursor-grab bg-stone-100"
    >
      <strong className="font-semibold line-clamp-1">{task.title}</strong>
    </div>
  );
}

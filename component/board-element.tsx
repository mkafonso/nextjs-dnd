"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Draggable } from "./draggable";
import { Droppable } from "./droppable";

export type Row = {
  id: number;
  title: string;
};

export type Task = {
  id: string | number;
  rowId: string | number;
  title: string;
};

const defaultCols: Row[] = [
  { id: 1, title: "Primeira linha" },
  { id: 2, title: "Segunda linha" },
  { id: 3, title: "Terceira linha" },
];

const defaultTasks: Task[] = [
  { id: "1", rowId: 1, title: "Qualitative research planning" },
  { id: "2", rowId: 1, title: "Newsletter feature" },
  { id: "4", rowId: 1, title: "Marketing Brainstorming" },
  { id: "5", rowId: 2, title: "Add CHANGELOG to client repo" },
  { id: "8", rowId: 2, title: "Add Commitlint" },
  { id: "9", rowId: 3, title: "Unboarding John Doe" },
];

export function BoardElement() {
  const [rows, setRows] = useState<Row[]>(defaultCols);
  const rowsId = useMemo(() => rows.map((col) => col.id), [rows]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 10,
  //     },
  //   })
  // );

  return (
    <div className="mt-8">
      <DndContext
        // sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto">
          <div className="">
            <SortableContext items={rowsId}>
              {rows.map((row) => (
                <Droppable
                  key={row.id}
                  row={row}
                  deleteRow={deleteRow}
                  tasks={tasks.filter((task) => task.rowId === row.id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeRow && (
              <Droppable
                row={activeRow}
                deleteRow={deleteRow}
                tasks={tasks.filter((task) => task.rowId === activeRow.id)}
              />
            )}
            {activeTask && <Draggable task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function deleteRow(id: number) {
    const filteredRows = rows.filter((col) => col.id !== id);
    setRows(filteredRows);

    const newTasks = tasks.filter((t) => t.rowId !== id);
    setTasks(newTasks);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Row") {
      setActiveRow(event.active.data.current.row);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveRow(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveARow = active.data.current?.type === "Row";
    if (!isActiveARow) return;

    console.log("DRAG END");

    setRows((rows) => {
      const activeRowIndex = rows.findIndex((col) => col.id === activeId);

      const overRowIndex = rows.findIndex((col) => col.id === overId);

      return arrayMove(rows, activeRowIndex, overRowIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].rowId != tasks[overIndex].rowId) {
          tasks[activeIndex].rowId = tasks[overIndex].rowId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverARow = over.data.current?.type === "Row";

    if (isActiveATask && isOverARow) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].rowId = overId;
        console.log("DROPPING TASK OVER ROW", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

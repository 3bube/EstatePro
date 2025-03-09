"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChartComponent } from "./ChartComponent";

type Widget = {
  id: string;
  type: string;
  data: any;
};

type WidgetProps = {
  widget: Widget;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
};

const WidgetItem: React.FC<WidgetProps> = ({ widget, index, moveWidget }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WIDGET",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "WIDGET",
    hover: (item: { index: number }, monitor) => {
      if (!drag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="mb-4"
    >
      <ChartComponent type={widget.type} data={widget.data} />
    </div>
  );
};

type DashboardBuilderProps = {
  widgets: Widget[];
};

export function DashboardBuilder({ widgets }: DashboardBuilderProps) {
  const [items, setItems] = useState(widgets);

  useEffect(() => {
    setItems(widgets);
  }, [widgets]);

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    const draggedWidget = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedWidget);
    setItems(newItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((widget, index) => (
          <WidgetItem
            key={widget.id}
            widget={widget}
            index={index}
            moveWidget={moveWidget}
          />
        ))}
      </div>
    </DndProvider>
  );
}

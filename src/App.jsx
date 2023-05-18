import { v4 as uuid } from 'uuid'
import React, { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Droppable from "./components/Droppable";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";

function App() {
  const [items, setItems] = useState({
    monday: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    tuesday:[
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    wednesday: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    thursday: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    friday: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    saturday: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    sunday: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ],
    other: [
      { text: '1', id: uuid()},
      { text: '1', id: uuid()}
    ]
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;
        const item = {...active, text: active.data.current.text}
        return moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          item
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            )
          };
        } else {
          const item = {...active, text: active.data.current.text}
          newItems = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            item
          );
        }
        return newItems;
      });
    }
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    console.log(item)
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item)
    };
  };

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    height: "90vh"
    };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div style={containerStyle}>
        {Object.keys(items).map((group) => (
          <Droppable id={group} items={items[group]} key={group} title={group}/>
        ))}
      </div>
    </DndContext>
  );
}

export default App;


import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PlayingCard } from 'components/Blackjack/PlayingCard'
import { Card, createNewDeck, shuffleDeck } from 'engine/common'
import React, { useState } from 'react'

const deck = shuffleDeck(createNewDeck())

interface Props {}

export const Experimental: React.FC<Props> = (props) => {
  const [items, setItems] = useState({
    hand1: [deck.cards[0], deck.cards[1], deck.cards[2]],
    hand2: [deck.cards[3]],
  })

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const findContainer = (id: string) => {
    if (id in items) return id
    return (
      Object.keys(items).find((key) =>
        items[key as keyof typeof items].find(
          (card) => card.pip + card.value === id,
        ),
      ) ?? null
    )
  }

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id)

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    const id = active.id
    const overId = over?.id

    // Find the containers
    const activeContainer = findContainer(id)
    const overContainer = overId ? findContainer(overId) : null

    if (
      !activeContainer ||
      !overContainer ||
      !overId ||
      activeContainer === overContainer
    ) {
      return
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer as keyof typeof items]
      const overItems = prev[overContainer as keyof typeof items]

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex(
        (card) => card.pip + card.value === id,
      )
      const overIndex = overItems.findIndex(
        (card) => card.pip + card.value === overId,
      )

      let newIndex
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1

        const modifier = isBelowLastItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer as keyof typeof items].filter(
            (item) => item.pip + item.value !== active.id,
          ),
        ],
        [overContainer]: [
          ...prev[overContainer as keyof typeof items].slice(0, newIndex),
          items[activeContainer as keyof typeof items][activeIndex],
          ...prev[overContainer as keyof typeof items].slice(
            newIndex,
            prev[overContainer as keyof typeof items].length,
          ),
        ],
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const id = active.id
    const overId = over?.id

    const activeContainer = findContainer(id)
    const overContainer = overId ? findContainer(overId) : null

    if (
      !activeContainer ||
      !overContainer ||
      !overId ||
      activeContainer !== overContainer
    ) {
      return
    }

    const activeIndex = items[activeContainer as keyof typeof items].findIndex(
      (card) => card.pip + card.value === id,
    )
    const overIndex = items[overContainer as keyof typeof items].findIndex(
      (card) => card.pip + card.value === overId,
    )

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer as keyof typeof items],
          activeIndex,
          overIndex,
        ),
      }))
    }

    setActiveId(null)
  }

  return (
    <div className="w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        autoScroll={false}
      >
        <div className="flex flex-col items-center justify-center">
          <DroppableHand id={'hand1'} cards={items.hand1} activeId={activeId} />
          <DroppableHand id={'hand2'} cards={items.hand2} activeId={activeId} />
          <DragOverlay>
            {activeId ? (
              <PlayingCard
                card={
                  deck.cards.find(
                    (card) => card.pip + card.value === activeId,
                  ) as Card
                }
              />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  )
}

const DroppableHand: React.FC<{
  cards: Card[]
  id: string
  activeId: string | null
}> = ({ cards, id, activeId }) => {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <SortableContext id={id} items={cards.map((card) => card.pip + card.value)}>
      <div
        ref={setNodeRef}
        className="flex gap-4 justify-center mt-32 bg-stone-600 rounded-lg px-8 py-2"
        style={{ minWidth: '200px', minHeight: '96px' }}
      >
        {cards.map((card) => (
          <DraggableCard
            card={card}
            key={card.pip + card.value}
            activeId={activeId}
          />
        ))}
      </div>
    </SortableContext>
  )
}

const DraggableCard: React.FC<{ card: Card; activeId: string | null }> = ({
  card,
  activeId,
}) => {
  const id = card.pip + card.value
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={activeId === id ? 'opacity-0' : ''}
    >
      <PlayingCard card={card} />
    </div>
  )
}

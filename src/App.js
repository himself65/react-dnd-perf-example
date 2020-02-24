import React, { useEffect, useMemo } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { useLocalStore, useObserver } from 'mobx-react'
import Backend from 'react-dnd-html5-backend'

import './App.css'

let __id = 1

function generateID () {
  __id = __id + 1
  return __id
}

const DRAG_ITEM_TYPE = 'drag-item-type'

const DragItem = ({ item }) => {
  const { text } = item
  console.log('re-render')
  const [{ isDragging, didDrop }, ref] = useDrag({
    item: {
      type: DRAG_ITEM_TYPE,
      item
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
      didDrop: monitor.didDrop()
    })
  })
  return (
    <div
      ref={ref}
      style={{
        opacity: (isDragging || didDrop) ? 0.5 : undefined
      }}
    >
      {text}
    </div>
  )
}

const DropArea = () => {
  const [, ref] = useDrop({
    accept: DRAG_ITEM_TYPE,
    drop: (item) => {
      console.log('drop:', item)
      item.item.text = 'dropped'
    }
  })
  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}
      ref={ref}>
      This is DropArea
    </div>
  )
}

function App () {
  const store = useLocalStore(() => ({
    items: []
  }))
  let { items } = store
  items = useMemo(() => {
    return [...Array.from({ length: 100 }).keys()]
      .map(v => ({
        text: v,
        id: generateID()
      }))
  }, [])
  useEffect(() => {
    console.log('items:', items)
  }, [items])
  return useObserver(() =>
    <DndProvider backend={Backend}>
      <div
        style={{
          display: 'flex'
        }}
      >
        <div style={{
          width: '50%'
        }}>
          {items.map((item) => (<DragItem key={item.id} item={item}/>)
          )}
        </div>
        <div style={{
          width: '50%',
          float: 'right',
          backgroundColor: '#eee'
        }}>
          <DropArea/>
        </div>
      </div>
    </DndProvider>
  )
}

export default App

import MsgItem from "./MsgItem"
import MsgInput from "./MsgInput"
import { useState, useRef, useEffect } from "react"
import useInfiniteScroll from "../hooks/useInfiniteScroll"
import { useRouter } from "next/router"
import fetcher from '..fetcher.js'

const MsgList = ({smsgs, users}) => {
  const {
    query: { userId = ''}
  } = useRouter()
  const [msgs, setMsgs] = useState(smsgs)
  const [editingId, setEditingId] = useState(null)
  const [hasNext, setHasNext] = useState(true)
  const fetchMoreEl = useRef(null)
  const intersecting = useInfiniteScroll(fetchMoreEl)

  const onCreate = async text => {
    const newMsg = await fetcher('post', '/messages', {text, userId})
    setMsgs(msgs=>[newMsg, ...msgs])
  }

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId })
    if(!newMsg) throw Error('something wrong')
    setMsgs(msgs => {
      const targetIndex = msgs.findIndex(msg => msg.id === id)
      if (targetIndex < 0) return msgs
      const newMsgs = [...msgs]
      newMsgs.splice(targetIndex, 1, newMsg)
      return newMsgs
    })
    doneEdit()
  }

  const doneEdit = () => setEditingId(null)

  const onDelete = async (id) => { 
    const receviedId = await fetcher('delete', `/messages/${id}`, { params : { userId } })
    setMsgs(msgs => {
      const targetIndex = msgs.findIndex(msg => msg.id === receviedId+'')
      if (targetIndex < 0) return msgs
      const newMsgs = [...msgs]
      newMsgs.splice(targetIndex, 1)
      return newMsgs
    })
  }

  const getMessages = async () => {
    const msg = await fetcher('get', '/messages', { params: { cursor: msgs[msgs.length -1]?.id || ''}})
    if (msg.length === 0) {
      setHasNext(false)
      return
    }
    setMsgs(msgs => [...msgs, ...msg])
  }
  useEffect(()=>{
    if(intersecting && hasNext) getMessages()
  }, [intersecting, hasNext])

  return (
    <>
      <MsgInput mutate={onCreate}/>
      <ul className="messages">
        {msgs.map(x => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            startEdit={() => setEditingId(x.id)}
            onDelete={()=> onDelete(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl}/>
    </>
  )
}

export default MsgList
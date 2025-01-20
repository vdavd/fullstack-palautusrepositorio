import { useDispatch, useSelector } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
    const anecdotes = useSelector(({anecdotes, filter}) => {
        return anecdotes.filter(a => a.content.includes(filter))
    })
    anecdotes.sort((a, b) => b.votes - a.votes)
    const dispatch = useDispatch()

    const vote = (id) => {
      const anecdoteToVote = anecdotes.filter(a => a.id === id)[0]
      dispatch(addVote(anecdoteToVote))
      dispatch(setNotification(`You voted '${anecdoteToVote.content}'`, 5))
    }

    return (
        <div>
        <h2>Anecdotes</h2>
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
        </div>
    )
    
}

export default AnecdoteList
import { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = ({persons, handleClick}) => {
  return (
    <ul>
      {persons.map(person => <li key={person.name}>{person.name} {person.number} <button onClick={() => handleClick(person)}>delete</button></li>)}
    </ul>
)}

const Filter = ({text, filter, handler}) => {
  return (
    <div>
      {text} <input value={filter} onChange={handler} />
    </div>
  )
}

const PersonForm = ({submitHandler, name, number, nameChangeHandler, numberChangeHandler}) => {
  return (
    <div>
      <form onSubmit={submitHandler}>
      <div> name: <input value={name} onChange={nameChangeHandler} /> </div>
      <div> number: <input value={number} onChange={numberChangeHandler} /> </div>
        <div><button type="submit">add</button></div>
      </form>
    </div>
  )
}

const Notification = ({message, messageType}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={messageType}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('notification')

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))

  const messageTimeout = () => setTimeout(() => {setMessage(null)}, 4000)

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        changeNumber()
      } else {
        return
      }
    } else {
      const newPerson = {name: newName, number: newNumber}
      personService
        .create(newPerson)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setMessageType('notification')
          setMessage(`Added ${addedPerson.name}`)
        })
      messageTimeout()
    }
    setNewName('')
    setNewNumber('')
  }

  const changeNumber = () => {
    const person = persons.find(p => p.name === newName)
    const changedPerson = {...person, number: newNumber}

    personService
      .update(changedPerson.id, changedPerson)
      .then(updatedPerson => {
        setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
        setMessageType('notification')
        setMessage(`Updated number of ${updatedPerson.name}`)
      })
      .catch(error => {
        setMessageType('error')
        setMessage(`${changedPerson.name} was already removed from server`)
        setPersons(persons.filter(person => person.id != changedPerson.id))
      })
    messageTimeout()
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .deleteOne(person.id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id != deletedPerson.id))
        setMessageType('notification')
        setMessage(`Deleted ${deletedPerson.name}`)
      })
      messageTimeout()
    }
  }

  const handleFilterChange = (event) => setNameFilter(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleNameChange = (event) => setNewName(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} messageType={messageType} />
      <Filter text="filter shown with:" filter={nameFilter} handler={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm submitHandler={addPerson} name={newName} number={newNumber} 
        nameChangeHandler={handleNameChange} numberChangeHandler={handleNumberChange} />
      <h2>Numbers</h2>
        <Persons persons={namesToShow} handleClick={deletePerson}/>
    </div>
  )

}

export default App
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

const App = () => {
  const [persons, setPersons] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))

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
        .then(response => {
          setPersons(persons.concat(response.data))
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const changeNumber = () => {
    const person = persons.find(p => p.name === newName)
    const changedPerson = {...person, number: newNumber}

    personService
      .update(changedPerson.id, changedPerson)
      .then(response => {
        setPersons(persons.map(person => person.id !== changedPerson.id ? person : response.data))
      })
      
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .deleteOne(person.id)
      .then(response => {
        setPersons(persons.filter(person => person.id != response.data.id))
      })     
    }
  }

  const handleFilterChange = (event) => setNameFilter(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleNameChange = (event) => setNewName(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
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
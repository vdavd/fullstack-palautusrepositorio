import { useState } from 'react'

const Persons = ({persons}) => {
  return (
    <ul>
      {persons.map(person => <li key={person.name}>{person.name} {person.number}</li>)}
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' }
  ])
  const [nameFilter, setNameFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newPerson = {name: newName, number: newNumber}
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
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
        <Persons persons={namesToShow}/>
    </div>
  )

}

export default App
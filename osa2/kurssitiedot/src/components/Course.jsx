const Header = ({name}) => {
    return (
      <div>
        <h2> {name} </h2>
      </div>
    )
  }
  
  const Part = ({name, exercises}) => {
    return (
      <div>
        <p> {name} {exercises} </p>
      </div>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => 
          <Part key={part.id} name={part.name} exercises={part.exercises} />
          )}
      </div>
    )
  }
  
  const Total = ({parts}) => {
    return (
      <div>
        <p><b> Total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises </b></p>
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    )
  }

export default Course
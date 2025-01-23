import CoursePart from "../types";

interface ContentProps {
  courseParts: CoursePart[];
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <p>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <br></br>
          <i>{coursePart.description}</i>
        </p>
      );
    case "group":
      return (
        <p>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <br></br>
          group project {coursePart.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <br></br>
          <i>{coursePart.description}</i> <br></br>
          submit to {coursePart.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <b>
            {coursePart.name} {coursePart.exerciseCount}
          </b>
          <br></br>
          <i>{coursePart.description}</i> <br></br>
          required skills: {coursePart.requirements.join(", ")}
        </p>
      );
    default:
      return assertNever(coursePart);
  }
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((coursePart) => (
        <Part key={coursePart.name} coursePart={coursePart} />
      ))}
    </div>
  );
};

export default Content;

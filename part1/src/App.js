import React, { useState } from "react";

const Display = (props) => {
  return <div>{props.value}</div>
}

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const App = () => {
  const [value, setValue] = useState(10);

  const setToValue = (newValue) => {
    setValue(newValue);
  };

  const hello = (person) => () => {
    console.log(`oi ${person}`);
  };

  return (
    <div>
      <Display value={value} />
      <br />
      <Button handleClick={() => setToValue(1000)} text={1000} />
      <Button handleClick={() => setToValue(0)} text={"zero"} />
      <Button handleClick={() => setToValue(value + 1)} text={"add"} />
      <br />
      <button onClick={hello("andre")}>clickme</button>
    </div>
  );
};
export default App;

import React, {useCallback, useState} from "react";
import styles from "./Input.module.css";

type Props = {
  label: string;
  type: "text" | "checkbox";
  name: string;
  inputId?: number;
  changeHandle?: (value: any, type: any, inputId?: number) => void;
}

export const Input: React.FC<Props> = ({ label, type, name, inputId, changeHandle }) => {

  const [inputState, setInputState] = useState<{isChecked: boolean, [k:string]: any}>({isChecked: false, [name]: ""});

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {

    const target = event.target;

    const value = target.name === "isChecked" ? target.checked : target.value;

    setInputState((prevState) => ({
      ...prevState, [target.name] : value
    }));

    changeHandle && changeHandle(value, name, inputId);

  }, []);

  const attr = type === "checkbox"
    ? {className: styles.checkInput, type, name: name, checked: inputState.isChecked}
    : {className: styles.textInput, type, name: name, value: inputState[name]};

  return (
    <div className={styles.container}>
      <label>
        <p className={type === "checkbox" ? styles.teacherLabel : ""}>{label} :</p>
        <input {...attr} onChange={handleInputChange}/>
      </label>
    </div>
  );
};
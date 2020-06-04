import React, {useCallback, useEffect, useState} from "react";
import styles from "./Input.module.css";

type Props = {
  label: string;
  type: "text" | "checkbox";
  name: string;
  inputId?: number;
  changeHandle?: (value: any, type: any, inputId?: number) => void;
  isCleared?: boolean;
  defaultValue: string | boolean;
  editMode?: boolean;
  isUndo?: boolean;
}

export const Input: React.FC<Props> = (
  {
    label,
    type,
    name,
    inputId,
    changeHandle,
    isCleared,
    defaultValue,
    editMode,
    isUndo
  }) => {

  const [inputState, setInputState] = useState({[name]: defaultValue});

  const [editedClassName, setEditedClassName] = useState("");


  useEffect(() => {

    if(editMode) {
      setInputState((prevState => ({...prevState, [name]: defaultValue })));
      if(isUndo) {
        setEditedClassName("");
      }
    }

    if(isCleared) {
      if (name === "isChecked") {
        setInputState({[name]: false});
      }
      else {
        setInputState({[name]: ""});
      }
    }
  }, [isCleared, name, defaultValue, editMode, isUndo]);


  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {

    const target = event.target;

    const value = target.name === "isChecked" ? target.checked : target.value;

    setInputState((prevState) => ({
      ...prevState, [target.name] : value
    }));

    if(editMode && !isUndo) {
      setEditedClassName("edited");
    }

    changeHandle && changeHandle(value, name, inputId);

  }, [changeHandle, inputId, name, editMode]);

  const attr = type === "checkbox"
    ? {className: `${styles.checkInput} ${styles[editedClassName]}`, type, name, checked: !!inputState[name]}
    : {className: `${styles.textInput} ${styles[editedClassName]}`, type, name, value: inputState[name].toString()};


  return (
    <div className={styles.container}>
      <label>
        <p className={type === "checkbox" ? styles.teacherLabel : ""}>{label} :</p>
        <input {...attr} onChange={handleInputChange}/>
      </label>
    </div>
  );
};
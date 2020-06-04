import React, {Component} from "react";
import {Input} from "../Input/Input";
import styles from "./TaskForm.module.css";
import {Link} from "react-router-dom";
import {ChangeHandleTypes, FormSaveData} from "../../types";


type Props = {
  editMode: boolean;
  handleSubmit: (e: React.FormEvent, data: FormSaveData) => void;
  teachers: string[];
  data: FormSaveData;
  isSaved?: boolean;
}
type State = {
  data: FormSaveData;
  isUndo?: boolean;
}

export class TaskForm extends Component <Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: {
        description: "",
        answers: [],
        teachers: []
      },
      isUndo: false
    };
  }

  //Set to store prop data
  componentDidMount() {
    this.setState((prevState) => ({
      ...prevState, data: {...prevState.data, ...this.props.data}
    }));
  }

  //Check for undo changes for recycle process
  componentDidUpdate(prevProps: Props) {

    if (prevProps.isSaved !== this.props.isSaved) {
      this.setState((prevState) => ({
        ...prevState, data: {...prevState.data, ...this.props.data}
      }));
    }

    if (this.state.isUndo) {
      this.setState((prevState) => ({
        ...prevState, isUndo: false
      }));
    }

  }

  title = this.props.editMode
    ? "Форма редактирования задачи"
    : "Форма добавления задачи";

  addAnswer = () => {
    this.setState((prevState) => ({
      ...prevState, data: {...prevState.data, answers: [...prevState.data.answers, {text: ""}]}
    }));
  }

  delAnswer = () => {
    this.setState((prevState) => ({
      ...prevState,
      data: {...prevState.data, answers: prevState.data.answers.slice(0, prevState.data.answers.length - 1)}
    }));
  }

  //Process change handlers by different input types
  changeHandle: ChangeHandleTypes = (value, type, inputId) => {
    switch (type) {
    case "description" : {
      if(typeof (value) === "string") {
        this.setState((prevState) => ({
          ...prevState, data: {...prevState.data, description: value}
        }));
      }
      else {
        throw new Error("Error with value type");
      }
      break;
    }
    case "answer": {
      if(typeof (value) === "string") {
        this.setState((prevState) => {
          if (inputId !== undefined) {
            //Check message by inputId and if we have it - change only this message else add new message
            const answer = prevState.data.answers[inputId];

            if (answer) {
              return {
                ...prevState, data: {
                  ...prevState.data, answers: prevState.data.answers.map((answer, i) => {
                    return i === inputId ? {...answer, text: value} : answer;
                  })
                }
              };
            } else {
              return {
                ...prevState, data: {
                  ...prevState.data, answers: [...prevState.data.answers, {text: value}]
                }
              };
            }

          } else {
            throw new Error("Input id is undefined");
          }
        });
      }

      break;
    }

    case "isChecked": {
      if (inputId !== undefined) {
        this.setState((prevState) => {
          //Use set to exclude repeat of check/uncheck
          const setOfTeachers = new Set([...prevState.data.teachers, inputId]);
          if (!value) {
            setOfTeachers.delete(inputId);
          }

          return {
            ...prevState, data: {...prevState.data, teachers: [...Array.from(setOfTeachers).sort()]}
          };


        });
      } else {
        throw new Error("Input id is undefined");
      }
    }

    }
  }

  //Check for submit disable
  checkSubmit = () => {
    return (this.state.data.description !== "")
      && (this.state.data.answers.length > 0)
      && (this.state.data.answers.every(answer => answer.text !== ""))
      && (this.state.data.teachers.length > 0);
  }

  udoChanges = () => {
    this.setState((prevState) => ({
      ...prevState, data: {...this.props.data}, isUndo: true
    }));
  }
  //Add main attr to answer
  changeMainAnswer = (e: React.FormEvent, el: { main?: boolean; text: string }, type: string) => {
    e.preventDefault();
    const newAnswers = this.state.data.answers.map((answer) => {
      if (el === answer) {
        switch(type) {
        case "add": {
          return ({...answer, main: true});
        }
        case "del": {
          return ({text: answer.text});
        }
        default: return answer;
        }
      } else {
        return answer;
      }
    });

    this.setState((prevState) => ({
      ...prevState, data: {...prevState.data, answers: newAnswers}
    }))
    ;
  }

  //Check for disabling making main button
  checkMainChoosed = () => {
    return this.state.data.answers.some(answer => answer.main || answer.text === "");
  }

  render() {
    return (
      <div>
        <h2>{this.title}</h2>

        <form className="form" onSubmit={(e) => this.props.handleSubmit(e, this.state.data)}>

          <Input
            label="Условие"
            type={"text"}
            name="description"
            changeHandle={this.changeHandle}
            isCleared={this.props.isSaved}
            defaultValue={this.state.data.description}
            editMode={this.props.editMode}
            isUndo={this.state.isUndo}
          />

          <div className={styles.answers}>
            <p>Варианты ответа:</p>
            <div>
              <button
                className={styles.answersBtn}
                type="button"
                onClick={this.addAnswer}
              >
                +
              </button>
              <button
                className={`${styles.answersBtn} ${styles.deleteBtn}`}
                type="button"
                onClick={this.delAnswer}
                disabled={this.state.data.answers.length === 0}
              >
                -
              </button>
            </div>
          </div>

          {this.state.data.answers.map((el, i) => {

            return (
              <div key={i + "main"}>
                <div>
                  <button
                    className={styles.doMainBtn}
                    onClick={(e) =>this.changeMainAnswer(e, el, "add")}
                    disabled={this.checkMainChoosed()}
                  >
                    Сделать основным
                  </button>

                  <button
                    className={styles.undoMainBtn}
                    onClick={(e) =>this.changeMainAnswer(e, el, "del")}
                  >
                    Отменить
                  </button>
                </div>

                <Input
                  label={`Ответ № ${i + 1}   ${el.main ? "- Основной" : " "}`}
                  type="text"
                  name="answer"
                  inputId={i}
                  changeHandle={this.changeHandle}
                  isCleared={this.props.isSaved}
                  defaultValue={el && el.text}
                  editMode={this.props.editMode}
                  isUndo={this.state.isUndo}
                />
              </div>


            );
          })}

          <div>
            {this.props.teachers.map((teacher, i) => {
              return (
                <Input
                  label={teacher}
                  key={i + "Teacher id"}
                  type="checkbox"
                  name="isChecked"
                  inputId={i}
                  changeHandle={this.changeHandle}
                  isCleared={this.props.isSaved}
                  defaultValue={this.state.data.teachers.includes(i)}
                  editMode={this.props.editMode}
                  isUndo={this.state.isUndo}
                />);
            })}
          </div>

          <button className={styles.submitBtn} disabled={!this.checkSubmit()}>Сохранить</button>

          {
            !this.props.editMode
            &&
            <Link to="/edit">
              <button className={styles.goBtn}>Отредактировать текущие задачи</button>
            </Link>
          }

          {
            this.props.editMode
            &&
            <button className={styles.goBtn} onClick={this.udoChanges}>Отменить изменения</button>
          }

        </form>
      </div>
    );
  }


}


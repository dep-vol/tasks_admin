import React, {Component} from "react";
import styles from "./AddTuskForm.module.css";
import {Input} from "../Input/Input";

type FormData = {
  description: string;
  answers: { text: string, main?: boolean }[];
  teachers: number[];
}
type State = {
  tasks:[];
  answerCount: number;
  teachers: string[];
  data: FormData;
}

export class AddTuskForm extends Component<{}, State> {
  state = {

    answerCount: 1,
    teachers: ["Иванов И.И.", "Жуков Д.К.", "Петров И.И.", "Сидоров А.А."],
    data: {
      description: "",
      answers: [],
      teachers: []
    }
  };

  addAnswer = () => {
    this.setState((prevState) => ({
      ...prevState, answerCount: prevState.answerCount + 1
    }));
  }

  delAnswer = () => {
    this.setState((prevState) => ({
      ...prevState, answerCount: prevState.answerCount - 1
    }));
  }

  changeHandle = (value: any, type: any, inputId?: number) => {
    switch (type) {
    case "description" : {
      this.setState((prevState) => ({
        ...prevState, data: {...prevState.data, description: value}
      }));
      break;
    }
    case "answer": {
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

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log(this.state.data);
  }

  render() {
    return (
      <div>
        <h2>Форма добавления задачи</h2>

        <form className="form" onSubmit={this.handleSubmit}>

          <Input label="Условие" type={"text"} name="description" changeHandle={this.changeHandle}/>

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
                disabled={this.state.answerCount === 1}
              >
                -
              </button>
            </div>
          </div>

          {[...Array(this.state.answerCount)].map((el, i) => {

            return (
              <Input
                label={`Ответ № ${i + 1}`}
                key={i + "answerId"}
                type="text"
                name="answer"
                inputId={i}
                changeHandle={this.changeHandle}
              />);
          })}

          <div>
            {this.state.teachers.map((teacher, i) => {
              return (
                <Input
                  label={teacher}
                  key={i + "Teacher id"}
                  type="checkbox"
                  name="isChecked"
                  inputId={i}
                  changeHandle={this.changeHandle}
                />);
            })}
          </div>

          <button type="submit">Сохранить</button>
        </form>
      </div>
    );
  }
}
import React, {Component} from "react";
import {FormSaveData} from "../../types";
import styles from "./EditTaskForm.module.css";
import {TaskForm} from "../TaskForm/TaskForm";

type State = {
  tasks: FormSaveData[];
  isEditActive: boolean;
  editedTask: FormSaveData;
  editedTaskIndex: number | null;
  isSaved: boolean;
}
type Props = {}

export class EditTaskForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tasks: [],
      isEditActive: false,
      editedTask: {description: "", answers: [], teachers: []},
      editedTaskIndex: null,
      isSaved: false
    };
  }

  componentDidMount() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks != null) {
      this.setState((prevState) => ({...prevState, tasks: JSON.parse(storedTasks)}));
    }
  }

  componentDidUpdate(prevProps: Props, prevState:State) {
    if (this.state.tasks !== prevState.tasks) {
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }
  }

  switchEditState = (index: number) => {
    this.setState((prevState) => ({
      ...prevState, isEditActive: !prevState.isEditActive, editedTask: {...prevState.tasks[index]}, editedTaskIndex: index
    }));
  }

  handleSubmit = (event: React.FormEvent, data: FormSaveData) => {
    event.preventDefault();
    if(this.state.editedTaskIndex) {
      const editedTasksBefore = this.state.tasks.slice(0, this.state.editedTaskIndex);
      const editedTasksAfter = this.state.tasks.slice(this.state.editedTaskIndex+1, this.state.tasks.length);

      this.setState((prevState) => ({
        tasks: [...editedTasksBefore, {...data}, ...editedTasksAfter],
        isSaved: true
      }));

      console.log(data);
    }
    else {
      throw new Error("Error with index of edited task");
    }




  }


  render() {

    if (this.state.tasks.length === 0) {
      return <div>
        <h2>Список задач пуст!</h2>
      </div>;
    } else {
      if (!this.state.isEditActive) {
        return (
          <div className={styles.container}>
            <h2>Список задач:</h2>
            {this.state.tasks.map((task, i) => {
              return (
                <div className={styles.taskContainer} key={i + `${task.description}`}>
                  <p> {i + 1}. {task.description}</p>
                  <button className={styles.submitBtn} onClick={() => this.switchEditState(i)}>Отредактировать</button>
                </div>
              );
            })}
          </div>
        );
      } else {
        return (
          <div>
            <TaskForm
              editMode={true}
              handleSubmit={this.handleSubmit}
              teachers={["Иванов И.И.", "Жуков Д.К.", "Петров И.И.", "Сидоров А.А."]}
              data={this.state.editedTask}
            />
          </div>
        );
      }

    }

  }


}
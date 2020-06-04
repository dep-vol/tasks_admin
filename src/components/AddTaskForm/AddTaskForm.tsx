import React, {Component} from "react";
import {FormSaveData} from "../../types";
import {TaskForm} from "../TaskForm/TaskForm";


type State = {
  tasks: FormSaveData [];
  isSaved: boolean;
}
type Props = {}

export class AddTaskForm extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      tasks: [],
      isSaved: false
    };
  }

  data: FormSaveData = {
    description: "",
    teachers: [],
    answers: []
  }

  componentDidMount() {
    const tasksFromStorage = localStorage.getItem("tasks");

    if (tasksFromStorage) {
      this.setState((prevState) => ({
        ...prevState, tasks: [...JSON.parse(tasksFromStorage)]
      }));
    } else {
      localStorage.setItem("tasks", JSON.stringify([]));
    }

  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.tasks !== prevState.tasks) {
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }

    if (this.state.isSaved) {
      this.setState(((prevState) => ({...prevState, isSaved: false})));
    }

  }


  handleSubmit = (event: React.FormEvent, data: FormSaveData) => {
    event.preventDefault();

    this.setState((prevState) => ({
      tasks: [...prevState.tasks, {...data}],
      isSaved: true
    }));

    console.log(data);

  }

  render() {

    return (
      <TaskForm
        editMode={false}
        handleSubmit={this.handleSubmit}
        teachers={["Иванов И.И.", "Жуков Д.К.", "Петров И.И.", "Сидоров А.А."]}
        data={this.data}
        isSaved={this.state.isSaved}
      />
    )
  }
}
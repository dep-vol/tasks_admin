import React from "react";
import {Route, Switch} from "react-router-dom";
import "./App.css";
import {AddTaskForm} from "./components/AddTaskForm/AddTaskForm";
import {EditTaskForm} from "./components/EditTaskForm/EditTaskForm";


export const App = () => {
  return (
    <div className="container">

      <Switch>
        <Route path="/" component={AddTaskForm} exact />
        <Route path="/edit" component={EditTaskForm} />
      </Switch>

    </div>
  );
};

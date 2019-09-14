import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const API = 'http://taskmaster-dev-leepj.us-west-2.elasticbeanstalk.com/api/v2';
let form = new FormData();

function App() {

  const [tasks, setTasks] = useState([]);

  function _getTasks() {
    fetch(API + '/tasks')
      .then(results => results.json())
      .then(tasks => setTasks(tasks));
    console.log('getting tasks')
  }

  function _handleChange(event) {
    let value = event.target.files ? event.target.files[0] : event.target.value;
    form.set(event.target.name, value);
  }

  function _handleSubmit(event) {
    event.preventDefault();
    fetch(API + '/tasks/' + event.target.id.value + '/images', {
      method: "POST",
      mode: 'no-cors',
      body: form,
    })
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log(response);
        _getTasks();
      })
  }

  useEffect(_getTasks, []);

  return (
    <div className="app">
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task, idx) => {
          return (
            <li key={idx}>
              <details open>
                <summary>
                  <strong>{task.title}</strong>
                </summary>
                <img src={task.imgURL} alt='img'></img>
                <p>Assigned To: {task.assignee}</p>
                <p>Task Description: {task.description}</p>
                <p>History</p>
                <History history={task.history} />
                <br></br>

                <form onSubmit={_handleSubmit} action={API + '/tasks/' + task.id + '/images'} method='POST' encType="multipart/form-data">
                  <span>Add Image: </span>
                  <input onChange={_handleChange} name="file" type="file" />
                  <br></br>
                  <button name='id' value={task.id}>submit</button>
                </form>



              </details>
              <br></br>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

function History(props) {
  return (
    <ol>
      {props.history.map((history, idx) => {
        return (
          <li key={idx}>
            <span>{history.timestamp}</span>
            <span>{history.action}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default App;


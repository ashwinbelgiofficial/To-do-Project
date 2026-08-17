import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/tasks/",
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks/",
        {
          title: title.trim()
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      setTasks((currentTasks) => [
        ...currentTasks,
        response.data
      ]);

      setTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/tasks/${task.id}/`,
        {
          is_completed: !task.is_completed
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id ? response.data : item
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/tasks/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const pendingTasks = tasks.filter(
    (task) => !task.is_completed
  );

  const completedTasks = tasks.filter(
    (task) => task.is_completed
  );

  return (
    <div className="dashboard">

      <div className="header">
        <div>
          <h1>Taskly</h1>
          <p>Your daily tasks</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <form
        className="task-form"
        onSubmit={addTask}
      >
        <input
          className="task-input"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="add-btn"
          type="submit"
        >
          +
        </button>
      </form>

      <div className="section">
        <h2 className="section-title">
          Today
        </h2>

        {pendingTasks.length === 0 ? (
          <p className="empty">
            No pending tasks yet.
          </p>
        ) : (
          pendingTasks.map((task) => (
            <div
              className="task"
              key={task.id}
            >
              <div
                className="task-content"
                onClick={() => toggleTask(task)}
              >
                <div className="task-circle"></div>

                <span className="task-title">
                  {task.title}
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h2 className="section-title">
          Completed
        </h2>

        {completedTasks.length === 0 ? (
          <p className="empty">
            No completed tasks yet.
          </p>
        ) : (
          completedTasks.map((task) => (
            <div
              className="task completed"
              key={task.id}
            >
              <div
                className="task-content"
                onClick={() => toggleTask(task)}
              >
                <div className="task-circle">
                  ✓
                </div>

                <span className="task-title">
                  {task.title}
                </span>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Dashboard;
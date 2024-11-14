import React, { useEffect, useState } from "react";

const baseURL = "https://playground.4geeks.com/todo";
const initialTask = {
    label: "",
    is_done: false
};

const Home = () => {
    const [task, setTask] = useState(initialTask);
    const [taskList, setTaskList] = useState([]);
    const [user, setUser] = useState("Jesus Bolivar");

    const handleSubmit = async (event) => {
        try {
            if (event.key === "Enter" && task.label.trim() !== "") {
                let response = await fetch(`${baseURL}/todos/${user}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(task)
                });
                setTask({ ...task, label: "" });
                getAllTasks();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event) => {
        setTask({
            ...task,
            label: event.target.value
        });
    };

    const getAllTasks = async () => {
        try {
            let response = await fetch(`${baseURL}/users/${user}`);
            let data;

            if (response.ok) {
                data = await response.json();
            } else {
                let newUser = "Jesus Bolivar";
                setUser(newUser);
                await fetch(`${baseURL}/users/${newUser}`, {
                    method: "POST"
                });
                let responseNew = await fetch(`${baseURL}/users/${newUser}`);
                data = await responseNew.json();
            }

            setTaskList(data.todos);

        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${baseURL}/todos/${id}`, {
                method: "DELETE"
            });
            getAllTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const clearAll = async () => {
        try {
            await fetch(`${baseURL}/todos/${user}`, {
                method: "DELETE"
            });
            setTaskList([]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { getAllTasks(); }, []);

    return (
        <>
            <h1 className="title">Task List</h1>

            <form className="task d-flex justify-content-center">
                <input 
                    className="w-75 h-100 border border-0 fs-3"
                    onKeyDown={handleSubmit}
                    onChange={handleChange}
                    value={task.label}
                    placeholder="Enter new task"
                />
            </form>

            {taskList.map((item) => (
                <div className="task d-flex align-items-center justify-content-between" key={item.id}>
                    <p className="fs-3">{item.label}</p>
                    <span>
                        <button
                            className="btn text-danger"
                            onClick={() => handleDelete(item.id)}
                        >
                            X
                        </button>
                    </span>
                </div>
            ))}

            <div className="d-flex justify-content-center footer-box">
                <div className="footer"></div>
                <div className="footer footer-2-size"></div>
                <div className="footer footer-3-size"></div>
            </div>
            <div className="d-flex justify-content-start">
                <button className="btn btn-danger" onClick={clearAll}>Delete all</button>
            </div>
        </>
    );
};

export default Home;

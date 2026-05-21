import { useState } from "react";

import { useNavigate } from "react-router-dom";


function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState("user");

    const [message, setMessage] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                // "http://127.0.0.1:8000/login",
                // "https://dude-subtly-motician.ngrok-free.dev/login",
                "https://complaint-sqlite-poc-3.onrender.com/login",
                
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password,
                        role
                    })
                }
            );

            const data = await response.json();
            

                if (response.ok) {

                setMessage("Login Successful");

                setLoginSuccess(true);

                // Store role
                localStorage.setItem(
            "role",
            data.role
            );

            // Store logged in user id
            localStorage.setItem(
            "user_id",
            data.user_id
            );

            // Optional
            localStorage.setItem(
            "username",
            data.username
        );
        } else {

                if (Array.isArray(data.detail)) {

                setMessage(data.detail[0].msg);

            } else {

             setMessage(data.detail);
            }
            }

        } catch (error) {

            console.log(error);

            setMessage("Server Error");
        }
    };


    const goToDashboard = () => {

        const savedRole =
            localStorage.getItem("role");

        if (savedRole === "admin") {

            navigate("/admin-dashboard");

        } else {

            navigate("/user-dashboard");
        }
    };


    return (

        <div style={{ padding: "30px" }}>

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <br /><br />

                <select
                    value={role}
                    onChange={(e) =>
                        setRole(e.target.value)
                    }
                >

                    <option value="user">

                        User

                    </option>

                    <option value="admin">

                        Admin

                    </option>

                </select>

                <br /><br />

                <button type="submit">

                    Login

                </button>

            </form>

            <br />

            <p>{message}</p>

            {
                loginSuccess && (

                    <button
                        onClick={goToDashboard}
                    >
                        Go To Dashboard
                    </button>
                )
            }

        </div>
    );
}

export default Login;
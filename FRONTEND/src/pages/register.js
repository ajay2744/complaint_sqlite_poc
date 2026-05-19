import { useState } from "react";

import { useNavigate }
from "react-router-dom";


function Register() {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [role, setRole] =
        useState("user");

    const [phone, setPhone] =
        useState("");

    const [city, setCity] =
        useState("");

    const [boutiqueName,
        setBoutiqueName] =
        useState("");

    const [boutiqueCode,
        setBoutiqueCode] =
        useState("");

    const [message, setMessage] =
        useState("");


    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/register",
                // "https://dude-subtly-motician.ngrok-free.dev/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        username,

                        password,

                        role,

                        phone,

                        city,

                        boutique_name:
                            boutiqueName,

                        boutique_code:
                            boutiqueCode
                    })
                }
            );

            const data =
                await response.json();

            console.log(data);

            if (response.ok) {

                setMessage(
                    "Registration Successful"
                );

                setTimeout(() => {

                    navigate("/login");

                }, 1500);

            } else {

                setMessage(data.detail);
            }

        } catch (error) {

            console.log(error);

            setMessage("Server Error");
        }
    };


    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}
        >

            <h1>

                Register

            </h1>

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) =>
                        setPhone(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) =>
                        setCity(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Boutique Name"
                    value={boutiqueName}
                    onChange={(e) =>
                        setBoutiqueName(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Boutique Code"
                    value={boutiqueCode}
                    onChange={(e) =>
                        setBoutiqueCode(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <select
                    value={role}
                    onChange={(e) =>
                        setRole(
                            e.target.value
                        )
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

                    Register

                </button>

            </form>

            <br />

            <p>{message}</p>

        </div>
    );
}

export default Register;
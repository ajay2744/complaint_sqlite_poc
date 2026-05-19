import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (

        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <h1>

                Complaint Management System

            </h1>

            <br />

            <div>

                <button
                    onClick={() =>
                        navigate("/login")
                    }
                    style={{
                        marginRight: "10px",
                        padding: "10px 20px"
                    }}
                >

                    Login

                </button>


                <button
                    onClick={() =>
                        navigate("/register")
                    }
                    style={{
                        padding: "10px 20px"
                    }}
                >

                    Register

                </button>

            </div>

        </div>
    );
}

export default Home;
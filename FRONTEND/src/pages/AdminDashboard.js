import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


function AdminDashboard() {

    const navigate = useNavigate();

    const [complaints, setComplaints] =
        useState([]);

    const [filteredComplaints,
        setFilteredComplaints] =
        useState([]);

    const username =
        localStorage.getItem("username");


    // Route protection
    useEffect(() => {

        const role =
            localStorage.getItem("role");

        if (!role) {

            navigate("/");
        }

    }, []);


    // Logout
    const handleLogout = () => {

        localStorage.removeItem(
            "username"
        );

        localStorage.removeItem(
            "user_id"
        );

        localStorage.removeItem(
            "role"
        );

        navigate("/");
    };


    // Fetch all complaints
    const fetchComplaints = () => {

        fetch(
            // "http://127.0.0.1:8000/complaints",

            // "https://dude-subtly-motician.ngrok-free.dev/complaints",
            "https://complaint-sqlite-poc-3.onrender.com/complaints"
        )
        .then(res => res.json())

        .then(data => {

            setComplaints(data);

            setFilteredComplaints(data);
        })

        .catch(error => {

            console.log(error);
        });
    };


    useEffect(() => {

        fetchComplaints();

    }, []);


    // Complaint counts
    const openCount =
        complaints.filter(
            c => c.status === "Open"
        ).length;


    const inProgressCount =
        complaints.filter(
            c => c.status === "In Progress"
        ).length;


    const closedCount =
        complaints.filter(
            c => c.status === "Closed"
        ).length;


    // Filters
    const showOpenComplaints = () => {

        const filtered =
            complaints.filter(
                c => c.status === "Open"
            );

        setFilteredComplaints(filtered);
    };


    const showInProgressComplaints =
        () => {

        const filtered =
            complaints.filter(
                c => c.status === "In Progress"
            );

        setFilteredComplaints(filtered);
    };


    const showClosedComplaints =
        () => {

        const filtered =
            complaints.filter(
                c => c.status === "Closed"
            );

        setFilteredComplaints(filtered);
    };


    const showAllComplaints =
        () => {

        setFilteredComplaints(
            complaints
        );
    };


    // Update complaint status
    const updateStatus = async (
        complaintId,
        status
    ) => {

        try {

            await fetch(

                // `http://127.0.0.1:8000/complaints/${complaintId}?status=${status}`,

                // "https://dude-subtly-motician.ngrok-free.dev/complaints/" + complaintId + "?status=" + status,

                "https://complaint-sqlite-poc-3.onrender.com/complaints/" + complaintId + "?status=" + status,

                {
                    method: "PUT"
                }
            );

            fetchComplaints();

        } catch (error) {

            console.log(error);
        }
    };


    return (

        <div style={{ padding: "30px" }}>

            <h1>

                Admin Dashboard

            </h1>

            <h3>

                Welcome {username}

            </h3>

            <button
                onClick={handleLogout}
            >

                Logout

            </button>

            <hr />

            <h2>

                Complaint Summary

            </h2>

            <button
                onClick={
                    showOpenComplaints
                }
            >

                Open Complaints:
                {" "}
                {openCount}

            </button>

            <br /><br />

            <button
                onClick={
                    showInProgressComplaints
                }
            >

                In Progress:
                {" "}
                {inProgressCount}

            </button>

            <br /><br />

            <button
                onClick={
                    showClosedComplaints
                }
            >

                Closed Complaints:
                {" "}
                {closedCount}

            </button>

            <br /><br />

            <button
                onClick={
                    showAllComplaints
                }
            >

                Show All

            </button>

            <hr />

            <h2>

                Manage Complaints

            </h2>

            {
                filteredComplaints.length === 0 ? (

                    <p>

                        No complaints found

                    </p>

                ) : (

                    filteredComplaints.map((c) => (

                        <div
                            key={c.complaint_id}

                            style={{
                                border:
                                    "1px solid black",

                                padding:
                                    "15px",

                                marginBottom:
                                    "15px"
                            }}
                        >

                            <h3>

                                Machine:
                                {" "}
                                {c.machine_name}

                            </h3>

                            <p>

                                <b>User:</b>
                                {" "}
                                {c.username}

                            </p>

                            <p>

                                <b>Boutique Name:</b>
                                {" "}
                                {c.boutique_name}

                            </p>

                            <p>

                                <b>City:</b>
                                {" "}
                                {c.city}

                            </p>

                            <p>

                                <b>Phone:</b>
                                {" "}
                                {c.phone}

                            </p>

                            <p>

                                <b>Description:</b>
                                {" "}
                                {c.description}

                            </p>

                            <p>

                                <b>Status:</b>
                                {" "}
                                {c.status}

                            </p>

                            <p>

                                <b>Complaint Time:</b>
                                {" "}

                                {
                                    c.complaint_time

                                    ?

                                    new Date(
                                        c.complaint_time
                                    ).toLocaleString(
                                        "en-IN",
                                        {
                                            timeZone:
                                                "Asia/Kolkata"
                                        }
                                    )

                                    :

                                    "N/A"
                                }

                            </p>

                            {
                                c.image_path && (

                                    <div>

                                        <img
                                            src={
                                                // `http://127.0.0.1:8000/uploads/${c.image_path}`

                                                // "https://dude-subtly-motician.ngrok-free.dev/uploads/" + c.image_path
                                                "https://complaint-sqlite-poc-3.onrender.com/uploads/" + c.image_path
                                            }

                                            alt="complaint"

                                            width="250"
                                        />

                                    </div>
                                )
                            }

                            <br />

                            <button
                                onClick={() =>
                                    updateStatus(
                                        c.complaint_id,
                                        "In Progress"
                                    )
                                }
                            >

                                In Progress

                            </button>

                            {" "}

                            <button
                                onClick={() =>
                                    updateStatus(
                                        c.complaint_id,
                                        "Closed"
                                    )
                                }
                            >

                                Closed

                            </button>

                        </div>
                    ))
                )
            }

        </div>
    );
}


export default AdminDashboard;
import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


function UserDashboard() {

    const navigate = useNavigate();

    const username =
        localStorage.getItem("username");

    const user_id =
        localStorage.getItem("user_id");


    const [complaints, setComplaints] =
        useState([]);

    const [filteredComplaints,
        setFilteredComplaints] =
        useState([]);

    const [machineName,
        setMachineName] =
        useState("");

    const [complaintDescription,
        setComplaintDescription] =
        useState("");

    const [file, setFile] =
        useState(null);


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


    // Fetch logged-in user complaints
    const fetchComplaints = () => {

        fetch(
            // `http://127.0.0.1:8000/complaints/user/${user_id}`

            // "https://dude-subtly-motician.ngrok-free.dev/complaints/user/" + user_id
            "https://complaint-sqlite-poc-3.onrender.com/complaints/user/" + user_id
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


    const showClosedComplaints = () => {

        const filtered =
            complaints.filter(
                c => c.status === "Closed"
            );

        setFilteredComplaints(filtered);
    };


    const showAllComplaints = () => {

        setFilteredComplaints(
            complaints
        );
    };


    // Create Complaint
    const handleComplaintSubmit =
        async (e) => {

        e.preventDefault();

        const formData =
            new FormData();

        formData.append(
            "machine_name",
            machineName
        );

        formData.append(
            "complaint_description",
            complaintDescription
        );

        formData.append(
            "user_id",
            user_id
        );

        // Optional file upload
        if (file) {

            formData.append(
                "file",
                file
            );
        }

        try {

            const response =
                await fetch(

                // "http://127.0.0.1:8000/complaints",

                "https://complaint-sqlite-poc-3.onrender.com/complaints",

                {
                    method: "POST",

                    body: formData
                }
            );

            const data =
                await response.json();

            console.log(data);

            // Refresh complaints
            fetchComplaints();

            // Clear form
            setMachineName("");

            setComplaintDescription("");

            setFile(null);

        } catch (error) {

            console.log(error);
        }
    };


    return (

        <div style={{ padding: "30px" }}>

            <h1>

                User Dashboard

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

                Create Complaint

            </h2>

            <form
                onSubmit={
                    handleComplaintSubmit
                }
            >

                <input
                    type="text"
                    placeholder="Machine Name"
                    value={machineName}
                    onChange={(e) =>
                        setMachineName(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <textarea
                    placeholder="Complaint Description"
                    value={complaintDescription}
                    onChange={(e) =>
                        setComplaintDescription(
                            e.target.value
                        )
                    }
                    required
                />

                <br /><br />

                <input
                    type="file"
                    onChange={(e) =>
                        setFile(
                            e.target.files[0]
                        )
                    }
                />

                <br /><br />

                <button type="submit">

                    Submit Complaint

                </button>

            </form>

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

                My Complaints

            </h2>

            {
                filteredComplaints.length === 0 ? (

                    <p>

                        No complaints found

                    </p>

                ) : (

                    filteredComplaints.map((c) => (

                        <div
                            key={
                                c.complaint_id
                            }

                            style={{
                                border:
                                    "1px solid black",

                                padding:
                                    "10px",

                                marginBottom:
                                    "10px"
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

                                <b>
                                    Complaint Description:
                                </b>
                                {" "}
                                {c.description}

                            </p>

                            <p>

                                <b>Status:</b>
                                {" "}
                                {c.status}

                            </p>

                            <p>

                                <b>
                                    Complaint Time:
                                </b>
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

                                            width="200"
                                        />

                                    </div>
                                )
                            }

                        </div>
                    ))
                )
            }

        </div>
    );
}


export default UserDashboard;
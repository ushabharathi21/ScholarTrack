const API = "http://localhost:8080/api";

let currentOperation = null;
let editingId = null;


/* ================= DATE ================= */

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


/* ================= NAVIGATION ================= */

document.querySelectorAll(".nav-item").forEach(item => {

    item.addEventListener("click", () => {

        const section = item.dataset.section;

        showSection(section);

        document.querySelectorAll(".nav-item")
            .forEach(nav => nav.classList.remove("active"));

        item.classList.add("active");

    });

});


function showSection(section) {

    document.querySelectorAll(".section")
        .forEach(s => s.classList.remove("active"));

    document.getElementById(section)
        .classList.add("active");


    const titles = {

        dashboard: [
            "Dashboard",
            "Overview of scholarship applications and eligibility"
        ],

        students: [
            "Students",
            "Manage registered students and academic information"
        ],

        schemes: [
            "Scholarship Schemes",
            "Manage scholarship eligibility criteria"
        ],

        applications: [
            "Applications",
            "Track scholarship eligibility and disbursement"
        ],

        verifications: [
            "Verifications",
            "Review and approve scholarship applications"
        ]

    };


    document.getElementById("pageTitle").textContent =
        titles[section][0];

    document.getElementById("pageDescription").textContent =
        titles[section][1];


    if (section === "dashboard")
        loadDashboard();

    if (section === "students")
        loadStudents();

    if (section === "schemes")
        loadSchemes();

    if (section === "applications")
        loadApplications();

    if (section === "verifications")
        loadVerifications();

}


/* ================= API ================= */

async function apiFetch(endpoint, options = {}) {

    const response = await fetch(API + endpoint, {

        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },

        ...options

    });


    if (!response.ok) {

        let message = `Server error: ${response.status}`;

        try {

            const data = await response.json();

            message =
                data.message ||
                data.error ||
                message;

        } catch (_) {}

        throw new Error(message);
    }


    if (response.status === 204)
        return null;


    return response.json();

}


/* ================= DASHBOARD ================= */

async function loadDashboard() {

    try {

        const [
            students,
            schemes,
            applications,
            verifications
        ] = await Promise.all([

            apiFetch("/students"),
            apiFetch("/schemes"),
            apiFetch("/applications"),
            apiFetch("/verifications")

        ]);


        document.getElementById("studentCount")
            .textContent = students.length;

        document.getElementById("schemeCount")
            .textContent = schemes.length;

        document.getElementById("applicationCount")
            .textContent = applications.length;

        document.getElementById("verificationCount")
            .textContent = verifications.length;


        renderRecentApplications(applications);

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");

    }

}


/* ================= RECENT APPLICATIONS ================= */

function renderRecentApplications(applications) {

    const container =
        document.getElementById("recentApplications");


    if (!applications.length) {

        container.innerHTML =
            `<div class="empty">No applications found.</div>`;

        return;

    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Disbursement</th>
                </tr>

            </thead>

            <tbody>

    `;


    applications.slice(-5).reverse()
        .forEach(application => {

            html += `

                <tr>

                    <td>
                        #${application.id}
                    </td>

                    <td>
                        ${application.student?.name || "-"}
                    </td>

                    <td>
                        ${statusBadge(application.status)}
                    </td>

                    <td>
                        ${statusBadge(
                application.disbursementStatus
            )}
                    </td>

                </tr>

            `;

        });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;

}


/* ================= STUDENTS ================= */

async function loadStudents() {

    const container =
        document.getElementById("studentsData");

    container.innerHTML =
        `<div class="loading">Loading students...</div>`;


    try {

        const students =
            await apiFetch("/students");


        let html = `

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Year</th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

        `;


        students.forEach(student => {

            html += `

                <tr>

                    <td>#${student.id}</td>

                    <td>
                        <strong>${student.name}</strong>
                    </td>

                    <td>${student.email}</td>

                    <td>${student.course}</td>

                    <td>Year ${student.year}</td>

                    <td>${student.marks}%</td>

                    <td>

                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick='editStudent(${JSON.stringify(student)})'>

                                ✎ Edit

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteStudent(${student.id})">

                                🗑 Delete

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>
            </table>
        `;


        container.innerHTML = html;

    } catch (error) {

        showError(container, error);

    }

}


/* ================= STUDENT MODAL ================= */

function openStudentModal(student = null) {

    editingId = student?.id || null;

    currentOperation = student
        ? "updateStudent"
        : "createStudent";


    document.getElementById("modalTitle").textContent =
        student ? "Edit Student" : "Add Student";

    document.getElementById("modalSubtitle").textContent =
        student
            ? "Update student information"
            : "Register a new student";


    document.getElementById("formFields").innerHTML = `

        <div class="field">
            <label>Full Name</label>
            <input
                name="name"
                required
                value="${student?.name || ""}">
        </div>

        <div class="field">
            <label>Email</label>
            <input
                type="email"
                name="email"
                required
                value="${student?.email || ""}">
        </div>

        <div class="field">
            <label>Phone</label>
            <input
                name="phone"
                required
                value="${student?.phone || ""}">
        </div>

        <div class="field">
            <label>Annual Income</label>
            <input
                type="number"
                name="income"
                min="0"
                required
                value="${student?.income || ""}">
        </div>

        <div class="field">
            <label>Marks</label>
            <input
                type="number"
                name="marks"
                min="0"
                max="100"
                required
                value="${student?.marks || ""}">
        </div>

        <div class="field">
            <label>Course</label>
            <input
                name="course"
                required
                value="${student?.course || ""}">
        </div>

        <div class="field">
            <label>Year</label>

            <select name="year" required>

                <option value="">Select Year</option>

                <option value="1"
                    ${student?.year == 1 ? "selected" : ""}>
                    Year 1
                </option>

                <option value="2"
                    ${student?.year == 2 ? "selected" : ""}>
                    Year 2
                </option>

                <option value="3"
                    ${student?.year == 3 ? "selected" : ""}>
                    Year 3
                </option>

                <option value="4"
                    ${student?.year == 4 ? "selected" : ""}>
                    Year 4
                </option>

            </select>

        </div>

    `;


    openModal();

}


function editStudent(student) {

    openStudentModal(student);

}


/* ================= SCHEMES ================= */

async function loadSchemes() {

    const container =
        document.getElementById("schemesData");

    container.innerHTML =
        `<div class="loading">Loading schemes...</div>`;


    try {

        const schemes =
            await apiFetch("/schemes");


        let html = `

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Scheme</th>
                        <th>Description</th>
                        <th>Max Income</th>
                        <th>Min Marks</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

        `;


        schemes.forEach(scheme => {

            html += `

                <tr>

                    <td>#${scheme.id}</td>

                    <td>
                        <strong>${scheme.name}</strong>
                    </td>

                    <td>${scheme.description}</td>

                    <td>
                        ₹${formatNumber(scheme.maxIncome)}
                    </td>

                    <td>${scheme.minimumMarks}%</td>

                    <td class="amount">
                        ₹${formatNumber(scheme.amount)}
                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick='editScheme(${JSON.stringify(scheme)})'>

                                ✎ Edit

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteScheme(${scheme.id})">

                                🗑 Delete

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>
            </table>
        `;


        container.innerHTML = html;

    } catch (error) {

        showError(container, error);

    }

}


function openSchemeModal(scheme = null) {

    editingId = scheme?.id || null;

    currentOperation = scheme
        ? "updateScheme"
        : "createScheme";


    document.getElementById("modalTitle").textContent =
        scheme ? "Edit Scholarship Scheme" :
            "Add Scholarship Scheme";


    document.getElementById("modalSubtitle").textContent =
        "Enter scholarship eligibility and amount";


    document.getElementById("formFields").innerHTML = `

        <div class="field full">
            <label>Scheme Name</label>

            <input
                name="name"
                required
                value="${scheme?.name || ""}">
        </div>


        <div class="field full">
            <label>Description</label>

            <textarea
                name="description"
                required>${scheme?.description || ""}</textarea>
        </div>


        <div class="field">
            <label>Maximum Income</label>

            <input
                type="number"
                name="maxIncome"
                min="0"
                required
                value="${scheme?.maxIncome || ""}">
        </div>


        <div class="field">
            <label>Minimum Marks</label>

            <input
                type="number"
                name="minimumMarks"
                min="0"
                max="100"
                required
                value="${scheme?.minimumMarks || ""}">
        </div>


        <div class="field">
            <label>Scholarship Amount</label>

            <input
                type="number"
                name="amount"
                min="0"
                required
                value="${scheme?.amount || ""}">
        </div>

    `;


    openModal();

}


function editScheme(scheme) {

    openSchemeModal(scheme);

}


/* ================= APPLICATIONS ================= */

async function loadApplications() {

    const container =
        document.getElementById("applicationsData");

    container.innerHTML =
        `<div class="loading">Loading applications...</div>`;


    try {

        const applications =
            await apiFetch("/applications");


        let html = `

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Scheme</th>
                        <th>Date</th>
                        <th>Eligibility</th>
                        <th>Disbursement</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

        `;


        applications.forEach(application => {

            html += `

                <tr>

                    <td>#${application.id}</td>

                    <td>
                        ${application.student?.name || "-"}
                    </td>

                    <td>
                        ${application.scheme?.name || "-"}
                    </td>

                    <td>
                        ${application.applicationDate || "-"}
                    </td>

                    <td>
                        ${statusBadge(application.status)}
                    </td>

                    <td>
                        ${statusBadge(
                application.disbursementStatus
            )}
                    </td>

                    <td>

                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick='editApplication(${JSON.stringify(application)})'>

                                ✎ Edit

                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteApplication(${application.id})">

                                🗑 Delete

                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>
            </table>
        `;


        container.innerHTML = html;

    } catch (error) {

        showError(container, error);

    }

}


function openApplicationModal(application = null) {

    editingId = application?.id || null;

    currentOperation = application
        ? "updateApplication"
        : "createApplication";


    document.getElementById("modalTitle").textContent =
        application
            ? "Edit Application"
            : "New Scholarship Application";


    document.getElementById("modalSubtitle").textContent =
        "Enter student and scholarship details";


    document.getElementById("formFields").innerHTML = `

        <div class="field">

            <label>Student ID</label>

            <input
                type="number"
                name="studentId"
                min="1"
                required
                value="${application?.student?.id || ""}">

        </div>


        <div class="field">

            <label>Scheme ID</label>

            <input
                type="number"
                name="schemeId"
                min="1"
                required
                value="${application?.scheme?.id || ""}">

        </div>


        <div class="field">

            <label>Application Date</label>

            <input
                type="date"
                name="applicationDate"
                required
                value="${application?.applicationDate || today()}">

        </div>


        <div class="field">

            <label>Disbursement Status</label>

            <select name="disbursementStatus">

                <option value="NOT_DISBURSED"
                    ${application?.disbursementStatus === "NOT_DISBURSED"
        ? "selected" : ""}>
                    NOT DISBURSED
                </option>

                <option value="COMPLETED"
                    ${application?.disbursementStatus === "COMPLETED"
        ? "selected" : ""}>
                    COMPLETED
                </option>

            </select>

        </div>


        <div class="field full">

            <label>Remarks</label>

            <textarea
                name="remarks">${application?.remarks || ""}</textarea>

        </div>

    `;


    openModal();

}


function editApplication(application) {

    openApplicationModal(application);

}


/* ================= VERIFICATIONS ================= */

async function loadVerifications() {

    const container =
        document.getElementById("verificationsData");

    container.innerHTML =
        `<div class="loading">Loading verifications...</div>`;


    try {

        const verifications =
            await apiFetch("/verifications");


        let html = `

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Application</th>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

        `;


        verifications.forEach(verification => {

            html += `

                <tr>

                    <td>#${verification.id}</td>

                    <td>
                        Application #${verification.application?.id || "-"}
                    </td>

                    <td>
                        ${verification.application?.student?.name || "-"}
                    </td>

                    <td>
                        ${statusBadge(verification.status)}
                    </td>

                    <td>
                        ${verification.remarks || "-"}
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick='editVerification(${JSON.stringify(verification)})'>

                            ✎ Edit

                        </button>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>
            </table>
        `;


        container.innerHTML = html;

    } catch (error) {

        showError(container, error);

    }

}


function openVerificationModal(verification = null) {

    editingId = verification?.id || null;

    currentOperation = verification
        ? "updateVerification"
        : "createVerification";


    document.getElementById("modalTitle").textContent =
        verification
            ? "Edit Verification"
            : "Add Verification";


    document.getElementById("modalSubtitle").textContent =
        "Review application verification status";


    document.getElementById("formFields").innerHTML = `

        <div class="field">

            <label>Application ID</label>

            <input
                type="number"
                name="applicationId"
                min="1"
                required
                value="${verification?.application?.id || ""}">

        </div>


        <div class="field">

            <label>Verification Status</label>

            <select name="status">

                <option value="PENDING"
                    ${verification?.status === "PENDING"
        ? "selected" : ""}>
                    PENDING
                </option>

                <option value="APPROVED"
                    ${verification?.status === "APPROVED"
        ? "selected" : ""}>
                    APPROVED
                </option>

            </select>

        </div>


        <div class="field full">

            <label>Verification Remarks</label>

            <textarea
                name="remarks"
                required>${verification?.remarks || ""}</textarea>

        </div>

    `;


    openModal();

}


function editVerification(verification) {

    openVerificationModal(verification);

}


/* ================= FORM SUBMIT ================= */

document.getElementById("modalForm")
    .addEventListener("submit", async event => {

        event.preventDefault();


        const form =
            new FormData(event.target);

        try {

            if (currentOperation === "createStudent" ||
                currentOperation === "updateStudent") {

                const data = {

                    name: form.get("name"),

                    email: form.get("email"),

                    phone: form.get("phone"),

                    income: Number(
                        form.get("income")
                    ),

                    marks: Number(
                        form.get("marks")
                    ),

                    course: form.get("course"),

                    year: Number(
                        form.get("year")
                    )

                };


                if (currentOperation === "createStudent") {

                    await apiFetch("/students", {

                        method: "POST",

                        body: JSON.stringify(data)

                    });

                    showToast(
                        "Student added successfully"
                    );

                } else {

                    await apiFetch(
                        `/students/${editingId}`,

                        {

                            method: "PUT",

                            body: JSON.stringify(data)

                        }

                    );

                    showToast(
                        "Student updated successfully"
                    );

                }


                closeModal();

                loadStudents();

                loadDashboard();

            }


            else if (
                currentOperation === "createScheme" ||
                currentOperation === "updateScheme"
            ) {

                const data = {

                    name: form.get("name"),

                    description:
                        form.get("description"),

                    maxIncome:
                        Number(form.get("maxIncome")),

                    minimumMarks:
                        Number(form.get("minimumMarks")),

                    amount:
                        Number(form.get("amount"))

                };


                if (currentOperation === "createScheme") {

                    await apiFetch("/schemes", {

                        method: "POST",

                        body: JSON.stringify(data)

                    });

                    showToast(
                        "Scholarship scheme added"
                    );

                } else {

                    await apiFetch(
                        `/schemes/${editingId}`,

                        {

                            method: "PUT",

                            body: JSON.stringify(data)

                        }

                    );

                    showToast(
                        "Scholarship scheme updated"
                    );

                }


                closeModal();

                loadSchemes();

                loadDashboard();

            }


            else if (
                currentOperation === "createApplication" ||
                currentOperation === "updateApplication"
            ) {

                const data = {

                    student: {

                        id: Number(
                            form.get("studentId")
                        )

                    },

                    scheme: {

                        id: Number(
                            form.get("schemeId")
                        )

                    },

                    applicationDate:
                        form.get("applicationDate"),

                    status:
                        currentOperation === "updateApplication"
                            ? form.get("status") || "ELIGIBLE"
                            : undefined,

                    disbursementStatus:
                        form.get("disbursementStatus"),

                    remarks:
                        form.get("remarks")

                };


                if (currentOperation === "createApplication") {

                    delete data.status;


                    await apiFetch(
                        "/applications",

                        {

                            method: "POST",

                            body: JSON.stringify(data)

                        }

                    );

                    showToast(
                        "Application created successfully"
                    );

                } else {

                    data.status =
                        "ELIGIBLE";


                    await apiFetch(
                        `/applications/${editingId}`,

                        {

                            method: "PUT",

                            body: JSON.stringify(data)

                        }

                    );

                    showToast(
                        "Application updated successfully"
                    );

                }


                closeModal();

                loadApplications();

                loadDashboard();

            }


            else if (
                currentOperation === "createVerification" ||
                currentOperation === "updateVerification"
            ) {

                const data = {

                    application: {

                        id: Number(
                            form.get("applicationId")
                        )

                    },

                    status:
                        form.get("status"),

                    remarks:
                        form.get("remarks")

                };


                if (
                    currentOperation ===
                    "createVerification"
                ) {

                    await apiFetch(
                        "/verifications",

                        {

                            method: "POST",

                            body: JSON.stringify(data)

                        }

                    );

                    showToast(
                        "Verification created successfully"
                    );

                } else {

                    await apiFetch(
                        `/verifications/${editingId}`,

                        {

                            method: "PUT",

                            body: JSON.stringify(data)

                        }

                    );

                    showToast(
                        "Verification updated successfully"
                    );

                }


                closeModal();

                loadVerifications();

                loadDashboard();

            }

        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        }

    });


/* ================= DELETE ================= */

async function deleteStudent(id) {

    if (!confirm(
        "Are you sure you want to delete this student?"
    )) return;


    try {

        await apiFetch(
            `/students/${id}`,

            {
                method: "DELETE"
            }

        );

        showToast(
            "Student deleted successfully"
        );

        loadStudents();
        loadDashboard();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


async function deleteScheme(id) {

    if (!confirm(
        "Are you sure you want to delete this scholarship scheme?"
    )) return;


    try {

        await apiFetch(
            `/schemes/${id}`,

            {
                method: "DELETE"
            }

        );

        showToast(
            "Scholarship scheme deleted"
        );

        loadSchemes();
        loadDashboard();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


async function deleteApplication(id) {

    if (!confirm(
        "Are you sure you want to delete this application?"
    )) return;


    try {

        await apiFetch(
            `/applications/${id}`,

            {
                method: "DELETE"
            }

        );

        showToast(
            "Application deleted successfully"
        );

        loadApplications();
        loadDashboard();

    } catch (error) {

        showToast(
            error.message,
            "error"
        );

    }

}


/* ================= MODAL ================= */

function openModal() {

    document.getElementById("modalOverlay")
        .classList.add("show");

}


function closeModal() {

    document.getElementById("modalOverlay")
        .classList.remove("show");

    document.getElementById("modalForm")
        .reset();

    currentOperation = null;
    editingId = null;

}


/* ================= HELPERS ================= */

function today() {

    return new Date()
        .toISOString()
        .split("T")[0];

}


function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString("en-IN");

}


function statusBadge(status) {

    if (!status)
        return "-";


    const value =
        status.toUpperCase();


    let className = "";


    if (
        value === "ELIGIBLE" ||
        value === "APPROVED"
    ) {

        className =
            value === "APPROVED"
                ? "approved"
                : "eligible";

    }


    else if (value === "PENDING") {

        className = "pending";

    }


    else if (value === "COMPLETED") {

        className = "completed";

    }


    else if (
        value === "ELIGIBILITY_FAILED"
    ) {

        className = "failed";

    }


    else if (
        value === "NOT_DISBURSED"
    ) {

        className = "pending";

    }


    return `
        <span class="status ${className}">
            ${value.replaceAll("_", " ")}
        </span>
    `;

}


function showError(container, error) {

    console.error(error);


    container.innerHTML = `

        <div class="error-box">

            Unable to load data.

            <br>

            <small>
                ${error.message}
            </small>

        </div>

    `;

}


function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    toast.className =
        `toast show ${type}`;


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ================= INITIAL LOAD ================= */

loadDashboard();
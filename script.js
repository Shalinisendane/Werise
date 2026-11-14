// ADMIN CREDENTIALS

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@123";


// STORAGE

function getUsers() {

    return JSON.parse(
        localStorage.getItem("users") || "[]"
    );

}

function getStudents() {

    return JSON.parse(
        localStorage.getItem("students") || "[]"
    );

}

function saveUsers(data) {

    localStorage.setItem(
        "users",
        JSON.stringify(data)
    );

}

function saveStudents(data) {

    localStorage.setItem(
        "students",
        JSON.stringify(data)
    );

}


let currentUser = null;


// SECTION NAVIGATION

function showSection(id) {

    document.querySelectorAll(".section")
    .forEach(section => {

        section.classList.remove("active");

    });

    document.getElementById(id)
    .classList.add("active");

    window.scrollTo(0,0);

}


// REGISTRATION

document.getElementById("registerForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const user = {

        name: document.getElementById("parentName").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        password: document.getElementById("password").value

    };

    let users = getUsers();

    if(users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {

        alert("Email already registered!");

        return;

    }

    users.push(user);

    saveUsers(users);

    currentUser = user;

    alert("Registration Successful!");

    this.reset();

    showSection("enrollment");

});


// USER LOGIN

document.getElementById("loginForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    let email = document.getElementById("loginEmail").value;

    let password = document.getElementById("loginPassword").value;

    let users = getUsers();

    let user = users.find(u =>

        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password

    );

    if(user) {

        currentUser = user;

        alert("Login Successful!");

        showSection("enrollment");

        document.getElementById("parentMobile").value =
            user.phone;

    }

    else {

        alert("Invalid Login Details!");

    }

});


// STUDENT ENROLLMENT

document.getElementById("enrollmentForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    if(!currentUser) {

        alert("Please Login First!");

        showSection("login");

        return;

    }

    const student = {

        childName: document.getElementById("childName").value,

        age: document.getElementById("age").value,

        className: document.getElementById("className").value,

        course: document.getElementById("course").value,

        city: document.getElementById("city").value,

        phone: document.getElementById("parentMobile").value,

        parentName: currentUser.name,

        email: currentUser.email,

        message: document.getElementById("message").value,

        date: new Date().toLocaleDateString("en-IN")

    };

    let students = getStudents();

    students.push(student);

    saveStudents(students);

    alert("Enrollment Successfully Submitted!");

    this.reset();

    showSection("home");

});


// ADMIN LOGIN

document.getElementById("adminForm")
.addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("adminEmail").value;

    const password = document.getElementById("adminPassword").value;

    if(
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {

        alert("Admin Login Successful!");

        this.reset();

        showSection("dashboard");

        loadDashboard();

    }

    else {

        alert("Invalid Admin ID or Password!");

    }

});


// ADMIN DASHBOARD

function loadDashboard() {

    let users = getUsers();

    let students = getStudents();

    document.getElementById("totalUsers").innerText =
        users.length;

    document.getElementById("totalStudents").innerText =
        students.length;


    // PARENT DATA

    let userHTML = "";

    users.forEach(user => {

        userHTML += `

        <tr>

            <td>${escapeHTML(user.name)}</td>

            <td>${escapeHTML(user.email)}</td>

            <td>
                <a href="https://wa.me/${user.phone.replace(/\D/g, '')}"
                   target="_blank">
                    ${escapeHTML(user.phone)}
                </a>
            </td>

        </tr>

        `;

    });

    document.getElementById("userTable").innerHTML =
        userHTML;


    // STUDENT DATA

    let studentHTML = "";

    students.forEach(student => {

        studentHTML += `

        <tr>

            <td>${escapeHTML(student.childName)}</td>

            <td>${escapeHTML(student.age)}</td>

            <td>${escapeHTML(student.className)}</td>

            <td>${escapeHTML(student.course)}</td>

            <td>${escapeHTML(student.city)}</td>

            <td>
                <a href="https://wa.me/${student.phone.replace(/\D/g, '')}"
                   target="_blank">
                    ${escapeHTML(student.phone)}
                </a>
            </td>

            <td>${escapeHTML(student.date)}</td>

        </tr>

        `;

    });

    document.getElementById("studentTable").innerHTML =
        studentHTML;

}


// SAFE HTML

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));

}


// EXCEL DOWNLOAD - PARENT REGISTRATION

function downloadUsers() {

    let users = getUsers();

    if(!users.length) {

        alert("No registration data!");

        return;

    }

    const data = users.map(u => ({

        "Parent Name": u.name,

        "Email": u.email,

        "WhatsApp": u.phone

    }));

    const sheet = XLSX.utils.json_to_sheet(data);

    const book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        book,
        sheet,
        "Registrations"
    );

    XLSX.writeFile(book, "Parent_Registration.xlsx");

}


// EXCEL DOWNLOAD - STUDENT ENROLLMENT

function downloadStudents() {

    let students = getStudents();

    if(!students.length) {

        alert("No enrollment data!");

        return;

    }

    const data = students.map(s => ({

        "Child Name": s.childName,

        "Age": s.age,

        "Class": s.className,

        "Course": s.course,

        "City": s.city,

        "Parent Name": s.parentName,

        "Parent Email": s.email,

        "WhatsApp": s.phone,

        "Message": s.message,

        "Enrollment Date": s.date

    }));

    const sheet = XLSX.utils.json_to_sheet(data);

    const book = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        book,
        sheet,
        "Student Enrollments"
    );

    XLSX.writeFile(book, "Student_Enrollment.xlsx");

}


// LOGOUT

function logout() {

    currentUser = null;

    alert("Logged Out Successfully!");

    showSection("home");

}
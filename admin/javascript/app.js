function load() {
    hideAll();
    if (getCookie("Admin") !== undefined && getCookie("Admin") !== "undefined") {
        home();
    } else {
        login();
    }
}

function home() {
    hideAll();
    hideHome();
    show("home");
    show("menu");
}

function pending() {
    hideAll();
    hideHome();
    show("home");
    show("pending");
    loadPending(getCookie("Admin"), (json) => {
        let pending = get("pending");
        clear(pending);
        let meetings = json.results;
        for (let m = 0; m < meetings.length; m++) {
            let currentMeeting = meetings[m];
            let meeting = document.createElement("div");
            let choosing = document.createElement("div");
            let datetime = document.createElement("p");
            let username = document.createElement("p");
            let typestatusphone = document.createElement("p");
            let reason = document.createElement("p");
            let approve = document.createElement("img");
            let decline = document.createElement("img");
            let minutes = currentMeeting.time.time % 60;
            let hours = (currentMeeting.time.time - minutes) / 60;
            meeting.classList.add("meeting");
            reason.classList.add("meetingContent");
            username.classList.add("meetingContent");
            reason.innerHTML = currentMeeting.content.reason;
            datetime.innerHTML = (currentMeeting.time.date.day + "." + currentMeeting.time.date.month + "." + currentMeeting.time.date.year) + " at " + (hours + ":" + (minutes < 10 ? "0" : "") + minutes);
            approve.src = "images/approved.svg";
            decline.src = "images/denied.svg";
            approve.onclick = () => {
                hideView(meeting);
                changeState(currentMeeting.id, "approved", getCookie("Admin"), (json) => {
                });
            };
            decline.onclick = () => {
                hideView(meeting);
                changeState(currentMeeting.id, "denied", getCookie("Admin"), (json) => {
                });
            };
            choosing.appendChild(approve);
            choosing.appendChild(decline);
            meeting.appendChild(reason);
            meeting.appendChild(username);
            meeting.appendChild(typestatusphone);
            meeting.appendChild(datetime);
            meeting.appendChild(choosing);
            pending.appendChild(meeting);
            loadUserInfo(currentMeeting.user, (user) => {
                username.innerHTML = user.user.name;
                let phone = document.createElement("a");
                phone.href = "tel:" + user.user.phone;
                phone.innerHTML = user.user.phone;
                typestatusphone.innerHTML = (user.user.type.substring(0, 1).toUpperCase() + user.user.type.substring(1).toLowerCase()) + (user.user.status === "vip" ? " VIP" : "") + ", " + phone.outerHTML;
            });
        }
    });
}

function calendar() {
    hideAll();
    hideHome();
    show("home");
    show("calendar");
}

function login() {
    hideAll();
    show("login");
}

function changeState(id, state, password, callback) {
    let body = new FormData;
    body.append("key", password);
    body.append("action", "set");
    body.append("set", "state");
    body.append("state", state);
    body.append("id", id);
    fetch("php/admin.php", {
        method: "POST",
        cache: "no-store",
        headers: {
            'Cache-Control': 'no-cache'
        },
        body: body
    }).then(response => {
        response.text().then((response) => {
            callback(JSON.parse(response));
        });
    });
}

function submitLogin() {
    let password = get("login-password");
    if (password.value.length > 0) {
        loadLogin(password.value, (json) => {
            if (json.auth) {
                setCookie("Admin", password.value);
            }
            refresh();
        });
    } else {
        alert("Password must be filled");
    }
}

function loadLogin(password, callback) {
    let body = new FormData;
    body.append("key", password);
    fetch("php/admin.php", {
        method: "POST",
        cache: "no-store",
        headers: {
            'Cache-Control': 'no-cache'
        },
        body: body
    }).then(response => {
        response.text().then((response) => {
            callback(JSON.parse(response));
        });
    });
}

function loadUserInfo(id, callback) {
    let body = new FormData;
    body.append("id", id);
    fetch("../php/base.php", {
        method: "POST",
        cache: "no-store",
        headers: {
            'Cache-Control': 'no-cache'
        },
        body: body
    }).then(response => {
        response.text().then((response) => {
            callback(JSON.parse(response));
        });
    });
}

function loadPending(password, callback) {
    let body = new FormData;
    body.append("key", password);
    body.append("action", "get");
    body.append("get", "pending");
    fetch("php/admin.php", {
        method: "POST",
        cache: "no-store",
        headers: {
            'Cache-Control': 'no-cache'
        },
        body: body
    }).then(response => {
        response.text().then((response) => {
            callback(JSON.parse(response));
        });
    });
}

function hideAll() {
    hide("login");
    hide("home");
}

function hideHome() {
    hide("pending");
    hide("calendar");
    hide("menu");
}
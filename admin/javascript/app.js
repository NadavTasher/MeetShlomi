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
    addDates();
}

function addDates() {
    loadDates(getCookie("Admin"), (json) => {
        let today = new Date(Date.now());
        today.setHours(0, 0, 0, 0);
        let day = get("day");
        clear(day);
        let dates = [];
        let jsonDates = json.dates;
        for (let d = 0; d < jsonDates.length; d++) {
            let currentDate = jsonDates[d];
            let date = new Date();
            date.setFullYear(currentDate.year);
            date.setMonth(currentDate.month - 1);
            date.setDate(currentDate.day);
            if (date >= today) {
                dates.push(date);
            }
        }
        dates = bubblesort(dates);
        for (let q = 0; q < dates.length; q++) {
            let option = document.createElement("option");
            let date = {day: dates[q].getDate(), month: dates[q].getMonth() + 1, year: dates[q].getFullYear()};
            option.value = JSON.stringify(date);
            option.innerHTML = getDayName(dates[q].getDay()) + ", " + getMonthName(dates[q].getMonth()) + " " + dates[q].getDate() + ", " + dates[q].getFullYear();
            day.appendChild(option);
        }
        dayChanged();
    });
}

function dayChanged() {
    let day = get("day");
    let queue = get("queue");
    clear(queue);
    loadMeetings(JSON.parse(day.value), (json) => {
        let meetings = json.results;
        for (let m = 0; m < meetings.length; m++) {
            let currentMeeting = meetings[m];
            let meeting = document.createElement("div");
            let datetime = document.createElement("p");
            let username = document.createElement("p");
            let typestatusphone = document.createElement("p");
            let reason = document.createElement("p");
            let minutes = currentMeeting.time.time % 60;
            let hours = (currentMeeting.time.time - minutes) / 60;
            meeting.classList.add("meeting");
            reason.classList.add("meetingContent");
            username.classList.add("meetingContent");
            reason.innerHTML = currentMeeting.content.reason;
            datetime.innerHTML = (currentMeeting.time.date.day + "." + currentMeeting.time.date.month + "." + currentMeeting.time.date.year) + " at " + (hours + ":" + (minutes < 10 ? "0" : "") + minutes);
            meeting.appendChild(reason);
            meeting.appendChild(username);
            meeting.appendChild(typestatusphone);
            meeting.appendChild(datetime);
            queue.appendChild(meeting);
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

function getDayName(day) {
    switch (day) {
        case 0:
            return "Sun";
        case 1:
            return "Mon";
        case 2:
            return "Tue";
        case 3:
            return "Wed";
        case 4:
            return "Thu";
        case 5:
            return "Fri";
        case 6:
            return "Sat";
        default:
            return "???";
    }
}

function getMonthName(month) {
    switch (month) {
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        case 11:
            return "Dec";
        default:
            return "???";
    }
}

function bubblesort(dates) {
    function bubble(dates) {
        let newDates = dates;
        if (dates.length > 1) {
            for (let d = 1; d < newDates.length; d++) {
                if (newDates[d] < newDates[d - 1]) {
                    let temp = newDates[d];
                    newDates[d] = newDates[d - 1];
                    newDates[d - 1] = temp;
                }
            }
        }
        return newDates;
    }

    let newDates = dates;
    while ((newDates = bubble(newDates)) !== newDates) {
    }
    return newDates;
}

function login() {
    hideAll();
    show("login");
}

function changeState(id, state, callback) {
    let body = new FormData;
    body.append("key", getCookie("Admin"));
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

function loadPending(callback) {
    let body = new FormData;
    body.append("key", getCookie("Admin"));
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

function loadDates(callback) {
    let body = new FormData;
    body.append("key", getCookie("Admin"));
    body.append("action", "get");
    body.append("get", "dates");
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

function loadMeetings(date, callback) {
    let body = new FormData;
    body.append("key", getCookie("Admin"));
    body.append("action", "get");
    body.append("get", "date");
    body.append("date", JSON.stringify(date));
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
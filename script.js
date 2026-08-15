/* =========================================================
   FITZONE GYM MANAGEMENT SYSTEM
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("FitZone JavaScript Loaded");


    /* =====================================================
       STORAGE HELPERS
       ===================================================== */

    function getData(key, defaultValue = []) {

        try {

            const data = localStorage.getItem(key);

            return data ? JSON.parse(data) : defaultValue;

        } catch (error) {

            console.error("Storage Error:", error);

            return defaultValue;
        }
    }


    function saveData(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        let toast =
            document.querySelector(".fitzone-toast");

        if (!toast) {

            toast = document.createElement("div");

            toast.className = "fitzone-toast";

            toast.style.position = "fixed";
            toast.style.bottom = "25px";
            toast.style.right = "25px";
            toast.style.zIndex = "99999";
            toast.style.background = "#111827";
            toast.style.color = "#fff";
            toast.style.padding = "12px 18px";
            toast.style.borderRadius = "10px";
            toast.style.fontSize = "14px";
            toast.style.boxShadow =
                "0 5px 20px rgba(0,0,0,.2)";

            document.body.appendChild(toast);
        }

        toast.textContent = message;

        clearTimeout(window.toastTimer);

        window.toastTimer = setTimeout(function () {

            if (toast) {
                toast.remove();
            }

        }, 2500);
    }


    /* =====================================================
       DARK / LIGHT MODE
       ===================================================== */

    const darkModeBtn =
        document.getElementById("darkModeBtn");


    function applyTheme() {

        const darkMode =
            localStorage.getItem(
                "fitzone_dark_mode"
            ) === "true";


        if (darkMode) {

            document.documentElement.classList.add(
                "dark-mode"
            );

            document.body.classList.add(
                "dark-mode"
            );

        } else {

            document.documentElement.classList.remove(
                "dark-mode"
            );

            document.body.classList.remove(
                "dark-mode"
            );
        }
    }


    applyTheme();


    if (darkModeBtn) {

        darkModeBtn.addEventListener(
            "click",
            function () {

                const enabled =
                    document.documentElement.classList.toggle(
                        "dark-mode"
                    );


                document.body.classList.toggle(
                    "dark-mode",
                    enabled
                );


                localStorage.setItem(
                    "fitzone_dark_mode",
                    enabled
                );


                showToast(
                    enabled
                        ? "Dark mode enabled"
                        : "Light mode enabled"
                );

            }
        );
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuBtn =
        document.querySelector(
            ".menu-btn, .hamburger, #menuBtn, .mobile-menu-btn"
        );


    const sidebar =
        document.querySelector(
            ".desktop-sidebar, .sidebar, .mobile-menu"
        );


    if (menuBtn && sidebar) {

        menuBtn.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("active");

                sidebar.classList.toggle("open");

            }
        );
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    document.querySelectorAll(
        ".logout-item, .logout-btn, #logoutBtn"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) return;


                localStorage.removeItem(
                    "fitzone_logged_in"
                );


                showToast(
                    "Logged out successfully"
                );


                setTimeout(function () {

                    window.location.href =
                        "login.html";

                }, 500);

            }
        );

    });


    /* =====================================================
       LOGIN
       ===================================================== */

    const loginForm =
        document.getElementById("loginForm") ||
        document.querySelector(".login-form");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const phoneInput =
                    document.getElementById(
                        "loginPhone"
                    ) ||
                    loginForm.querySelector(
                        'input[type="tel"]'
                    );


                const passwordInput =
                    document.getElementById(
                        "loginPassword"
                    ) ||
                    loginForm.querySelector(
                        'input[type="password"]'
                    );


                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";


                const password =
                    passwordInput
                        ? passwordInput.value.trim()
                        : "";


                if (
                    phone === "9876543210" &&
                    password === "123456"
                ) {

                    localStorage.setItem(
                        "fitzone_logged_in",
                        "true"
                    );


                    showToast(
                        "Login successful"
                    );


                    setTimeout(function () {

                        window.location.href =
                            "index.html";

                    }, 600);

                } else {

                    showToast(
                        "Invalid phone number or password"
                    );

                }

            }
        );
    }


    /* =====================================================
       MEMBERS STORAGE
       ===================================================== */

    let members =
        getData(
            "fitzone_members",
            []
        );


    /* =====================================================
       ADD MEMBER
       ===================================================== */

    const memberForm =
        document.getElementById(
            "memberForm"
        );


    if (memberForm) {

        memberForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "memberName"
                    )?.value.trim();


                const phone =
                    document.getElementById(
                        "memberPhone"
                    )?.value.trim();


                const age =
                    document.getElementById(
                        "memberAge"
                    )?.value;


                const gender =
                    document.getElementById(
                        "memberGender"
                    )?.value;


                const plan =
                    document.getElementById(
                        "membershipPlan"
                    )?.value;


                const startDate =
                    document.getElementById(
                        "startDate"
                    )?.value;

                const duration =
                    document.getElementById("duration")?.value;

                let expiryDate = "";

                if (startDate && duration) {

                    const date = new Date(startDate + "T00:00:00");

                    date.setMonth(
                        date.getMonth() + Number(duration)
                    );

                    expiryDate =
                        date.toISOString().split("T")[0];
                }


                const paymentStatus =
                    document.getElementById(
                        "paymentStatus"
                    )?.value || "Paid";


                if (!name) {

                    showToast(
                        "Please enter member name"
                    );

                    return;
                }


                if (!phone) {

                    showToast(
                        "Please enter phone number"
                    );

                    return;
                }


                if (!plan) {

                    showToast(
                        "Please select membership plan"
                    );

                    return;
                }


                const member = {

                    id: Date.now(),

                    name: name,

                    phone: phone,

                    age: age,

                    gender: gender,

                    plan: plan,

                    startDate: startDate,
                    expiryDate: expiryDate,
                    paymentStatus: paymentStatus,

                    createdAt:
                        new Date().toISOString()

                };


                members.push(member);


                saveData(
                    "fitzone_members",
                    members
                );


                showToast(
                    "Member added successfully!"
                );


                memberForm.reset();


                setTimeout(function () {

                    window.location.href =
                        "members.html";

                }, 700);

            }
        );
    }


    /* =====================================================
       MEMBERS PAGE
       ===================================================== */

    const membersContainer =
        document.querySelector(
            ".members-list, #membersList, .members-grid"
        );


    /*
       Current filter
       all / active / expired / due
    */

    let currentMemberFilter = "all";


    /*
       Search text
    */

    let currentMemberSearch = "";


    if (membersContainer) {

        renderMembers();

    }


    /* =====================================================
       MEMBER STATUS
       ===================================================== */

    function getMemberStatus(member) {

        const paymentStatus =
            String(
                member.paymentStatus || ""
            ).toLowerCase();


        if (
            paymentStatus === "expired"
        ) {

            return {
                text: "Expired",
                className: "expired"
            };

        }


        if (
            paymentStatus === "due" ||
            paymentStatus === "payment due" ||
            paymentStatus === "pending"
        ) {

            return {
                text: "Payment Due",
                className: "due"
            };

        }


        return {
            text: "Active",
            className: "active"
        };
    }


    /* =====================================================
       MEMBER INITIALS
       ===================================================== */

    function getInitials(name) {

        if (!name) return "M";


        const words =
            name
                .trim()
                .split(/\s+/);


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }


    /* =====================================================
       RENDER MEMBERS
       ===================================================== */

    function renderMembers() {

        if (!membersContainer) return;


        members =
            getData(
                "fitzone_members",
                []
            );


        let filteredMembers =
            [...members];


        /* SEARCH */

        if (currentMemberSearch) {

            filteredMembers =
                filteredMembers.filter(
                    function (member) {

                        const name =
                            String(
                                member.name || ""
                            ).toLowerCase();


                        const phone =
                            String(
                                member.phone || ""
                            ).toLowerCase();


                        const search =
                            currentMemberSearch
                                .toLowerCase();


                        return (
                            name.includes(search) ||
                            phone.includes(search)
                        );

                    }
                );
        }


        /* FILTER */

        if (
            currentMemberFilter !== "all"
        ) {

            filteredMembers =
                filteredMembers.filter(
                    function (member) {

                        const status =
                            getMemberStatus(
                                member
                            );


                        if (
                            currentMemberFilter ===
                            "active"
                        ) {

                            return (
                                status.className ===
                                "active"
                            );

                        }


                        if (
                            currentMemberFilter ===
                            "expired"
                        ) {

                            return (
                                status.className ===
                                "expired"
                            );

                        }


                        if (
                            currentMemberFilter ===
                            "due"
                        ) {

                            return (
                                status.className ===
                                "due"
                            );

                        }


                        return true;

                    }
                );
        }


        /* NO MEMBERS */

        if (!filteredMembers.length) {

            membersContainer.innerHTML = `

                <div class="empty-state">

                    <p>
                        No members found.
                    </p>

                </div>

            `;

            updateMemberCounts();

            return;
        }


        /* MEMBER CARDS */

        membersContainer.innerHTML =
            filteredMembers
                .map(function (member) {

                    const initials =
                        getInitials(
                            member.name
                        );


                    const status =
                        getMemberStatus(
                            member
                        );


                    return `

                        <article
                            class="full-member-card"
                        >

                            <div
                                class="member-avatar"
                            >
                                ${initials}
                            </div>


                            <div
                                class="full-member-info"
                            >

                                <h3>
                                    ${escapeHTML(
                        member.name
                    )}
                                </h3>


                                <p>
                                    📱
                                    ${escapeHTML(
                        member.phone
                    )}
                                </p>


                                <p>
                                    ${escapeHTML(
                        member.plan ||
                        "Membership Plan"
                    )}

                                    • Expires
                                    ${escapeHTML(
                        member.expiryDate ||
                        member.startDate ||
                        "N/A"
                    )}
                                </p>

                            </div>


                            <span
                                class="status ${status.className}"
                            >
                                ${status.text}
                            </span>


                            <button
                                type="button"
                                class="delete-member"
                                data-id="${member.id}"
                            >
                                Delete
                            </button>

                        </article>

                    `;

                })
                .join("");


        updateMemberCounts();

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       MEMBER COUNTS
       ===================================================== */

    function updateMemberCounts() {

        const allCount =
            document.getElementById(
                "allMembersCount"
            );


        const activeCount =
            document.getElementById(
                "activeMembersCount"
            );


        const expiredCount =
            document.getElementById(
                "expiredMembersCount"
            );


        const dueCount =
            document.getElementById(
                "dueMembersCount"
            );


        let active = 0;

        let expired = 0;

        let due = 0;


        members.forEach(
            function (member) {

                const status =
                    getMemberStatus(
                        member
                    );


                if (
                    status.className ===
                    "active"
                ) {

                    active++;

                }


                if (
                    status.className ===
                    "expired"
                ) {

                    expired++;

                }


                if (
                    status.className ===
                    "due"
                ) {

                    due++;

                }

            }
        );


        if (allCount) {

            allCount.textContent =
                members.length;

        }


        if (activeCount) {

            activeCount.textContent =
                active;

        }


        if (expiredCount) {

            expiredCount.textContent =
                expired;

        }


        if (dueCount) {

            dueCount.textContent =
                due;

        }
    }


    /* =====================================================
       DELETE MEMBER
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const deleteButton =
                event.target.closest(
                    ".delete-member"
                );


            if (!deleteButton) return;


            const id =
                Number(
                    deleteButton.dataset.id
                );


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this member?"
                );


            if (!confirmDelete) return;


            members =
                members.filter(
                    function (member) {

                        return (
                            Number(member.id) !==
                            id
                        );

                    }
                );


            saveData(
                "fitzone_members",
                members
            );


            showToast(
                "Member deleted successfully"
            );


            renderMembers();

        }
    );


    /* =====================================================
       MEMBER SEARCH
       ===================================================== */

    const memberSearch =
        document.querySelector(
            "#memberSearch, #searchMember, .member-search"
        );


    if (
        memberSearch &&
        membersContainer
    ) {

        memberSearch.addEventListener(
            "input",
            function () {

                currentMemberSearch =
                    this.value
                        .toLowerCase()
                        .trim();


                renderMembers();

            }
        );

    }


    /* =====================================================
       MEMBER FILTER BUTTONS
       ===================================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    const text =
                        this.textContent
                            .trim()
                            .toLowerCase();


                    if (text === "all") {

                        currentMemberFilter =
                            "all";

                    } else if (
                        text === "active"
                    ) {

                        currentMemberFilter =
                            "active";

                    } else if (
                        text === "expired"
                    ) {

                        currentMemberFilter =
                            "expired";

                    } else if (
                        text === "payment due"
                    ) {

                        currentMemberFilter =
                            "due";

                    }


                    renderMembers();

                }
            );

        }
    );


    /* =====================================================
   PAYMENTS
   ===================================================== */

    const paymentForm = document.getElementById("paymentForm");

    /* ---------- ADD PAYMENT PAGE ---------- */

    if (paymentForm) {

        const paymentMember = document.getElementById("paymentMember");

        /* Load members into dropdown */
        if (paymentMember) {

            const paymentMembers = getData(
                "fitzone_members",
                []
            );

            paymentMembers.forEach(function (member) {

                const option = document.createElement("option");

                option.value = member.id;

                option.textContent =
                    member.name + " - " + member.phone;

                paymentMember.appendChild(option);

            });
        }


        /* Set today's date automatically */

        const paymentDate =
            document.getElementById("paymentDate");

        if (paymentDate && !paymentDate.value) {

            paymentDate.value =
                new Date().toISOString().split("T")[0];

        }


        /* Save Payment */

        paymentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const memberId =
                    document.getElementById(
                        "paymentMember"
                    )?.value;

                const amount =
                    document.getElementById(
                        "paymentAmount"
                    )?.value;

                const date =
                    document.getElementById(
                        "paymentDate"
                    )?.value;

                const method =
                    document.getElementById(
                        "paymentMethod"
                    )?.value;

                const plan =
                    document.getElementById(
                        "paymentPlan"
                    )?.value;

                const status =
                    document.getElementById(
                        "paymentStatus"
                    )?.value || "Paid";

                const note =
                    document.getElementById(
                        "paymentNote"
                    )?.value.trim();


                if (!memberId) {

                    showToast(
                        "Please select member"
                    );

                    return;
                }


                if (!amount || Number(amount) <= 0) {

                    showToast(
                        "Please enter valid amount"
                    );

                    return;
                }


                const members =
                    getData(
                        "fitzone_members",
                        []
                    );


                const selectedMember =
                    members.find(
                        member =>
                            String(member.id) ===
                            String(memberId)
                    );


                if (!selectedMember) {

                    showToast(
                        "Member not found"
                    );

                    return;
                }


                const payments =
                    getData(
                        "fitzone_payments",
                        []
                    );


                const payment = {

                    id: Date.now(),

                    memberId:
                        selectedMember.id,

                    memberName:
                        selectedMember.name,

                    phone:
                        selectedMember.phone,

                    amount:
                        Number(amount),

                    date:
                        date || new Date()
                            .toISOString()
                            .split("T")[0],

                    method:
                        method || "Other",

                    plan:
                        plan ||
                        selectedMember.plan ||
                        "Membership",

                    status:
                        status,

                    note:
                        note,

                    createdAt:
                        new Date().toISOString()

                };


                payments.push(payment);


                saveData(
                    "fitzone_payments",
                    payments
                );


                showToast(
                    "Payment added successfully!"
                );


                paymentForm.reset();


                setTimeout(function () {

                    window.location.href =
                        "payments.html";

                }, 700);

            }
        );
    }


    /* ---------- PAYMENTS PAGE ---------- */

    const paymentList =
        document.querySelector(".payment-list");

    const pendingPaymentList =
        document.querySelector(
            ".pending-payment-list"
        );


    if (paymentList) {

        renderPayments();

    }


    function renderPayments() {

        const payments =
            getData(
                "fitzone_payments",
                []
            );


        /* ---------- SUMMARY ---------- */

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const currentMonth =
            new Date()
                .toISOString()
                .substring(0, 7);


        const todayPayments =
            payments.filter(
                payment =>
                    payment.date === today &&
                    payment.status === "Paid"
            );


        const monthPayments =
            payments.filter(function (payment) {

                if (!payment.date) {
                    return false;
                }

                return payment.date.substring(0, 7) === currentMonth &&
                    payment.status === "Paid";

            });


        const pendingPayments =
            payments.filter(
                payment =>
                    payment.status === "Pending"
            );


        const todayTotal =
            todayPayments.reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


        const monthTotal =
            monthPayments.reduce(function (total, payment) {

                return total + Number(payment.amount || 0);

            }, 0);


        const pendingTotal =
            pendingPayments.reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


        /* ---------- SUMMARY CARDS ---------- */

        const summaryCards =
            document.querySelectorAll(
                ".payment-summary-card"
            );


        if (summaryCards.length >= 3) {

            const todayHeading =
                summaryCards[0].querySelector("h3");

            const todayText =
                summaryCards[0].querySelector("span");

            const monthHeading =
                summaryCards[1].querySelector("h3");

            const monthText =
                summaryCards[1].querySelector("span");

            const pendingHeading =
                summaryCards[2].querySelector("h3");

            const pendingText =
                summaryCards[2].querySelector("span");


            if (todayHeading) {

                todayHeading.textContent =
                    "₹" +
                    todayTotal.toLocaleString("en-IN");

            }


            if (todayText) {

                todayText.textContent =
                    todayPayments.length +
                    " payments";

            }


            if (monthHeading) {

                monthHeading.textContent =
                    "₹" +
                    monthTotal.toLocaleString("en-IN");

            }


            if (monthText) {

                const monthName =
                    new Date().toLocaleString(
                        "en-IN",
                        {
                            month: "long",
                            year: "numeric"
                        }
                    );

                monthText.textContent =
                    monthName;

            }


            if (pendingHeading) {

                pendingHeading.textContent =
                    "₹" +
                    pendingTotal.toLocaleString("en-IN");

            }


            if (pendingText) {

                pendingText.textContent =
                    pendingPayments.length +
                    " members";

            }

        }


        /* ---------- RECENT PAYMENTS ---------- */

        const sortedPayments =
            [...payments].sort(
                function (a, b) {

                    return new Date(
                        b.createdAt || b.date || 0
                    ) -
                        new Date(
                            a.createdAt || a.date || 0
                        );

                }
            );


        if (!sortedPayments.length) {

            paymentList.innerHTML = `
            <div class="empty-state">
                <p>No payments found.</p>
            </div>
        `;

        } else {

            paymentList.innerHTML =
                sortedPayments
                    .map(function (payment) {

                        const name =
                            payment.memberName ||
                            "Member";


                        const initials =
                            name
                                .split(" ")
                                .map(
                                    word =>
                                        word.charAt(0)
                                )
                                .join("")
                                .substring(0, 2)
                                .toUpperCase();


                        const statusClass =
                            payment.status === "Pending"
                                ? "pending"
                                : "paid";


                        return `
                        <article class="payment-card">

                            <div class="payment-member-avatar">
                                ${initials}
                            </div>

                            <div class="payment-member-info">

                                <h3>
                                    ${name}
                                </h3>

                                <p>
                                    ${payment.plan || "Membership Plan"}
                                </p>

                                <small>
                                    ${formatPaymentDate(payment.date)}
                                </small>

                            </div>

                            <div class="payment-amount">

                                <strong>
                                    ₹${Number(payment.amount || 0).toLocaleString("en-IN")}
                                </strong>

                                <span class="payment-status ${statusClass}">
                                    ${payment.status || "Paid"}
                                </span>

                            </div>

                        </article>
                    `;

                    })
                    .join("");

        }


        /* ---------- PENDING PAYMENTS ---------- */

        if (pendingPaymentList) {

            if (!pendingPayments.length) {

                pendingPaymentList.innerHTML = `
                <div class="empty-state">
                    <p>No pending payments.</p>
                </div>
            `;

            } else {

                pendingPaymentList.innerHTML =
                    pendingPayments
                        .map(function (payment) {

                            const name =
                                payment.memberName ||
                                "Member";


                            const initials =
                                name
                                    .split(" ")
                                    .map(
                                        word =>
                                            word.charAt(0)
                                    )
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase();


                            return `
                            <article class="pending-payment-card">

                                <div class="payment-member-avatar">
                                    ${initials}
                                </div>

                                <div class="payment-member-info">

                                    <h3>
                                        ${name}
                                    </h3>

                                    <p>
                                        ${payment.plan || "Membership Plan"}
                                    </p>

                                </div>

                                <div class="pending-amount">

                                    <strong>
                                        ₹${Number(payment.amount || 0).toLocaleString("en-IN")}
                                    </strong>

                                    <button
                                        class="remind-payment"
                                        data-id="${payment.id}">
                                        Remind
                                    </button>

                                </div>

                            </article>
                        `;

                        })
                        .join("");

            }

        }

    }


    /* ---------- DATE FORMAT ---------- */

    function formatPaymentDate(date) {

        if (!date) {
            return "Date not available";
        }


        const paymentDate =
            new Date(date);


        if (isNaN(paymentDate.getTime())) {
            return date;
        }


        return paymentDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* ---------- PAYMENT SEARCH ---------- */

    const paymentSearch =
        document.querySelector(
            '.payment-search input'
        );


    if (paymentSearch && paymentList) {

        paymentSearch.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .toLowerCase()
                        .trim();


                const payments =
                    getData(
                        "fitzone_payments",
                        []
                    );


                const filtered =
                    payments.filter(
                        payment => {

                            const name =
                                (
                                    payment.memberName ||
                                    ""
                                ).toLowerCase();


                            return name.includes(search);

                        }
                    );


                if (!filtered.length) {

                    paymentList.innerHTML = `
                    <div class="empty-state">
                        <p>No payment found.</p>
                    </div>
                `;

                    return;
                }


                paymentList.innerHTML =
                    filtered.map(function (payment) {

                        const name =
                            payment.memberName ||
                            "Member";


                        const initials =
                            name
                                .split(" ")
                                .map(
                                    word =>
                                        word.charAt(0)
                                )
                                .join("")
                                .substring(0, 2)
                                .toUpperCase();


                        const statusClass =
                            payment.status === "Pending"
                                ? "pending"
                                : "paid";


                        return `
                        <article class="payment-card">

                            <div class="payment-member-avatar">
                                ${initials}
                            </div>

                            <div class="payment-member-info">

                                <h3>
                                    ${name}
                                </h3>

                                <p>
                                    ${payment.plan || "Membership Plan"}
                                </p>

                                <small>
                                    ${formatPaymentDate(payment.date)}
                                </small>

                            </div>

                            <div class="payment-amount">

                                <strong>
                                    ₹${Number(payment.amount || 0).toLocaleString("en-IN")}
                                </strong>

                                <span class="payment-status ${statusClass}">
                                    ${payment.status || "Paid"}
                                </span>

                            </div>

                        </article>
                    `;

                    }).join("");

            }
        );

    }


    /* ---------- PAYMENT FILTER ---------- */

    document.querySelectorAll(
        ".payment-filter-btn"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                document.querySelectorAll(
                    ".payment-filter-btn"
                ).forEach(function (btn) {

                    btn.classList.remove("active");

                });


                this.classList.add("active");


                const filter =
                    this.textContent
                        .trim()
                        .toLowerCase();


                const payments =
                    getData(
                        "fitzone_payments",
                        []
                    );


                let filtered =
                    payments;


                if (filter === "paid") {

                    filtered =
                        payments.filter(
                            payment =>
                                payment.status === "Paid"
                        );

                }


                if (filter === "pending") {

                    filtered =
                        payments.filter(
                            payment =>
                                payment.status === "Pending"
                        );

                }


                if (!filtered.length) {

                    paymentList.innerHTML = `
                    <div class="empty-state">
                        <p>No payments found.</p>
                    </div>
                `;

                    return;

                }


                paymentList.innerHTML =
                    filtered.map(function (payment) {

                        const name =
                            payment.memberName ||
                            "Member";


                        const initials =
                            name
                                .split(" ")
                                .map(
                                    word =>
                                        word.charAt(0)
                                )
                                .join("")
                                .substring(0, 2)
                                .toUpperCase();


                        return `
                        <article class="payment-card">

                            <div class="payment-member-avatar">
                                ${initials}
                            </div>

                            <div class="payment-member-info">

                                <h3>
                                    ${name}
                                </h3>

                                <p>
                                    ${payment.plan || "Membership Plan"}
                                </p>

                                <small>
                                    ${formatPaymentDate(payment.date)}
                                </small>

                            </div>

                            <div class="payment-amount">

                                <strong>
                                    ₹${Number(payment.amount || 0).toLocaleString("en-IN")}
                                </strong>

                                <span class="payment-status ${payment.status === "Pending"
                                ? "pending"
                                : "paid"
                            }">
                                    ${payment.status || "Paid"}
                                </span>

                            </div>

                        </article>
                    `;

                    }).join("");

            }
        );

    });


    /* ---------- VIEW ALL PAYMENTS ---------- */

    const viewAllPaymentsBtn =
        document.getElementById(
            "viewAllPaymentsBtn"
        );

    if (viewAllPaymentsBtn) {

        viewAllPaymentsBtn.addEventListener(
            "click",
            function () {

                const payments =
                    getData(
                        "fitzone_payments",
                        []
                    );

                if (!payments.length) {

                    showToast(
                        "No payments available"
                    );

                    return;
                }

                paymentList.innerHTML =
                    payments
                        .sort(function (a, b) {

                            return new Date(
                                b.createdAt || b.date || 0
                            ) -
                                new Date(
                                    a.createdAt || a.date || 0
                                );

                        })
                        .map(function (payment) {

                            const name =
                                payment.memberName ||
                                "Member";

                            const initials =
                                name
                                    .split(" ")
                                    .map(
                                        word =>
                                            word.charAt(0)
                                    )
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase();

                            return `
                            <article class="payment-card">

                                <div class="payment-member-avatar">
                                    ${initials}
                                </div>

                                <div class="payment-member-info">

                                    <h3>
                                        ${name}
                                    </h3>

                                    <p>
                                        ${payment.plan || "Membership Plan"}
                                    </p>

                                    <small>
                                        ${formatPaymentDate(payment.date)}
                                    </small>

                                </div>

                                <div class="payment-amount">

                                    <strong>
                                        ₹${Number(payment.amount || 0).toLocaleString("en-IN")}
                                    </strong>

                                    <span class="payment-status ${payment.status === "Pending"
                                    ? "pending"
                                    : "paid"
                                }">
                                        ${payment.status || "Paid"}
                                    </span>

                                </div>

                            </article>
                        `;

                        })
                        .join("");

                showToast(
                    "Showing all payments"
                );

            }
        );

    }


    /* ---------- REMIND BUTTON ---------- */

    document.addEventListener(
        "click",
        function (event) {

            const remindButton =
                event.target.closest(
                    ".remind-payment"
                );


            if (!remindButton) {
                return;
            }


            showToast(
                "Payment reminder sent!"
            );

        }
    );

    /* ---------- ATTENDANCE ---------- */

    const attendanceList = document.querySelector(".attendance-list");
    const attendanceSearch = document.querySelector(
        ".attendance-search input"
    );
    const markAllBtn = document.querySelector(".mark-all-btn");

    if (attendanceList) {

        // Members ko localStorage se lena
        let attendanceMembers = [];

        try {
            attendanceMembers =
                JSON.parse(localStorage.getItem("fitzone_members")) || [];
        } catch (error) {
            attendanceMembers = [];
        }


        // Agar tumhare members kisi aur key mein save hain
        if (!attendanceMembers.length) {
            try {
                attendanceMembers =
                    JSON.parse(localStorage.getItem("members")) || [];
            } catch (error) {
                attendanceMembers = [];
            }
        }


        const today = new Date()
            .toISOString()
            .split("T")[0];

        const attendanceKey =
            "fitzone_attendance_" + today;


        let todayAttendance = {};

        try {
            todayAttendance =
                JSON.parse(localStorage.getItem(attendanceKey)) || {};
        } catch (error) {
            todayAttendance = {};
        }


        /* ---------- SAVE ATTENDANCE ---------- */

        function saveAttendance() {

            localStorage.setItem(
                attendanceKey,
                JSON.stringify(todayAttendance)
            );

        }


        /* ---------- UPDATE SUMMARY ---------- */

        function updateAttendanceSummary() {

            const totalMembers =
                attendanceMembers.length;

            let presentCount = 0;

            attendanceMembers.forEach(function (member) {

                const memberId =
                    member.id ||
                    member.phone ||
                    member.name;

                if (todayAttendance[memberId] === "present") {
                    presentCount++;
                }

            });


            const absentCount =
                Math.max(totalMembers - presentCount, 0);


            const mainAttendance =
                document.querySelector(
                    ".attendance-main-card h3"
                );

            const totalElement =
                document.querySelector(
                    ".attendance-small-card:nth-child(2) strong"
                );

            const absentElement =
                document.querySelector(
                    ".attendance-small-card:nth-child(3) strong"
                );


            if (mainAttendance) {
                mainAttendance.textContent =
                    presentCount;
            }

            if (totalElement) {
                totalElement.textContent =
                    totalMembers;
            }

            if (absentElement) {
                absentElement.textContent =
                    absentCount;
            }

        }


        /* ---------- RENDER MEMBERS ---------- */

        function renderAttendanceMembers(
            members = attendanceMembers
        ) {

            if (!members.length) {

                attendanceList.innerHTML = `
                <div class="empty-state">
                    <p>No members found.</p>
                </div>
            `;

                updateAttendanceSummary();
                return;
            }


            attendanceList.innerHTML =
                members.map(function (member) {

                    const name =
                        member.name || "Member";

                    const initials =
                        name
                            .split(" ")
                            .map(function (word) {
                                return word.charAt(0);
                            })
                            .join("")
                            .substring(0, 2)
                            .toUpperCase();


                    const memberId =
                        member.id ||
                        member.phone ||
                        member.name;


                    const status =
                        todayAttendance[memberId] ||
                        "absent";


                    const buttonClass =
                        status === "present"
                            ? "present"
                            : "absent";


                    const buttonText =
                        status === "present"
                            ? "✓ Present"
                            : "Absent";


                    return `
                    <article
                        class="attendance-member"
                        data-member-id="${memberId}"
                    >

                        <div class="attendance-avatar">
                            ${initials}
                        </div>

                        <div class="attendance-member-info">

                            <h3>
                                ${name}
                            </h3>

                            <p>
                                ${member.plan || "Membership Plan"}
                            </p>

                        </div>

                        <button
                            class="attendance-status ${buttonClass}"
                            type="button"
                        >
                            ${buttonText}
                        </button>

                    </article>
                `;

                }).join("");


            updateAttendanceSummary();

        }


        /* ---------- PRESENT / ABSENT BUTTON ---------- */

        attendanceList.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".attendance-status"
                    );

                if (!button) {
                    return;
                }


                const card =
                    button.closest(
                        ".attendance-member"
                    );

                if (!card) {
                    return;
                }


                const memberId =
                    card.dataset.memberId;


                if (
                    todayAttendance[memberId] ===
                    "present"
                ) {

                    todayAttendance[memberId] =
                        "absent";

                } else {

                    todayAttendance[memberId] =
                        "present";

                }


                saveAttendance();

                renderAttendanceMembers();

            }
        );


        /* ---------- MARK ALL PRESENT ---------- */

        if (markAllBtn) {

            markAllBtn.addEventListener(
                "click",
                function () {

                    attendanceMembers.forEach(
                        function (member) {

                            const memberId =
                                member.id ||
                                member.phone ||
                                member.name;

                            todayAttendance[memberId] =
                                "present";

                        }
                    );


                    saveAttendance();

                    renderAttendanceMembers();

                }
            );

        }

        /* ---------- TODAY'S ATTENDANCE DATE ---------- */

        const attendanceDate = document.getElementById("attendanceDate");

        if (attendanceDate) {
            const today = new Date();

            attendanceDate.textContent = today.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }


        /* ---------- SEARCH MEMBER ---------- */

        if (attendanceSearch) {

            attendanceSearch.addEventListener(
                "input",
                function () {

                    const searchText =
                        attendanceSearch.value
                            .toLowerCase()
                            .trim();


                    const filteredMembers =
                        attendanceMembers.filter(
                            function (member) {

                                const name =
                                    (
                                        member.name || ""
                                    ).toLowerCase();

                                const phone =
                                    (
                                        member.phone || ""
                                    ).toString();


                                return (
                                    name.includes(searchText) ||
                                    phone.includes(searchText)
                                );

                            }
                        );


                    renderAttendanceMembers(
                        filteredMembers
                    );

                }
            );

        }


        // First load
        renderAttendanceMembers();

    }


    /* =====================================================
       SETTINGS - NOTIFICATIONS
       ===================================================== */

    const notificationToggle =
        document.querySelector(
            'input[name="notifications"]'
        );


    if (notificationToggle) {

        notificationToggle.checked =
            localStorage.getItem(
                "fitzone_notifications"
            ) !== "false";


        notificationToggle.addEventListener(
            "change",
            function () {

                localStorage.setItem(
                    "fitzone_notifications",
                    this.checked
                );

            }
        );

    }


    /* =====================================================
       EXPIRY REMINDER
       ===================================================== */

    const reminderToggle =
        document.querySelector(
            'input[name="expiryReminders"]'
        );


    if (reminderToggle) {

        reminderToggle.checked =
            localStorage.getItem(
                "fitzone_expiry_reminders"
            ) !== "false";


        reminderToggle.addEventListener(
            "change",
            function () {

                localStorage.setItem(
                    "fitzone_expiry_reminders",
                    this.checked
                );

            }
        );

    }


    /* =====================================================
       EXPORT DATA
       ===================================================== */

    const exportButton =
        document.querySelector(
            "#exportDataBtn, .export-btn"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            function () {

                const backup = {

                    members:
                        getData(
                            "fitzone_members",
                            []
                        ),

                    payments:
                        getData(
                            "fitzone_payments",
                            []
                        ),

                    attendance:
                        getData(
                            "fitzone_attendance",
                            []
                        ),

                    exportedAt:
                        new Date().toISOString()

                };


                const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                backup,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                                "application/json"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href = url;


                link.download =
                    "fitzone-backup.json";


                link.click();


                URL.revokeObjectURL(
                    url
                );


                showToast(
                    "Data exported successfully"
                );

            }
        );
    }


    /* =====================================================
       CLEAR DATA
       ===================================================== */

    const clearButton =
        document.querySelector(
            "#clearDataBtn, .clear-btn"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                const confirmClear =
                    confirm(
                        "Are you sure? All FitZone data will be deleted."
                    );


                if (!confirmClear) return;


                localStorage.removeItem(
                    "fitzone_members"
                );


                localStorage.removeItem(
                    "fitzone_payments"
                );


                localStorage.removeItem(
                    "fitzone_attendance"
                );


                showToast(
                    "All data cleared"
                );


                setTimeout(
                    function () {

                        location.reload();

                    },
                    700
                );

            }
        );

    }


    /* =====================================================
       FAQ / HELP ACCORDION
       ===================================================== */

    document.querySelectorAll(
        ".faq-question, .accordion-header"
    ).forEach(
        function (question) {

            question.addEventListener(
                "click",
                function () {

                    const answer =
                        this.nextElementSibling;


                    if (!answer) return;


                    answer.classList.toggle(
                        "active"
                    );


                    if (
                        answer.style.display ===
                        "block"
                    ) {

                        answer.style.display =
                            "none";

                    } else {

                        answer.style.display =
                            "block";

                    }

                }
            );

        }
    );


    /* =====================================================
       SAVE SETTINGS
       ===================================================== */

    const settingsForm =
        document.querySelector(
            "#settingsForm"
        );


    if (settingsForm) {

        settingsForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                showToast(
                    "Settings saved successfully"
                );

            }
        );

    }


    /* =====================================================
       DASHBOARD MEMBER COUNT
       ===================================================== */

    const totalMembers =
        document.querySelector(
            "#totalMembers"
        );


    if (totalMembers) {

        totalMembers.textContent =
            members.length;

    }


    /* =====================================================
   DASHBOARD / HOME PAGE
   ===================================================== */

    const dashboardPage = document.querySelector(".stats-section");

    if (dashboardPage) {

        const dashboardMembers = getData(
            "fitzone_members",
            []
        );

        const dashboardPayments = getData(
            "fitzone_payments",
            []
        );

        /* ---------- TOTAL MEMBERS ---------- */

        const totalMembersElement =
            document.getElementById("totalMembers");

        if (totalMembersElement) {
            totalMembersElement.textContent =
                dashboardMembers.length;
        }


        /* ---------- ACTIVE / EXPIRED MEMBERS ---------- */

        let activeCount = 0;
        let expiredCount = 0;

        dashboardMembers.forEach(function (member) {

            /*
             * New members are active by default.
             * Only a member explicitly marked as expired
             * will be counted as expired.
             */

            if (
                member.status &&
                member.status.toLowerCase() === "expired"
            ) {

                expiredCount++;

            } else {

                activeCount++;

            }

        });


        const activeMembersElement =
            document.getElementById("activeMembers");

        if (activeMembersElement) {
            activeMembersElement.textContent =
                activeCount;
        }


        const expiredMembersElement =
            document.getElementById("expiredMembers");

        if (expiredMembersElement) {
            expiredMembersElement.textContent =
                expiredCount;
        }




        const activePercentage =
            document.getElementById("activePercentage");

        if (activePercentage) {

            let percentage = 0;

            if (dashboardMembers.length > 0) {
                percentage =
                    Math.round(
                        (activeCount / dashboardMembers.length) * 100
                    );
            }

            activePercentage.textContent =
                percentage + "% active";
        }

        /* ---------- PAYMENT DUE ---------- */

        let paymentDue = 0;

        dashboardMembers.forEach(function (member) {

            if (
                member.paymentStatus &&
                member.paymentStatus.toLowerCase() === "due"
            ) {

                /*
                 * If member has a due amount,
                 * use it. Otherwise count only.
                 */

                if (member.dueAmount) {
                    paymentDue +=
                        Number(member.dueAmount) || 0;
                }

            }

        });


        const paymentDueElement =
            document.getElementById("paymentDue");

        if (paymentDueElement) {

            paymentDueElement.textContent =
                "₹" + paymentDue.toLocaleString("en-IN");

        }


        /* ---------- RECENT MEMBERS ---------- */

        const recentMembersContainer =
            document.querySelector(".recent-members");

        if (
            recentMembersContainer &&
            dashboardMembers.length
        ) {

            const recentMembers =
                [...dashboardMembers]
                    .sort(function (a, b) {

                        return (
                            new Date(b.createdAt || 0) -
                            new Date(a.createdAt || 0)
                        );

                    })
                    .slice(0, 3);


            recentMembersContainer.innerHTML =
                recentMembers.map(function (member) {

                    const name =
                        member.name || "Member";

                    const initials =
                        name
                            .split(" ")
                            .map(word => word.charAt(0))
                            .join("")
                            .substring(0, 2)
                            .toUpperCase();

                    return `
                    <article class="recent-member">

                        <div class="member-avatar">
                            ${initials}
                        </div>

                        <div class="member-info">

                            <h3>
                                ${name}
                            </h3>

                            <p>
                                ${member.plan || "Membership Plan"}
                            </p>

                        </div>

                        <span class="status ${(member.status || "Active").toLowerCase() === "expired"
                            ? "expired"
                            : "active"
                        }">
                        ${member.status || "Active"}
                        </span>
                    </article>
                `;

                }).join("");

        }


        /* ---------- EXPIRING SOON ---------- */

        const expiryContainer =
            document.querySelector(".expiry-list");

        if (
            expiryContainer &&
            dashboardMembers.length
        ) {

            const expiringMembers =
                dashboardMembers.filter(function (member) {

                    if (!member.expiryDate) {
                        return false;
                    }

                    const expiryDate =
                        new Date(member.expiryDate);

                    const difference =
                        expiryDate - new Date();

                    const days =
                        difference /
                        (1000 * 60 * 60 * 24);

                    return days >= 0 && days <= 7;

                }).slice(0, 5);


            if (expiringMembers.length) {

                expiryContainer.innerHTML =
                    expiringMembers.map(function (member) {

                        const name =
                            member.name || "Member";

                        const initials =
                            name
                                .split(" ")
                                .map(word => word.charAt(0))
                                .join("")
                                .substring(0, 2)
                                .toUpperCase();

                        return `
                        <article class="member-card">

                            <div class="member-avatar">
                                ${initials}
                            </div>

                            <div class="member-info">

                                <h3>
                                    ${name}
                                </h3>

                                <p>
                                     ${(() => {
                                const expiryDate = new Date(member.expiryDate);
                                const difference = expiryDate - new Date();
                                const days = Math.ceil(
                                    difference / (1000 * 60 * 60 * 24)
                                );

                                if (days === 0) {
                                    return "Expires today";
                                }

                                if (days === 1) {
                                    return "Expires tomorrow";
                                }

                                return `Expires in ${days} days`;
                            })()}
                                </p>

                            </div>

                            <button
                                class="contact-btn"
                                onclick="window.location.href='members.html'">
                                View
                            </button>

                        </article>
                    `;

                    }).join("");

            }

        }

    }

    /* ================= MEMBERSHIP PLANS ================= */

    const planForm = document.querySelector(".plan-form");
    const plansContainer = document.querySelector(".plans-list");


    /* ---------- GET PLANS ---------- */

    function getPlans() {

        try {

            return JSON.parse(
                localStorage.getItem("fitzonePlans") || "[]"
            );

        } catch (error) {

            return [];

        }
    }


    /* ---------- SAVE PLANS ---------- */

    function savePlans(plans) {

        localStorage.setItem(
            "fitzonePlans",
            JSON.stringify(plans)
        );

    }


    /* =====================================================
       ADD / EDIT PLAN
       ===================================================== */

    if (planForm) {

        const urlParams =
            new URLSearchParams(window.location.search);

        const editId =
            urlParams.get("edit");


        let editingPlan = null;


        /* ---------- CHECK EDIT MODE ---------- */

        if (editId) {

            const plans = getPlans();

            editingPlan =
                plans.find(
                    plan =>
                        String(plan.id) ===
                        String(editId)
                );


            if (editingPlan) {

                document.querySelector(
                    ".welcome-section h2"
                ).textContent = "Edit Plan";


                document.querySelector(
                    ".welcome-text"
                ).textContent =
                    "Update membership plan details.";


                document.getElementById(
                    "planName"
                ).value =
                    editingPlan.name || "";


                document.getElementById(
                    "planDuration"
                ).value =
                    editingPlan.duration || "";


                document.getElementById(
                    "planPrice"
                ).value =
                    editingPlan.price || "";


                document.getElementById(
                    "planDescription"
                ).value =
                    editingPlan.description || "";


                document.getElementById(
                    "planStatus"
                ).value =
                    editingPlan.status || "Active";


                const saveButton =
                    document.querySelector(
                        ".save-plan-btn"
                    );


                if (saveButton) {

                    saveButton.textContent =
                        "Update Plan";

                }

            }

        }


        /* ---------- FORM SUBMIT ---------- */

        planForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const planName =
                    document.getElementById(
                        "planName"
                    ).value.trim();


                const planDuration =
                    document.getElementById(
                        "planDuration"
                    ).value;


                const planPrice =
                    document.getElementById(
                        "planPrice"
                    ).value;


                const planDescription =
                    document.getElementById(
                        "planDescription"
                    ).value.trim();


                const planStatus =
                    document.getElementById(
                        "planStatus"
                    ).value;


                if (
                    !planName ||
                    !planDuration ||
                    !planPrice
                ) {

                    showToast(
                        "Please fill all required fields."
                    );

                    return;

                }


                const plans = getPlans();


                /* ---------- EDIT ---------- */

                if (editingPlan) {

                    const index =
                        plans.findIndex(
                            plan =>
                                String(plan.id) ===
                                String(editId)
                        );


                    if (index !== -1) {

                        plans[index] = {

                            ...plans[index],

                            name:
                                planName,

                            duration:
                                planDuration,

                            price:
                                Number(planPrice),

                            description:
                                planDescription,

                            status:
                                planStatus

                        };

                    }


                    savePlans(plans);


                    showToast(
                        "Plan updated successfully!"
                    );

                }


                /* ---------- ADD ---------- */

                else {

                    const newPlan = {

                        id:
                            Date.now(),

                        name:
                            planName,

                        duration:
                            planDuration,

                        price:
                            Number(planPrice),

                        description:
                            planDescription,

                        status:
                            planStatus,

                        members:
                            0

                    };


                    plans.push(newPlan);


                    savePlans(plans);


                    showToast(
                        "Plan added successfully!"
                    );

                }


                setTimeout(
                    function () {

                        window.location.href =
                            "membership-plans.html";

                    },
                    700
                );

            }
        );

    }


    /* =====================================================
       MEMBERSHIP PLANS PAGE
       ===================================================== */

    if (plansContainer) {

        let plans = getPlans();


        /* ---------- DEFAULT PLANS ---------- */

        if (!plans.length) {

            plans = [

                {
                    id: 1,
                    name: "Monthly Plan",
                    duration: "1 Month",
                    price: 1000,
                    description:
                        "Perfect for members who prefer monthly flexibility.",
                    status: "Active",
                    members: 82
                },

                {
                    id: 2,
                    name: "3 Month Plan",
                    duration: "3 Months",
                    price: 2500,
                    description:
                        "A popular plan for regular gym members.",
                    status: "Active",
                    members: 64
                },

                {
                    id: 3,
                    name: "6 Month Plan",
                    duration: "6 Months",
                    price: 4500,
                    description:
                        "Save more with a long-term membership.",
                    status: "Active",
                    members: 71
                },

                {
                    id: 4,
                    name: "Yearly Plan",
                    duration: "12 Months",
                    price: 8000,
                    description:
                        "Best value for committed gym members.",
                    status: "Active",
                    members: 31
                }

            ];


            savePlans(plans);

        }


        /* ---------- TOTAL MEMBERS ---------- */

        const totalPlanElement =
            document.querySelector(
                ".plans-summary-card:first-child strong"
            );


        if (totalPlanElement) {

            totalPlanElement.textContent =
                plans.length;

        }


        /* ---------- ACTIVE MEMBERS ---------- */

        const activeMemberElement =
            document.querySelector(
                ".plans-summary-card:nth-child(2) strong"
            );


        if (activeMemberElement) {

            const totalMembers =
                plans.reduce(
                    function (total, plan) {

                        return total +
                            Number(plan.members || 0);

                    },
                    0
                );


            activeMemberElement.textContent =
                totalMembers;

        }


        /* ---------- RENDER PLANS ---------- */

        plansContainer.innerHTML =
            plans.map(
                function (plan) {

                    const icon =
                        plan.duration === "1 Month"
                            ? "M"
                            : plan.duration === "3 Months"
                                ? "3M"
                                : plan.duration === "6 Months"
                                    ? "6M"
                                    : "1Y";


                    const statusClass =
                        String(plan.status)
                            .toLowerCase() === "active"
                            ? "active"
                            : "inactive";


                    const price =
                        Number(plan.price || 0)
                            .toLocaleString("en-IN");


                    return `

                <article class="plan-card">

                    <div class="plan-card-top">

                        <div class="plan-icon">
                            ${icon}
                        </div>

                        <span class="plan-status ${statusClass}">
                            ${escapeHTML(plan.status || "Active")}
                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(plan.name)}
                    </h3>


                    <p class="plan-description">
                        ${escapeHTML(
                        plan.description ||
                        "Membership plan"
                    )}
                    </p>


                    <div class="plan-price">

                        <strong>
                            ₹${price}
                        </strong>

                        <span>
                            / ${plan.duration.toLowerCase()}
                        </span>

                    </div>


                    <div class="plan-details">

                        <div>

                            <span>
                                Duration
                            </span>

                            <strong>
                                ${escapeHTML(plan.duration)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Members
                            </span>

                            <strong>
                                ${Number(
                        plan.members || 0
                    )}
                            </strong>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="plan-action-btn edit-plan-btn"
                        data-id="${plan.id}"
                    >
                        Edit Plan
                    </button>

                </article>

                `;

                }
            ).join("");


        /* ---------- EDIT BUTTON ---------- */

        document.querySelectorAll(
            ".edit-plan-btn"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.dataset.id;


                        window.location.href =
                            "add-plan.html?edit=" +
                            encodeURIComponent(id);

                    }
                );

            }
        );

    }




    /* =====================================================
   NOTIFICATIONS
   ===================================================== */

    const notificationList =
        document.querySelector(".notification-list");

    const notificationSections =
        document.querySelectorAll(".notification-section");


    if (notificationList) {

        const notificationMembers =
            getData("fitzone_members", []);

        const notificationPayments =
            getData("fitzone_payments", []);


        /* ---------- DATE ---------- */

        const today =
            new Date();

        today.setHours(0, 0, 0, 0);


        /* ---------- NOTIFICATIONS ARRAY ---------- */

        let notifications = [];


        /* =================================================
           MEMBERSHIP EXPIRY
           ================================================= */

        notificationMembers.forEach(function (member) {

            if (!member.expiryDate) {
                return;
            }


            const expiryDate =
                new Date(member.expiryDate + "T00:00:00");

            expiryDate.setHours(0, 0, 0, 0);


            const difference =
                expiryDate - today;


            const days =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            /* ---------- EXPIRED ---------- */

            if (days < 0) {

                notifications.push({

                    type: "expiry",

                    title:
                        "Membership Expired",

                    message:
                        `${member.name}'s membership has expired.`,

                    time:
                        "Membership expired",

                    unread:
                        true,

                    date:
                        expiryDate

                });

            }


            /* ---------- EXPIRING SOON ---------- */

            else if (days <= 2) {

                let message = "";


                if (days === 0) {

                    message =
                        `${member.name}'s membership expires today.`;

                } else if (days === 1) {

                    message =
                        `${member.name}'s membership expires tomorrow.`;

                } else {

                    message =
                        `${member.name}'s membership expires in ${days} days.`;

                }


                notifications.push({

                    type: "expiry",

                    title:
                        "Membership Expiring Soon",

                    message:
                        message,

                    time:
                        "Expiry reminder",

                    unread:
                        true,

                    date:
                        expiryDate

                });

            }

        });


        /* =================================================
           PAYMENTS
           ================================================= */

        notificationPayments.forEach(function (payment) {

            if (!payment.date) {
                return;
            }


            const paymentDate =
                new Date(payment.date + "T00:00:00");


            paymentDate.setHours(0, 0, 0, 0);


            if (
                payment.status === "Paid" &&
                paymentDate.getTime() ===
                today.getTime()
            ) {

                notifications.push({

                    type: "payment",

                    title:
                        "Payment Received",

                    message:
                        `${payment.memberName || "Member"} paid ₹${Number(
                            payment.amount || 0
                        ).toLocaleString("en-IN")} for their membership.`,

                    time:
                        "Today",

                    unread:
                        true,

                    date:
                        paymentDate

                });

            }

        });


        /* =================================================
           NEW MEMBERS
           ================================================= */

        notificationMembers.forEach(function (member) {

            if (!member.createdAt) {
                return;
            }


            const createdDate =
                new Date(member.createdAt);


            createdDate.setHours(0, 0, 0, 0);


            if (
                createdDate.getTime() ===
                today.getTime()
            ) {

                notifications.push({

                    type: "member",

                    title:
                        "New Member Added",

                    message:
                        `${member.name} joined the gym.`,

                    time:
                        "Today",

                    unread:
                        true,

                    date:
                        createdDate

                });

            }

        });


        /* =================================================
           SORT
           ================================================= */

        notifications.sort(
            function (a, b) {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            }
        );


        /* =================================================
           SUMMARY
           ================================================= */

        const unreadCount =
            notifications.filter(
                function (notification) {

                    return notification.unread;

                }
            ).length;


        const todayCount =
            notifications.length;


        const summaryCards =
            document.querySelectorAll(
                ".notification-summary-card"
            );


        if (summaryCards.length >= 2) {

            const unreadElement =
                summaryCards[0].querySelector("strong");


            const todayElement =
                summaryCards[1].querySelector("strong");


            if (unreadElement) {

                unreadElement.textContent =
                    unreadCount;

            }


            if (todayElement) {

                todayElement.textContent =
                    todayCount;

            }

        }


        /* =================================================
           RENDER
           ================================================= */

        if (!notifications.length) {

            notificationList.innerHTML = `

            <div class="empty-state">

                <p>
                    No new notifications.
                </p>

            </div>

        `;

        } else {

            notificationList.innerHTML =
                notifications.map(
                    function (notification) {

                        let icon =
                            "!";

                        let iconClass =
                            "expiry";


                        if (
                            notification.type ===
                            "payment"
                        ) {

                            icon =
                                "₹";

                            iconClass =
                                "payment";

                        }


                        if (
                            notification.type ===
                            "member"
                        ) {

                            icon =
                                "+";

                            iconClass =
                                "member";

                        }


                        return `

                    <article
                        class="notification-card"
                    >

                        <div
                            class="notification-icon ${iconClass}"
                        >
                            ${icon}
                        </div>


                        <div
                            class="notification-content"
                        >

                            <h3>
                                ${escapeHTML(
                            notification.title
                        )}
                            </h3>


                            <p>
                                ${escapeHTML(
                            notification.message
                        )}
                            </p>


                            <span>
                                ${escapeHTML(
                            notification.time
                        )}
                            </span>

                        </div>


                        ${notification.unread
                                ? `<div class="unread-dot"></div>`
                                : ""
                            }

                    </article>

                    `;

                    }
                ).join("");

        }


        /* =================================================
           REMOVE OLD YESTERDAY STATIC NOTIFICATIONS
           ================================================= */

        if (notificationSections.length > 1) {

            const yesterdaySection =
                notificationSections[1];


            yesterdaySection.style.display =
                "none";

        }

    }


    /* =====================================================
       FINISH
       ===================================================== */

    console.log(
        "FitZone JavaScript initialized successfully."
    );

});
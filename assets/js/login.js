document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.querySelector(".loginBtn");
    const emailInput = document.getElementById("loginEmail");

    loginBtn.addEventListener("click", (e) => {
        e.preventDefault(); 

        const email = emailInput.value.trim();

        if (email === "") {
            alert("Please Enter Email");
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("email", email);

        console.log("Redirecting to home...");

        window.location.href = "index.html"; // <-- adjust if needed
    });
});

// Target Home Page URL
        const HOME_PAGE_URL = "home111.html";

        // DOM Elements
        const themeBtn = document.getElementById("themeBtn");
        const themeBtnText = document.getElementById("themeBtnText");
        const directionBtn = document.getElementById("directionBtn");
        const dirBtnText = document.getElementById("dirBtnText");
        const loginForm = document.getElementById("loginForm");
        const userEmail = document.getElementById("userEmail");
        const userPassword = document.getElementById("userPassword");
        const togglePasswordBtn = document.getElementById("togglePasswordBtn");
        const togglePasswordIcon = document.getElementById("togglePasswordIcon");
        const submitBtn = document.getElementById("submitBtn");
        const toastMsg = document.getElementById("toastMsg");
        const toastText = document.getElementById("toastText");

        // --- 1. THEME TOGGLE (LIGHT / DARK) ---
        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add("dark");
                themeBtn.querySelector("i").className = "fa-solid fa-sun";
                themeBtnText.textContent = "Light";
            } else {
                document.body.classList.remove("dark");
                themeBtn.querySelector("i").className = "fa-solid fa-moon";
                themeBtnText.textContent = "Dark";
            }
        }

        themeBtn.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark");
            applyTheme(isDark);
            localStorage.setItem("stationery_theme", isDark ? "dark" : "light");
            showToast(isDark ? "Dark Theme Enabled" : "Light Theme Enabled");
        });

        // Initialize Theme from localStorage
        const savedTheme = localStorage.getItem("stationery_theme");
        if (savedTheme === "dark") {
            applyTheme(true);
        }

        // --- 2. RTL / LTR DIRECTION TOGGLE ---
        function setDirection(dir) {
            document.documentElement.setAttribute("dir", dir);
            dirBtnText.textContent = dir === "rtl" ? "LTR" : "RTL";
            localStorage.setItem("stationery_dir", dir);
        }

        directionBtn.addEventListener("click", () => {
            const currentDir = document.documentElement.getAttribute("dir") || "ltr";
            const newDir = currentDir === "rtl" ? "ltr" : "rtl";
            setDirection(newDir);
            showToast(newDir === "rtl" ? "Right-to-Left (RTL) Active" : "Left-to-Right (LTR) Active");
        });

        // Initialize Direction from localStorage
        const savedDir = localStorage.getItem("stationery_dir");
        if (savedDir) {
            setDirection(savedDir);
        }

        // --- 3. PASSWORD VISIBILITY TOGGLE ---
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = userPassword.getAttribute("type") === "password";
            userPassword.setAttribute("type", isPassword ? "text" : "password");
            togglePasswordIcon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
        });

        // --- 4. TOAST NOTIFICATION UTILITY ---
        let toastTimeout;
        function showToast(message) {
            toastText.textContent = message;
            toastMsg.classList.add("show");
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastMsg.classList.remove("show");
            }, 2600);
        }

        // --- 5. SIGN IN & REDIRECTION LOGIC ---
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Visual feedback on button
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.85";
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';

            showToast("Signing in to Stationery House...");

            // Redirect to home page after brief smooth transition
            setTimeout(() => {
                window.location.href = HOME_PAGE_URL;
            }, 1000);
        });

        // --- 6. SIMULATED SSO / OAUTH CLICK ---
        function simulateOAuth(provider) {
            showToast(`Connecting with ${provider}...`);
            setTimeout(() => {
                window.location.href = HOME_PAGE_URL;
            }, 1100);
        }

        // Prevent dead links
        document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
            e.preventDefault();
            showToast("Password reset instructions sent to registered contact.");
        });

        document.getElementById("registerLink").addEventListener("click", (e) => {
            e.preventDefault();
            showToast("Redirecting to Institutional Registration...");
        });
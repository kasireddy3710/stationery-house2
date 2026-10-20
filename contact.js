 // --- 1. HERO CLIP SLIDER ---
        const slides = document.querySelectorAll(".clip-slide");
        const dots = document.querySelectorAll(".clip-dot");
        const prevBtn = document.getElementById("clipPrev");
        const nextBtn = document.getElementById("clipNext");
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((s, i) => s.classList.toggle("active", i === index));
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }

        function startSlideTimer() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => {
                nextSlide();
                resetSlideTimer();
            });

            prevBtn.addEventListener("click", () => {
                prevSlide();
                resetSlideTimer();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                const target = Number(dot.dataset.slide);
                showSlide(target);
                resetSlideTimer();
            });
        });

        startSlideTimer();

        // --- 2. MOBILE MENU & HOME DROPDOWN TOGGLE ---
        const menuBtn = document.getElementById("menuBtn");
        const navLinks = document.getElementById("navLinks");
        const homeDropdownItem = document.getElementById("homeDropdownItem");
        const homeDropdownToggle = document.getElementById("homeDropdownToggle");

        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-open");
            const icon = menuBtn.querySelector("i");
            if (navLinks.classList.contains("mobile-open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
                homeDropdownItem.classList.remove("open");
            }
        });

        // Click handler for Home Dropdown toggle (works for mobile tap and desktop accessibility)
        homeDropdownToggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 1050) {
                e.preventDefault();
                homeDropdownItem.classList.toggle("open");
                const isOpen = homeDropdownItem.classList.contains("open");
                homeDropdownToggle.setAttribute("aria-expanded", isOpen);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!homeDropdownItem.contains(e.target)) {
                homeDropdownItem.classList.remove("open");
                homeDropdownToggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close mobile menu on clicking any navigation link
        document.querySelectorAll(".nav-link:not(.dropdown-toggle), .dropdown-item").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("mobile-open");
                homeDropdownItem.classList.remove("open");
                menuBtn.querySelector("i").className = "fa-solid fa-bars";
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                
                // Highlight Home or active link
                if (link.classList.contains("dropdown-item")) {
                    homeDropdownToggle.classList.add("active");
                } else {
                    link.classList.add("active");
                }
            });
        });

        // --- 3. THEME TOGGLE (DARK / LIGHT) ---
        const themeBtn = document.getElementById("themeBtn");

        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                document.body.classList.remove("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        }

        themeBtn.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark");
            applyTheme(isDark);
            localStorage.setItem("stationery_theme", isDark ? "dark" : "light");
        });

        const savedTheme = localStorage.getItem("stationery_theme");
        if (savedTheme === "dark") {
            applyTheme(true);
        }

        // --- 4. RTL / LTR TOGGLE ---
        const directionBtn = document.getElementById("directionBtn");

        function setDirection(dir) {
            document.documentElement.setAttribute("dir", dir);
            directionBtn.querySelector("span").textContent = dir === "rtl" ? "LTR" : "RTL";
            localStorage.setItem("stationery_dir", dir);
        }

        directionBtn.addEventListener("click", () => {
            const currentDir = document.documentElement.getAttribute("dir") || "ltr";
            const newDir = currentDir === "rtl" ? "ltr" : "rtl";
            setDirection(newDir);
        });

        const savedDir = localStorage.getItem("stationery_dir");
        if (savedDir) {
            setDirection(savedDir);
        }

        // --- 5. TOAST NOTIFICATION ---
        const toastMsg = document.getElementById("toastMsg");
        let toastTimeout;

        function showToast(message) {
            toastMsg.textContent = message;
            toastMsg.classList.add("show");
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastMsg.classList.remove("show");
            }, 3000);
        }

        // --- 6. INTERACTIVE CONTACT FORM SUBMISSION ---
        const contactPageForm = document.getElementById("contactPageForm");

        contactPageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("userName").value;
            const category = document.getElementById("userCategory").value;

            showToast(`Thank you, ${name}! Your ${category} enquiry has been recorded.`);
            contactPageForm.reset();
        });

        // --- 7. AUTO-FILL CATEGORY FROM DEPARTMENT CARDS ---
        document.querySelectorAll(".select-dept").forEach(button => {
            button.addEventListener("click", () => {
                const category = button.dataset.cat;
                const selectElement = document.getElementById("userCategory");
                if (selectElement) {
                    selectElement.value = category;
                }
            });
        });
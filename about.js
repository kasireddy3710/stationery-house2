// --- 1. HERO SLIDER LOGIC ---
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".slider-dot");
        const prevBtn = document.getElementById("sliderPrev");
        const nextBtn = document.getElementById("sliderNext");
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((s, i) => {
                s.classList.toggle("active", i === index);
            });
            dots.forEach((d, i) => {
                d.classList.toggle("active", i === index);
            });
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
            slideInterval = setInterval(nextSlide, 5500);
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetSlideTimer();
        });

        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetSlideTimer();
        });

        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                const target = Number(dot.dataset.slide);
                showSlide(target);
                resetSlideTimer();
            });
        });

        startSlideTimer();

        // --- 2. SCROLL REVEAL OBSERVER ---
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // --- 3. DYNAMIC STATS NUMBER COUNTER ---
        const statNumbers = document.querySelectorAll('.stat-number');
        let statsCounted = false;

        function animateNumber(el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const isComma = el.getAttribute('data-format') === 'comma';
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic calculation
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOut * target);

                const formattedNumber = isComma ? current.toLocaleString() : current;
                el.textContent = formattedNumber + (progress === 1 ? suffix : '');

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }
            requestAnimationFrame(updateCount);
        }

        const statsSection = document.querySelector('.stats-strip');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !statsCounted) {
                        statsCounted = true;
                        statNumbers.forEach(el => animateNumber(el));
                    }
                });
            }, { threshold: 0.3 });
            statsObserver.observe(statsSection);
        }

        // --- 4. NAVBAR COMPRESSION & BACK-TO-TOP BUTTON ---
        const mainHeader = document.getElementById("mainHeader");
        const backToTop = document.getElementById("backToTop");

        window.addEventListener("scroll", () => {
            const scrollPos = window.scrollY;

            if (scrollPos > 60) {
                mainHeader.classList.add("scrolled");
            } else {
                mainHeader.classList.remove("scrolled");
            }

            if (scrollPos > 400) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        });

        // --- 5. MOBILE MENU & HOME DROPDOWN ---
        const menuBtn = document.getElementById("menuBtn");
        const navLinks = document.getElementById("navLinks");
        const homeDropdownItem = document.getElementById("homeDropdownItem");
        const homeNavBtn = document.getElementById("homeNavBtn");

        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-open");
            const icon = menuBtn.querySelector("i");
            if (navLinks.classList.contains("mobile-open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
                homeDropdownItem.classList.remove("open");
                homeNavBtn.setAttribute("aria-expanded", "false");
            }
        });

        homeNavBtn.addEventListener("click", (e) => {
            if (window.innerWidth <= 1050) {
                e.preventDefault();
                const isOpen = homeDropdownItem.classList.toggle("open");
                homeNavBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            }
        });

        document.querySelectorAll(".dropdown-item").forEach(item => {
            item.addEventListener("click", () => {
                homeDropdownItem.classList.remove("open");
                homeNavBtn.setAttribute("aria-expanded", "false");
                if (window.innerWidth <= 1050) {
                    navLinks.classList.remove("mobile-open");
                    menuBtn.querySelector("i").className = "fa-solid fa-bars";
                }
            });
        });

        document.addEventListener("click", (e) => {
            if (!homeDropdownItem.contains(e.target)) {
                homeDropdownItem.classList.remove("open");
                homeNavBtn.setAttribute("aria-expanded", "false");
            }
        });

        // --- 6. DYNAMIC THEME TOGGLE ---
        const themeBtn = document.getElementById("themeBtn");

        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                showToast("Dark Mode Activated");
            } else {
                document.body.classList.remove("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                showToast("Light Mode Activated");
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

        // --- 7. RTL / LTR DIRECTION TOGGLE ---
        const directionBtn = document.getElementById("directionBtn");

        function setDirection(dir) {
            document.documentElement.setAttribute("dir", dir);
            directionBtn.querySelector("span").textContent = dir === "rtl" ? "LTR" : "RTL";
            localStorage.setItem("stationery_dir", dir);
            showToast(dir === "rtl" ? "Direction: RTL" : "Direction: LTR");
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

        // --- 8. TOAST NOTIFICATION UTILITY ---
        const toastMsg = document.getElementById("toastMsg");
        let toastTimeout;

        function showToast(message) {
            toastMsg.textContent = message;
            toastMsg.classList.add("show");
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toastMsg.classList.remove("show");
            }, 2500);
        }

        // --- 9. CONTACT & ENQUIRY MODAL LOGIC ---
        const contactModal = document.getElementById("contactModal");
        const openContactModalBtn = document.getElementById("openContactModal");
        const closeContactModal = document.getElementById("closeContactModal");
        const enquiryForm = document.getElementById("enquiryForm");

        openContactModalBtn.addEventListener("click", () => {
            contactModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });

        function closeModal() {
            contactModal.classList.remove("show");
            document.body.style.overflow = "";
        }

        closeContactModal.addEventListener("click", closeModal);

        contactModal.addEventListener("click", (e) => {
            if (e.target === contactModal) {
                closeModal();
            }
        });

        enquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contactName").value;
            alert(`Thank you, ${name}!\n\nYour enquiry has been submitted to the desk of The Shelf — Curated Reads.`);
            enquiryForm.reset();
            closeModal();
            showToast("Enquiry sent successfully ✓");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && contactModal.classList.contains("show")) {
                closeModal();
            }
        });
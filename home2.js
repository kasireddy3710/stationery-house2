// --- 1. PROGRESS BAR & HEADER SCROLL ---
        const scrollProgressBar = document.getElementById("scrollProgressBar");
        const mainHeader = document.getElementById("mainHeader");
        const backToTopBtn = document.getElementById("backToTop");

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            if (scrollProgressBar) {
                scrollProgressBar.style.width = `${scrollPercent}%`;
            }

            if (scrollTop > 60) {
                mainHeader.classList.add("scrolled");
            } else {
                mainHeader.classList.remove("scrolled");
            }

            if (scrollTop > 350) {
                backToTopBtn.classList.add("active-scroll");
            } else {
                backToTopBtn.classList.remove("active-scroll");
            }
        });

        // --- 2. SMOOTH SCROLL FOR INTERNAL ANCHORS ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                const targetId = this.getAttribute("href");
                if (targetId === "#" || targetId === "") return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    if (navLinks.classList.contains("mobile-open")) {
                        navLinks.classList.remove("mobile-open");
                        menuBtn.querySelector("i").className = "fa-solid fa-bars";
                        homeDropdownItem.classList.remove("open");
                        homeNavBtn.setAttribute("aria-expanded", "false");
                    }
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });

        // --- 3. 3-CLIP HERO SLIDER ---
        const slides = document.querySelectorAll(".slide");
        const dots = document.querySelectorAll(".slider-dot");
        const prevBtn = document.getElementById("sliderPrev");
        const nextBtn = document.getElementById("sliderNext");
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((s, i) => s.classList.toggle("active", i === index));
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
            currentSlide = index;
        }

        function nextSlide() {
            showSlide((currentSlide + 1) % slides.length);
        }

        function prevSlide() {
            showSlide((currentSlide - 1 + slides.length) % slides.length);
        }

        function startSlideTimer() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetSlideTimer() {
            clearInterval(slideInterval);
            startSlideTimer();
        }

        nextBtn.addEventListener("click", () => { nextSlide(); resetSlideTimer(); });
        prevBtn.addEventListener("click", () => { prevSlide(); resetSlideTimer(); });
        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                showSlide(Number(dot.dataset.slide));
                resetSlideTimer();
            });
        });
        startSlideTimer();

        // --- 4. SPOTLIGHT MOUSE TRACKING ---
        document.querySelectorAll(".product-img-wrap").forEach(frame => {
            frame.addEventListener("mousemove", (e) => {
                const rect = frame.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                frame.style.setProperty("--light-x", `${x.toFixed(1)}%`);
                frame.style.setProperty("--light-y", `${y.toFixed(1)}%`);
            });
            frame.addEventListener("mouseleave", () => {
                frame.style.setProperty("--light-x", "50%");
                frame.style.setProperty("--light-y", "50%");
            });
        });

        // --- 5. SCROLL REVEAL OBSERVER ---
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll(".reveal-element").forEach(el => observer.observe(el));

        // --- 6. MOBILE MENU & DROPDOWN ---
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
            }
        });

        homeNavBtn.addEventListener("click", (e) => {
            if (window.innerWidth <= 1050) {
                e.preventDefault();
                const isOpen = homeDropdownItem.classList.toggle("open");
                homeNavBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            }
        });

        document.addEventListener("click", (e) => {
            if (!homeDropdownItem.contains(e.target)) {
                homeDropdownItem.classList.remove("open");
                homeNavBtn.setAttribute("aria-expanded", "false");
            }
        });

        // --- 7. THEME TOGGLE ---
        const themeBtn = document.getElementById("themeBtn");

        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                showToast("Midnight Library Dark Mode");
            } else {
                document.body.classList.remove("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                showToast("Sunlit Reading Light Mode");
            }
        }

        themeBtn.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark");
            applyTheme(isDark);
            localStorage.setItem("stationery_theme", isDark ? "dark" : "light");
        });

        if (localStorage.getItem("stationery_theme") === "dark") {
            applyTheme(true);
        }

        // --- 8. RTL / LTR TOGGLE ---
        const directionBtn = document.getElementById("directionBtn");

        function setDirection(dir) {
            document.documentElement.setAttribute("dir", dir);
            directionBtn.querySelector("span").textContent = dir === "rtl" ? "LTR" : "RTL";
            localStorage.setItem("stationery_dir", dir);
            showToast(dir === "rtl" ? "Direction: RTL" : "Direction: LTR");
        }

        directionBtn.addEventListener("click", () => {
            const currentDir = document.documentElement.getAttribute("dir") || "ltr";
            setDirection(currentDir === "rtl" ? "ltr" : "rtl");
        });

        if (localStorage.getItem("stationery_dir")) {
            setDirection(localStorage.getItem("stationery_dir"));
        }

        // --- 9. TOAST UTILITY ---
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

        // --- 10. QUICK VIEW & ENQUIRY MODALS ---
        const quickModal = document.getElementById("quickModal");
        const closeQuickModal = document.getElementById("closeQuickModal");
        const quickModalImg = document.getElementById("quickModalImg");
        const quickModalTitle = document.getElementById("quickModalTitle");
        const quickModalPrice = document.getElementById("quickModalPrice");
        const quickModalEnquireBtn = document.getElementById("quickModalEnquireBtn");

        const contactModal = document.getElementById("contactModal");
        const openContactModalBtn = document.getElementById("openContactModal");
        const closeContactModal = document.getElementById("closeContactModal");
        const enquiryForm = document.getElementById("enquiryForm");
        const contactMsg = document.getElementById("contactMsg");

        let activeBook = "";

        document.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const title = btn.dataset.title;
                const price = btn.dataset.price;
                const img = btn.dataset.img;

                activeBook = `${title} (₹${price})`;
                quickModalTitle.textContent = title;
                quickModalPrice.textContent = "₹" + price;
                quickModalImg.src = img;

                quickModal.classList.add("show");
                document.body.style.overflow = "hidden";
            });
        });

        closeQuickModal.addEventListener("click", () => {
            quickModal.classList.remove("show");
            document.body.style.overflow = "";
        });

        quickModalEnquireBtn.addEventListener("click", () => {
            quickModal.classList.remove("show");
            openEnquiryWithItem(activeBook);
        });

        function openEnquiryWithItem(item) {
            contactModal.classList.add("show");
            document.body.style.overflow = "hidden";
            if (item) {
                contactMsg.value = `Greetings Curator, I would like to reserve/order: ${item}. Please confirm edition availability and schedule.`;
            }
        }

        openContactModalBtn.addEventListener("click", () => openEnquiryWithItem(""));
        document.querySelectorAll(".open-enquiry").forEach(btn => {
            btn.addEventListener("click", () => openEnquiryWithItem(btn.dataset.item));
        });

        closeContactModal.addEventListener("click", () => {
            contactModal.classList.remove("show");
            document.body.style.overflow = "";
        });

        window.addEventListener("click", (e) => {
            if (e.target === quickModal) { quickModal.classList.remove("show"); document.body.style.overflow = ""; }
            if (e.target === contactModal) { contactModal.classList.remove("show"); document.body.style.overflow = ""; }
        });

        enquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contactName").value;
            alert(`Thank you, ${name}!\n\nYour reading request has reached our curatorial desk. We will reach back promptly.`);
            enquiryForm.reset();
            contactModal.classList.remove("show");
            document.body.style.overflow = "";
            showToast("Enquiry sent to curator ✓");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                quickModal.classList.remove("show");
                contactModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
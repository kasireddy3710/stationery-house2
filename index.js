// --- 1. TOP SCROLL PROGRESS BAR & STICKY HEADER COMPRESSION ---
        const scrollProgressBar = document.getElementById("scrollProgressBar");
        const mainHeader = document.getElementById("mainHeader");
        const backToTopBtn = document.getElementById("backToTop");

        window.addEventListener("scroll", () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            
            // Update top progress bar
            if (scrollProgressBar) {
                scrollProgressBar.style.width = `${scrollPercent}%`;
            }

            // Compact Header on Scroll
            if (scrollTop > 60) {
                mainHeader.classList.add("scrolled");
            } else {
                mainHeader.classList.remove("scrolled");
            }

            // Back to top reveal animation
            if (scrollTop > 350) {
                backToTopBtn.classList.add("active-scroll");
            } else {
                backToTopBtn.classList.remove("active-scroll");
            }
        });

        // --- 2. SMOOTH SCROLL DOWN HANDLER FOR ALL INTERNAL ANCHORS ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", function(e) {
                const targetId = this.getAttribute("href");
                if (targetId === "#" || targetId === "") return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();

                    // Close mobile navigation drawer if open
                    if (navLinks.classList.contains("mobile-open")) {
                        navLinks.classList.remove("mobile-open");
                        menuBtn.querySelector("i").className = "fa-solid fa-bars";
                        homeDropdownItem.classList.remove("open");
                        homeNavBtn.setAttribute("aria-expanded", "false");
                    }

                    // Compute precise destination with header offset
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

        // --- 3. ANIMATED HERO SLIDER ---
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

        // --- 4. INTERACTIVE SPOTLIGHT LIGHTING ON IMAGES (MOUSE TRACKING) ---
        const dynamicLightingElements = document.querySelectorAll(".product-img-wrap, .story-img-frame");

        dynamicLightingElements.forEach(frame => {
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
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        document.querySelectorAll(".reveal-element").forEach(el => revealObserver.observe(el));

        // --- 6. HOME DROPDOWN & MOBILE NAVIGATION LOGIC ---
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

        // --- 7. DYNAMIC THEME TOGGLE ---
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
            const newDir = currentDir === "rtl" ? "ltr" : "rtl";
            setDirection(newDir);
        });

        const savedDir = localStorage.getItem("stationery_dir");
        if (savedDir) {
            setDirection(savedDir);
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

        // --- 10. QUICK VIEW MODAL LOGIC ---
        const quickModal = document.getElementById("quickModal");
        const closeQuickModal = document.getElementById("closeQuickModal");
        const quickModalImg = document.getElementById("quickModalImg");
        const quickModalTitle = document.getElementById("quickModalTitle");
        const quickModalPrice = document.getElementById("quickModalPrice");
        const quickModalEnquireBtn = document.getElementById("quickModalEnquireBtn");

        let currentActiveItem = "";

        document.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const title = btn.dataset.title;
                const price = btn.dataset.price;
                const img = btn.dataset.img;

                currentActiveItem = `${title} (₹${price})`;
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

        quickModal.addEventListener("click", (e) => {
            if (e.target === quickModal) {
                quickModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });

        quickModalEnquireBtn.addEventListener("click", () => {
            quickModal.classList.remove("show");
            openEnquiryWithItem(currentActiveItem);
        });

        // --- 11. CONTACT & ENQUIRY MODAL LOGIC ---
        const contactModal = document.getElementById("contactModal");
        const openContactModalBtn = document.getElementById("openContactModal");
        const closeContactModal = document.getElementById("closeContactModal");
        const enquiryForm = document.getElementById("enquiryForm");
        const contactMsg = document.getElementById("contactMsg");

        function openEnquiryWithItem(itemName) {
            contactModal.classList.add("show");
            document.body.style.overflow = "hidden";
            if (itemName) {
                contactMsg.value = `Hello, I would like to order or enquire about: ${itemName}. Please share bulk availability and delivery schedules.`;
            }
        }

        openContactModalBtn.addEventListener("click", () => {
            openEnquiryWithItem("");
        });

        document.querySelectorAll(".open-enquiry").forEach(btn => {
            btn.addEventListener("click", () => {
                const item = btn.dataset.item;
                openEnquiryWithItem(item);
            });
        });

        closeContactModal.addEventListener("click", () => {
            contactModal.classList.remove("show");
            document.body.style.overflow = "";
        });

        contactModal.addEventListener("click", (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });

        enquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("contactName").value;
            alert(`Thank you, ${name}!\n\nYour academic consignment enquiry has been sent to our desk.`);
            enquiryForm.reset();
            contactModal.classList.remove("show");
            document.body.style.overflow = "";
            showToast("Enquiry sent successfully ✓");
        });

        // Close modals on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                quickModal.classList.remove("show");
                contactModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
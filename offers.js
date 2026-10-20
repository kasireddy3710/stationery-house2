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

        // --- 2. MOBILE MENU & ACCORDION HOME DROPDOWN ---
        const menuBtn = document.getElementById("menuBtn");
        const navLinks = document.getElementById("navLinks");
        const homeDropdown = document.getElementById("homeDropdown");
        const homeToggle = document.getElementById("homeToggle");

        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-open");
            const icon = menuBtn.querySelector("i");
            if (navLinks.classList.contains("mobile-open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
                homeDropdown.classList.remove("mobile-open-drop");
            }
        });

        // Toggle sub-menu accordion on tablet/mobile screens
        homeToggle.addEventListener("click", (e) => {
            if (window.innerWidth <= 1050) {
                e.preventDefault();
                const isOpen = homeDropdown.classList.toggle("mobile-open-drop");
                homeToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!homeDropdown.contains(e.target)) {
                homeDropdown.classList.remove("mobile-open-drop");
                homeToggle.setAttribute("aria-expanded", "false");
            }
        });

        // --- 3. DARK / LIGHT THEME TOGGLE (Changes Body, Header & Footer) ---
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

        // Initialize Theme from localStorage
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

        // --- 5. CATEGORY FILTER (ALL, BOOKS, BAGS, PENS, GEOMETRY, ARTS) ---
        const filterTabs = document.querySelectorAll(".filter-tab");
        const productCards = document.querySelectorAll(".product-card");

        filterTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                filterTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                const filter = tab.dataset.filter;

                productCards.forEach(card => {
                    if (filter === "all" || card.dataset.category === filter) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });

        // --- 6. TOAST UTILITY & VOUCHER COPY ---
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

        document.querySelectorAll(".copy-code").forEach(btn => {
            btn.addEventListener("click", () => {
                const code = btn.dataset.code;
                navigator.clipboard.writeText(code).then(() => {
                    showToast(`Coupon code "${code}" copied to clipboard!`);
                }).catch(() => {
                    showToast(`Code: ${code}`);
                });
            });
        });

        document.querySelectorAll(".claim-offer").forEach(btn => {
            btn.addEventListener("click", () => {
                const title = btn.dataset.title;
                showToast(`Deal claimed for: ${title}`);
            });
        });

        // --- 7. QUICK VIEW MODAL LOGIC ---
        const quickModal = document.getElementById("quickModal");
        const closeQuickModal = document.getElementById("closeQuickModal");
        const quickModalImg = document.getElementById("quickModalImg");
        const quickModalTitle = document.getElementById("quickModalTitle");
        const quickModalPrice = document.getElementById("quickModalPrice");
        const modalClaimBtn = document.getElementById("modalClaimBtn");

        document.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const title = btn.dataset.title;
                const price = btn.dataset.price;
                const img = btn.dataset.img;

                quickModalTitle.textContent = title;
                quickModalPrice.textContent = "₹" + price;
                quickModalImg.src = img;

                quickModal.classList.add("show");
                document.body.style.overflow = "hidden";
            });
        });

        modalClaimBtn.addEventListener("click", () => {
            showToast(`Offer registered for ${quickModalTitle.textContent}!`);
            quickModal.classList.remove("show");
            document.body.style.overflow = "";
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

        // ESC Key to Close Modal
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                quickModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
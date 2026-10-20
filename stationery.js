// --- 1. ANIMATED HERO SLIDER ---
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

        // --- 2. HOME DROPDOWN & MOBILE MENU ---
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

        document.querySelectorAll(".nav-link:not(#homeNavBtn)").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("mobile-open");
                menuBtn.querySelector("i").className = "fa-solid fa-bars";
                document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            });
        });

        // --- 3. DARK / LIGHT THEME TOGGLE ---
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
            showToast(isDark ? "Switched to Royal Dark Theme" : "Switched to Heritage Ivory Theme");
        });

        const savedTheme = localStorage.getItem("stationery_theme");
        if (savedTheme === "dark") {
            applyTheme(true);
        }

        // --- 4. RTL / LTR DIRECTION TOGGLE ---
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
            showToast(`Direction updated to ${newDir.toUpperCase()}`);
        });

        const savedDir = localStorage.getItem("stationery_dir");
        if (savedDir) {
            setDirection(savedDir);
        }

        // --- 5. TOAST NOTIFICATION UTILITY ---
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

        // --- 6. INDEPENDENT CATEGORY FILTERING ---
        function setupSectionFilter(filterWrapperId, gridId) {
            const wrapper = document.getElementById(filterWrapperId);
            const grid = document.getElementById(gridId);
            if (!wrapper || !grid) return;

            const tabs = wrapper.querySelectorAll(".filter-tab");
            const cards = grid.querySelectorAll(".product-card");

            tabs.forEach(tab => {
                tab.addEventListener("click", () => {
                    tabs.forEach(t => t.classList.remove("active"));
                    tab.classList.add("active");
                    const filter = tab.dataset.filter;

                    cards.forEach(card => {
                        if (filter === "all" || card.dataset.category === filter) {
                            card.style.display = "flex";
                        } else {
                            card.style.display = "none";
                        }
                    });
                });
            });
        }

        setupSectionFilter("bookFilterWrapper", "productGrid");
        setupSectionFilter("stationeryFilterWrapper", "stationeryGrid");

        // --- 7. SCROLL INTERSECTION OBSERVER FOR PRODUCT CARD IMAGES ---
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("revealed");
                    }, (idx % 3) * 110);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll(".product-card").forEach(card => {
            scrollObserver.observe(card);
        });

        // --- 8. QUICK VIEW MODAL LOGIC ---
        const quickModal = document.getElementById("quickModal");
        const closeQuickModal = document.getElementById("closeQuickModal");
        const quickModalImg = document.getElementById("quickModalImg");
        const quickModalTitle = document.getElementById("quickModalTitle");
        const quickModalCat = document.getElementById("quickModalCat");
        const quickModalPrice = document.getElementById("quickModalPrice");
        const quickOrderAction = document.getElementById("quickOrderAction");

        let activeItem = { title: "", price: 0 };

        document.querySelectorAll(".quick-view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const title = btn.dataset.title;
                const price = Number(btn.dataset.price);
                const cat = btn.dataset.cat;
                const img = btn.dataset.img;

                activeItem = { title, price };

                quickModalTitle.textContent = title;
                quickModalPrice.textContent = "₹" + price;
                quickModalCat.textContent = cat;
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

        quickOrderAction.addEventListener("click", () => {
            quickModal.classList.remove("show");
            openOrder(activeItem.title);
        });

        // --- 9. DIRECT ORDER MODAL LOGIC ---
        const orderModal = document.getElementById("orderModal");
        const closeOrderModal = document.getElementById("closeOrderModal");
        const orderBookTitle = document.getElementById("orderBookTitle");
        const bookOrderForm = document.getElementById("bookOrderForm");
        const heroOrderBtn = document.getElementById("heroOrderBtn");

        function openOrder(title) {
            orderBookTitle.value = title;
            orderModal.classList.add("show");
            document.body.style.overflow = "hidden";
        }

        document.querySelectorAll(".order-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const itemName = btn.dataset.item;
                openOrder(itemName);
            });
        });

        if (heroOrderBtn) {
            heroOrderBtn.addEventListener("click", () => {
                openOrder("Comprehensive School Curriculum Consignment");
            });
        }

        closeOrderModal.addEventListener("click", () => {
            orderModal.classList.remove("show");
            document.body.style.overflow = "";
        });

        orderModal.addEventListener("click", (e) => {
            if (e.target === orderModal) {
                orderModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });

        bookOrderForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("orderName").value;
            const item = orderBookTitle.value;
            const qty = document.getElementById("orderQty").value;

            alert(`Thank you, ${name}!\n\nYour order for ${qty} unit(s) of "${item}" has been registered with Stationery House.`);
            bookOrderForm.reset();
            orderModal.classList.remove("show");
            document.body.style.overflow = "";
            showToast("Order placed successfully ✓");
        });

        // Close modals on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                quickModal.classList.remove("show");
                orderModal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
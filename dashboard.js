 // --- 1. SIDEBAR TOGGLE & RESPONSIVENESS ---
        const sidebarToggle = document.getElementById("sidebarToggle");
        const adminSidebar = document.getElementById("adminSidebar");
        const closeSidebarBtn = document.getElementById("closeSidebarBtn");

        sidebarToggle.addEventListener("click", () => {
            adminSidebar.classList.toggle("mobile-open");
        });

        closeSidebarBtn.addEventListener("click", () => {
            adminSidebar.classList.remove("mobile-open");
        });

        // --- 2. DARK / LIGHT THEME TOGGLE ---
        const themeBtn = document.getElementById("themeBtn");

        function applyTheme(isDark) {
            if (isDark) {
                document.body.classList.add("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                showToast("Dark Curator Theme Enabled");
            } else {
                document.body.classList.remove("dark");
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                showToast("Heritage Light Theme Enabled");
            }
            updateChartTheme(isDark);
        }

        themeBtn.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark");
            applyTheme(isDark);
            localStorage.setItem("shelf_admin_theme", isDark ? "dark" : "light");
        });

        const savedTheme = localStorage.getItem("shelf_admin_theme");
        if (savedTheme === "dark") {
            applyTheme(true);
        }

        // --- 3. RTL / LTR DIRECTION TOGGLE ---
        const directionBtn = document.getElementById("directionBtn");

        function setDirection(dir) {
            document.documentElement.setAttribute("dir", dir);
            directionBtn.textContent = dir === "rtl" ? "LTR" : "RTL";
            localStorage.setItem("shelf_admin_dir", dir);
            showToast(dir === "rtl" ? "Direction set to RTL" : "Direction set to LTR");
        }

        directionBtn.addEventListener("click", () => {
            const currentDir = document.documentElement.getAttribute("dir") || "ltr";
            const newDir = currentDir === "rtl" ? "ltr" : "rtl";
            setDirection(newDir);
        });

        const savedDir = localStorage.getItem("shelf_admin_dir");
        if (savedDir) {
            setDirection(savedDir);
        }

        // --- 4. TOAST NOTIFICATION UTILITY ---
        const toastMsg = document.getElementById("toastMsg");
        let toastTimer;

        function showToast(message) {
            toastMsg.textContent = message;
            toastMsg.classList.add("show");
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toastMsg.classList.remove("show");
            }, 2600);
        }

        // --- 5. ANIMATED NUMBER COUNTERS ---
        const counters = document.querySelectorAll(".counter");
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const isRupee = counter.innerText.includes("₹");
            let count = 0;
            const step = target / 50;

            const updateCount = () => {
                count += step;
                if (count < target) {
                    counter.innerText = (isRupee ? "₹" : "") + Math.ceil(count).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = (isRupee ? "₹" : "") + target.toLocaleString();
                }
            };
            updateCount();
        });

        // --- 6. CHARTS INITIALIZATION (CHART.JS) ---
        let velocityChart, categoryChart;

        function initCharts(isDark = false) {
            const textColor = isDark ? "#cfd7e0" : "#4a443b";
            const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)";

            // Velocity Area Chart
            const ctx1 = document.getElementById("salesVelocityChart").getContext("2d");
            const goldGradient = ctx1.createLinearGradient(0, 0, 0, 250);
            goldGradient.addColorStop(0, "rgba(201, 147, 48, 0.45)");
            goldGradient.addColorStop(1, "rgba(201, 147, 48, 0.01)");

            velocityChart = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'Curated Dispatches (₹ Thousands)',
                        data: [180, 220, 290, 420, 480, 510, 390, 430, 460, 482],
                        borderColor: '#c99330',
                        backgroundColor: goldGradient,
                        fill: true,
                        tension: 0.38,
                        borderWidth: 2.5,
                        pointBackgroundColor: '#e8b85b',
                        pointBorderColor: '#0c1524',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } },
                            grid: { color: gridColor }
                        },
                        y: {
                            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } },
                            grid: { color: gridColor }
                        }
                    }
                }
            });

            // Donut Chart
            const ctx2 = document.getElementById("categoryDonutChart").getContext("2d");
            categoryChart = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: ['CBSE Maths & Science', 'Artisan Pens & Tools', 'Signature School Kits', 'Registers & Paper'],
                    datasets: [{
                        data: [42, 22, 24, 12],
                        backgroundColor: [
                            '#c99330',
                            '#0e1726',
                            '#e8b85b',
                            '#8590a2'
                        ],
                        borderWidth: 2,
                        borderColor: isDark ? '#151e2b' : '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textColor,
                                font: { family: 'Plus Jakarta Sans', size: 11 },
                                boxWidth: 12
                            }
                        }
                    },
                    cutout: '72%'
                }
            });
        }

        function updateChartTheme(isDark) {
            if (!velocityChart || !categoryChart) return;
            const textColor = isDark ? "#cfd7e0" : "#4a443b";
            const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)";

            velocityChart.options.scales.x.ticks.color = textColor;
            velocityChart.options.scales.x.grid.color = gridColor;
            velocityChart.options.scales.y.ticks.color = textColor;
            velocityChart.options.scales.y.grid.color = gridColor;
            velocityChart.update();

            categoryChart.options.plugins.legend.labels.color = textColor;
            categoryChart.data.datasets[0].borderColor = isDark ? '#151e2b' : '#ffffff';
            categoryChart.update();
        }

        initCharts(savedTheme === "dark");

        // --- 7. TABLE SEARCH & FILTER LOGIC ---
        const filterPills = document.querySelectorAll(".filter-pill");
        const tableRows = document.querySelectorAll("#inventoryTableBody tr");
        const globalShelfSearch = document.getElementById("globalShelfSearch");

        filterPills.forEach(pill => {
            pill.addEventListener("click", () => {
                filterPills.forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                const filter = pill.dataset.filter;

                tableRows.forEach(row => {
                    const rowCat = row.dataset.cat;
                    if (filter === "all" || rowCat === filter) {
                        row.style.display = "";
                    } else {
                        row.style.display = "none";
                    }
                });
            });
        });

        globalShelfSearch.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            tableRows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? "" : "none";
            });
        });

        // --- 8. MODAL FOR ADDING / EDITING READS ---
        const bookModal = document.getElementById("bookModal");
        const openAddTitleModal = document.getElementById("openAddTitleModal");
        const openQuickAddBtn = document.getElementById("openQuickAddBtn");
        const closeBookModal = document.getElementById("closeBookModal");
        const bookForm = document.getElementById("bookForm");

        function openModal() {
            bookModal.classList.add("show");
        }

        function closeModal() {
            bookModal.classList.remove("show");
        }

        openAddTitleModal.addEventListener("click", openModal);
        openQuickAddBtn.addEventListener("click", openModal);
        closeBookModal.addEventListener("click", closeModal);

        bookModal.addEventListener("click", (e) => {
            if (e.target === bookModal) closeModal();
        });

        bookForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("formBookTitle").value;
            const cat = document.getElementById("formBookCat").value;
            const price = document.getElementById("formBookPrice").value;
            const stock = document.getElementById("formBookStock").value;

            // Dynamically prepend new book row to table
            const tbody = document.getElementById("inventoryTableBody");
            const newRow = document.createElement("tr");
            newRow.setAttribute("data-cat", cat);
            newRow.innerHTML = `
                <td>
                    <div class="book-item-meta">
                        <div style="width:44px; height:44px; border-radius:8px; background:var(--gold-soft); color:var(--gold-primary); display:grid; place-items:center; font-size:18px;">
                            <i class="fa-solid fa-book"></i>
                        </div>
                        <div>
                            <strong>${title}</strong>
                            <div style="font-size: 11.5px; color: var(--text-muted);">Curated Title • ISBN 978-NEW</div>
                        </div>
                    </div>
                </td>
                <td><span style="font-weight: 600;">${cat}</span></td>
                <td style="font-weight: 700; color: var(--gold-primary); font-family: 'Playfair Display';">₹${price}</td>
                <td>${stock} Copies</td>
                <td><span class="status-badge in-stock"><i class="fa-solid fa-circle-check"></i> In Catalog</span></td>
                <td>
                    <div class="action-btns-group">
                        <button class="action-btn-circle" title="Quick Edit"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn-circle" title="Inspect Record"><i class="fa-solid fa-eye"></i></button>
                    </div>
                </td>
            `;
            tbody.prepend(newRow);

            bookForm.reset();
            closeModal();
            showToast(`"${title}" added to The Shelf catalog!`);
        });

        // Quick edit buttons listener
        document.addEventListener("click", (e) => {
            if (e.target.closest(".edit-item-btn")) {
                showToast("Opening Quick Shelf Record Editor...");
                openModal();
            }
            if (e.target.closest(".view-item-btn")) {
                showToast("Accessing Central Warehouse Stock Telemetry...");
            }
        });
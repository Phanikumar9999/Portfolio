
const menuButton = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

if (menuButton && navbar) {
    menuButton.addEventListener("click", function () {
        const isOpen = navbar.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.textContent = isOpen ? "✕" : "☰";
    });

    // Close the mobile menu after clicking a page link
    const navLinks = navbar.querySelectorAll("a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navbar.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";
        });
    });
}

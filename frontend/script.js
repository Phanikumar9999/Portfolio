
// Mobile navigation menu
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


// Contact form submission

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        const responseMessage = document.getElementById("response");
        const sendButton = document.getElementById("sendButton");

        if (!name || !email || !message) {
            responseMessage.textContent =
                "Please fill in all the fields.";
            return;
        }

        sendButton.disabled = true;
        sendButton.textContent = "Sending...";
        responseMessage.textContent = "";

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                }),
                signal: AbortSignal.timeout(20000)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to send your message."
                );
            }

            responseMessage.textContent =
                result.message || "Message sent successfully!";

            contactForm.reset();

        } catch (error) {
            console.error("Contact form error:", error);

            if (error.name === "TimeoutError") {
                responseMessage.textContent =
                    "Request timed out. Please try again.";
            } else {
                responseMessage.textContent =
                    "Unable to send your message. Please try again later.";
            }
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = "Send Message";
        }
    });
}

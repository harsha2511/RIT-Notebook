document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const menuLeft = document.querySelector(".menu-left");
    const dropdownToggles = document.querySelectorAll(".dropdown > a");

    // Toggle menu visibility on hamburger click
    menuToggle.addEventListener("click", function () {
        menuLeft.classList.toggle("active");
    });

    // Dropdown functionality for mobile view
    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default link behavior
            const dropdownMenu = toggle.nextElementSibling;

            // Toggle the dropdown menu
            dropdownMenu.style.display =
                dropdownMenu.style.display === "block" ? "none" : "block";
        });
    });

    // Close the menu when a link is clicked
    const menuLinks = document.querySelectorAll(".menu-left a");
    menuLinks.forEach((link) => {
        link.addEventListener("click", function () {
            menuLeft.classList.remove("active");
        });
    });
});

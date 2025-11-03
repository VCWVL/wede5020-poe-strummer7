// Navigation highlight for current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.backgroundColor = '#0b53c1';
        }
    });
});

// Smooth scroll to top button
const scrollButton = document.createElement('button');
scrollButton.innerHTML = '↑';
scrollButton.className = 'scroll-top';
document.body.appendChild(scrollButton);

scrollButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Image loading animation
document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s';
    
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});

// Form validation for enquiries
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        const nameInput = document.querySelector('input[name="name"]');
        const emailInput = document.querySelector('input[name="email"]');
        
        if (!nameInput.value || !emailInput.value) {
            e.preventDefault();
            alert('Please fill in all required fields');
        }
    });
}
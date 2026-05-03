import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Active State on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Contact Form Submission using Firebase
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if(contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if(!name || !email || !message) return;
            
            // Disable button during submission
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Add document to 'contacts' collection in Firestore
                await addDoc(collection(db, "contacts"), {
                    name: name,
                    email: email,
                    message: message,
                    timestamp: serverTimestamp(),
                    status: "new"
                });
                
                formStatus.className = 'form-status success';
                formStatus.innerText = 'Message sent successfully! I will get back to you soon.';
                contactForm.reset();
                
            } catch (error) {
                console.error("Error adding document: ", error);
                
                // Provide a helpful error if config is missing
                if(error.code === 'invalid-argument' || error.message.includes('API key')) {
                    formStatus.className = 'form-status error';
                    formStatus.innerText = 'System Error: Firebase is not configured. Please add your config in firebase-config.js.';
                } else {
                    formStatus.className = 'form-status error';
                    formStatus.innerText = 'Failed to send message. Please try again later.';
                }
            } finally {
                // Re-enable button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    // Reset inline style so classes work again later
                    setTimeout(() => formStatus.style.display = '', 100); 
                }, 5000);
            }
        });
    }
});

// i-Pro Solutions Website JavaScript - Fixed Navigation and Pricing Issues

class iPProWebsite {
    constructor() {
        this.currentPage = 'home';
        this.selectedPlan = null;
        this.currentFormStep = 1;
        this.formData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeParticles();
        this.setupScrollAnimations();
        this.setupMobileMenu();
        this.initializePage();
        this.setupPricingPlanSelection();
        this.setupPricingForm();
        this.fixWhyChooseUsSection();
        
        console.log('Website initialized successfully');
    }

    // Fix Why Choose Us section visibility issues
    fixWhyChooseUsSection() {
        const whyChooseSection = document.querySelector('.why-choose-us');
        if (whyChooseSection) {
            // Ensure the section is always visible
            whyChooseSection.style.display = 'block';
            whyChooseSection.style.visibility = 'visible';
            whyChooseSection.style.overflow = 'visible';
            whyChooseSection.style.position = 'relative';
            whyChooseSection.style.zIndex = '2';
            
            // Force layout recalculation
            setTimeout(() => {
                whyChooseSection.style.opacity = '1';
                whyChooseSection.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    setupPricingPlanSelection() {
        // Remove any auto-selection from pricing cards
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.remove('selected', 'featured');
            
            // Ensure popular card doesn't have auto-selection styling
            if (card.classList.contains('popular-card')) {
                card.style.transform = 'none';
                card.style.borderColor = 'var(--color-card-border)';
            }
        });

        // Add click handlers for pricing plan selection
        document.querySelectorAll('.pricing-select-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = button.closest('.pricing-card');
                const planType = card.getAttribute('data-plan');
                const planPrice = card.getAttribute('data-price');
                const planName = card.querySelector('h3').textContent;

                this.selectPricingPlan(card, planType, planName, planPrice);
            });
        });

        // Add click handlers to entire pricing cards as well
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on the button
                if (e.target.closest('.pricing-select-btn')) return;
                
                const planType = card.getAttribute('data-plan');
                const planPrice = card.getAttribute('data-price');
                const planName = card.querySelector('h3').textContent;

                this.selectPricingPlan(card, planType, planName, planPrice);
            });
        });
    }

    selectPricingPlan(card, planType, planName, planPrice) {
        // Remove selection from all cards
        document.querySelectorAll('.pricing-card').forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.pricing-select-btn');
            if (btn) {
                btn.textContent = 'Select Plan';
                btn.classList.remove('btn--primary');
                btn.classList.add('btn--outline');
            }
        });

        // Mark selected card
        card.classList.add('selected');
        const button = card.querySelector('.pricing-select-btn');
        if (button) {
            button.textContent = 'Selected ✓';
            button.classList.remove('btn--outline');
            button.classList.add('btn--primary');
        }

        // Store selected plan data
        this.selectedPlan = {
            type: planType,
            name: planName,
            price: planPrice,
            priceFormatted: `₹${parseInt(planPrice).toLocaleString()}`
        };

        // Add selection animation
        card.style.animation = 'planSelected 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
            card.style.animation = '';
        }, 600);

        // Show the detailed form modal after a brief delay
        setTimeout(() => {
            this.showPricingModal();
        }, 300);
    }

    showPricingModal() {
        if (!this.selectedPlan) return;

        const modal = document.getElementById('pricing-modal');
        const title = document.getElementById('selected-plan-title');
        
        if (modal && title) {
            title.textContent = `${this.selectedPlan.name} - ${this.selectedPlan.priceFormatted}`;
            
            // Reset form
            this.currentFormStep = 1;
            this.formData = {};
            this.updateFormStep();
            this.clearForm();
            
            // Update summary
            this.updateOrderSummary();
            
            modal.classList.remove('hidden');
            
            // Focus management
            setTimeout(() => {
                const firstInput = modal.querySelector('input, select');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    setupPricingForm() {
        // Setup form navigation
        const nextBtn = document.getElementById('next-step');
        const prevBtn = document.getElementById('prev-step');
        const submitBtn = document.getElementById('submit-application');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextFormStep();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevFormStep();
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitPricingForm();
            });
        }

        // Setup modal close
        const closeBtn = document.getElementById('pricing-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hidePricingModal();
            });
        }

        // Close on backdrop click
        const modal = document.getElementById('pricing-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hidePricingModal();
                }
            });
        }

        // Setup form validation
        this.setupPricingFormValidation();
    }

    nextFormStep() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.saveCurrentStepData();
        
        if (this.currentFormStep < 3) {
            this.currentFormStep++;
            this.updateFormStep();
            
            if (this.currentFormStep === 3) {
                this.updateOrderSummary();
            }
        }
    }

    prevFormStep() {
        if (this.currentFormStep > 1) {
            this.currentFormStep--;
            this.updateFormStep();
        }
    }

    updateFormStep() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < this.currentFormStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === this.currentFormStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        // Update form steps
        document.querySelectorAll('.form-step').forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum === this.currentFormStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const submitBtn = document.getElementById('submit-application');

        if (prevBtn) {
            prevBtn.style.display = this.currentFormStep > 1 ? 'block' : 'none';
        }

        if (nextBtn && submitBtn) {
            if (this.currentFormStep === 3) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
            }
        }
    }

    validateCurrentStep() {
        const currentStep = document.querySelector(`.form-step[data-step="${this.currentFormStep}"]`);
        if (!currentStep) return false;

        const requiredFields = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('Please fill in all required fields correctly', 'error');
        }

        return allValid;
    }

    saveCurrentStepData() {
        const currentStep = document.querySelector(`.form-step[data-step="${this.currentFormStep}"]`);
        if (!currentStep) return;

        const fields = currentStep.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (field.type === 'file') {
                if (field.files.length > 0) {
                    this.formData[field.name] = field.files[0];
                }
            } else {
                this.formData[field.name] = field.value;
            }
        });
    }

    updateOrderSummary() {
        if (!this.selectedPlan) return;

        const summaryPlan = document.getElementById('summary-plan');
        const summaryPrice = document.getElementById('summary-price');
        const summaryTotal = document.getElementById('summary-total');
        const summaryTrademark = document.getElementById('summary-trademark');
        const summaryCategory = document.getElementById('summary-category');
        const summaryContact = document.getElementById('summary-contact');

        if (summaryPlan) summaryPlan.textContent = this.selectedPlan.name;
        if (summaryPrice) summaryPrice.textContent = this.selectedPlan.priceFormatted;
        if (summaryTotal) summaryTotal.textContent = this.selectedPlan.priceFormatted;

        // Update dynamic fields from form data
        if (summaryTrademark) summaryTrademark.textContent = this.formData.trademarkName || '-';
        if (summaryCategory) summaryCategory.textContent = this.formData.businessCategory || '-';
        if (summaryContact) summaryContact.textContent = 
            `${this.formData.fullName || '-'} (${this.formData.email || '-'})`;
    }

    setupPricingFormValidation() {
        const form = document.getElementById('pricing-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
                
                // Real-time update for step 2 fields
                if (this.currentFormStep === 2) {
                    this.saveCurrentStepData();
                }
            });
        });
    }

    submitPricingForm() {
        // Validate final step
        if (!this.validateCurrentStep()) {
            return;
        }

        // Check terms agreement
        const termsCheckbox = document.getElementById('terms-agreement');
        if (!termsCheckbox || !termsCheckbox.checked) {
            this.showNotification('Please agree to the Terms & Conditions', 'error');
            return;
        }

        // Save final step data
        this.saveCurrentStepData();

        // Show loading state
        const submitBtn = document.getElementById('submit-application');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                    Submitting Application...
                </span>
            `;
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Reset button
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Hide pricing modal
                this.hidePricingModal();

                // Show success modal
                this.showModal(
                    'Application Submitted Successfully!', 
                    `Thank you for choosing ${this.selectedPlan.name}! Our team will contact you within 24 hours to begin your trademark registration process. You will receive a confirmation email shortly with next steps.`
                );

                // Reset selected plan
                this.resetPricingSelection();

            }, 3000);
        }
    }

    hidePricingModal() {
        const modal = document.getElementById('pricing-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    resetPricingSelection() {
        // Reset all pricing cards
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.remove('selected');
            const button = card.querySelector('.pricing-select-btn');
            if (button) {
                button.textContent = 'Select Plan';
                button.classList.remove('btn--primary');
                button.classList.add('btn--outline');
            }
        });

        this.selectedPlan = null;
    }

    clearForm() {
        const form = document.getElementById('pricing-form');
        if (form) {
            const fields = form.querySelectorAll('input, select, textarea');
            fields.forEach(field => {
                if (field.type !== 'checkbox') {
                    field.value = '';
                }
                field.classList.remove('error', 'success');
            });
            
            // Clear error messages
            form.querySelectorAll('.field-error').forEach(error => error.remove());
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation links - FIXED with better event handling
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.getAttribute('data-page');
                console.log('Navigation clicked:', page);
                this.showPage(page);
            });
        });

        // Logo click to go home - FIXED
        const logo = document.querySelector('.nav__logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Logo clicked - going to home');
                this.showPage('home');
            });
        }

        // Free audit button - Fixed
        const freeAuditBtn = document.getElementById('free-audit-btn');
        if (freeAuditBtn) {
            freeAuditBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('contact');
                // Scroll to audit form after page loads
                setTimeout(() => {
                    const auditForm = document.getElementById('audit-form');
                    if (auditForm) {
                        auditForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 500);
            });
        }

        // Forms
        this.setupForms();

        // Modal
        this.setupModal();

        // Add counter animations for stats
        this.setupStatsAnimation();
        
        console.log('Event listeners setup complete');
    }

    setupStatsAnimation() {
        // Animate stats counters when they come into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.classList.contains('animated')) {
                        this.animateNumber(statNumber);
                        statNumber.classList.add('animated');
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-card').forEach(card => {
            statsObserver.observe(card);
        });
    }

    animateNumber(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d,]/g, '');
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayNumber = Math.floor(current);
            if (displayNumber >= 1000) {
                displayNumber = displayNumber.toLocaleString();
            }
            
            element.textContent = displayNumber + suffix;
        }, duration / steps);
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        
        // Hide all pages first
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Show new page
        const targetPageId = `${pageId}-page`;
        const newPage = document.getElementById(targetPageId);
        
        console.log('Looking for page:', targetPageId);
        
        if (newPage) {
            console.log('Found page, showing it');
            newPage.style.display = 'block';
            newPage.classList.add('active');
            this.currentPage = pageId;
            
            // Update active nav link
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Find and activate the correct nav link
            const activeLink = document.querySelector(`.nav__link[data-page="${pageId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                console.log('Updated active nav link');
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Trigger animations for the new page
            setTimeout(() => {
                this.animatePageElements(newPage);
                
                // Special handling for services page
                if (pageId === 'services') {
                    console.log('Initializing services page animations');
                    this.initializeServicesPageAnimations();
                }

                // Fix Why Choose Us section when navigating to home
                if (pageId === 'home') {
                    setTimeout(() => {
                        this.fixWhyChooseUsSection();
                    }, 200);
                }
            }, 100);
            
            console.log('Successfully switched to page:', pageId);
        } else {
            console.error('Page not found:', targetPageId);
        }
    }

    initializeServicesPageAnimations() {
        console.log('Initializing services page animations');
        
        // Animate process steps
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px) scale(0.9)';
            
            setTimeout(() => {
                step.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0) scale(1)';
            }, index * 200);
        });

        // Animate service items with stagger effect
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) rotateX(45deg)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) rotateX(0deg)';
            }, index * 50);
        });

        // Animate testimonial cards
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) scale(0.95)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 1000 + (index * 300));
        });
    }

    animatePageElements(page) {
        const elements = page.querySelectorAll('.service-card, .benefit-card, .founder-card, .setup-card, .pricing-card, .form-section, .stat-card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }

    initializeParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Create particles with enhanced animation
        for (let i = 0; i < 60; i++) {
            this.createParticle(particlesContainer);
        }

        // Continuously create new particles
        setInterval(() => {
            this.createParticle(particlesContainer);
        }, 1500);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and size
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 3 + 2) + 'px';
        particle.style.height = particle.style.width;
        
        // Random animation properties
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Random color variation
        const hue = Math.random() * 60 + 30; // Yellow to orange range
        particle.style.background = `hsl(${hue}, 80%, 65%)`;
        particle.style.boxShadow = `0 0 ${Math.random() * 15 + 5}px hsl(${hue}, 80%, 65%)`;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll');
                    
                    // Add special animations for specific elements
                    if (entry.target.classList.contains('pricing-card')) {
                        this.animatePricingCard(entry.target);
                    }
                    
                    if (entry.target.classList.contains('service-section')) {
                        this.animateServiceSection(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const animateElements = document.querySelectorAll('.service-card, .benefit-card, .about-section, .pricing-card, .service-section, .testimonial-card, .process-step');
        animateElements.forEach(el => observer.observe(el));
    }

    animatePricingCard(card) {
        const features = card.querySelectorAll('.features-list li');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    feature.style.transform = 'translateX(0)';
                }, 150);
            }, index * 100);
        });
    }

    animateServiceSection(section) {
        const items = section.querySelectorAll('.service-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 200);
            }, index * 50);
        });
    }

    setupMobileMenu() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Close menu when clicking on a link
            menu.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                }
            });
        }
    }

    setupForms() {
        // General contact form
        const generalForm = document.getElementById('general-form');
        if (generalForm) {
            generalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(generalForm, 'general');
            });
        }

        // Free audit form
        const auditForm = document.getElementById('audit-form');
        if (auditForm) {
            auditForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(auditForm, 'audit');
            });
        }

        // Track status form
        const trackForm = document.getElementById('track-form');
        if (trackForm) {
            trackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStatusTracking(trackForm);
            });
        }

        // Form validation with enhanced UX
        this.setupFormValidation();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            // Enhanced focus effects
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 4px rgba(25, 118, 210, 0.15)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        // Remove existing error elements
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
        } else {
            field.classList.add('error');
            field.classList.remove('success');
            
            if (message) {
                const errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.style.cssText = `
                    color: var(--color-error);
                    font-size: var(--font-size-xs);
                    margin-top: var(--space-4);
                    animation: slideDown 0.3s ease-out;
                `;
                errorElement.textContent = message;
                field.parentNode.appendChild(errorElement);
            }
        }
    }

    handleFormSubmission(form, type) {
        // Validate all required fields
        const requiredFields = form.querySelectorAll('input[required], textarea[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('Please correct the errors in the form', 'error');
            return;
        }

        // Enhanced loading state
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.textContent;
            submitButton.classList.add('loading');
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                    Submitting...
                </span>
            `;
            submitButton.disabled = true;

            // Simulate form submission with realistic delay
            setTimeout(() => {
                // Reset button
                submitButton.classList.remove('loading');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;

                // Clear form with animation
                this.clearFormWithAnimation(form);

                // Show success message
                if (type === 'audit') {
                    this.showModal('Request Submitted!', 'Thank you for requesting a free trademark audit. Our team will contact you within 24 hours with a comprehensive analysis.');
                } else {
                    this.showModal('Message Sent!', 'Thank you for your inquiry. We will get back to you shortly with the information you need.');
                }

                // Add success animation to form
                form.style.animation = 'formSuccess 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => {
                    form.style.animation = '';
                }, 800);

            }, 2500);
        }
    }

    clearFormWithAnimation(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach((field, index) => {
            setTimeout(() => {
                field.style.transform = 'scale(0.98)';
                field.style.opacity = '0.7';
                
                setTimeout(() => {
                    field.value = '';
                    field.style.transform = 'scale(1)';
                    field.style.opacity = '1';
                    field.classList.remove('success', 'error');
                }, 100);
            }, index * 50);
        });
        
        // Clear error messages
        form.querySelectorAll('.field-error').forEach(error => error.remove());
    }

    handleStatusTracking(form) {
        const appNumber = form.querySelector('#application-number').value.trim();
        const email = form.querySelector('#email-track').value.trim();

        if (!appNumber || !email) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate application number format
        if (appNumber.length < 5) {
            this.showNotification('Please enter a valid application number', 'error');
            return;
        }

        // Enhanced loading state
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            const originalText = submitButton.textContent;
            submitButton.classList.add('loading');
            submitButton.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <span style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                    Searching Database...
                </span>
            `;
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;

                // Generate mock status data
                const statusData = this.generateMockStatus(appNumber);
                this.displayStatus(statusData);
            }, 2000);
        }
    }

    generateMockStatus(appNumber) {
        const statuses = ['filed', 'examination', 'published', 'registered'];
        const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const baseDate = new Date();
        baseDate.setMonth(baseDate.getMonth() - 6);

        return {
            applicationNumber: appNumber,
            status: currentStatus,
            filedDate: this.formatDate(new Date(baseDate.getTime())),
            examinationDate: currentStatus !== 'filed' ? this.formatDate(new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000)) : '',
            publicationDate: ['published', 'registered'].includes(currentStatus) ? this.formatDate(new Date(baseDate.getTime() + 120 * 24 * 60 * 60 * 1000)) : '',
            registrationDate: currentStatus === 'registered' ? this.formatDate(new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000)) : ''
        };
    }

    formatDate(date) {
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    displayStatus(statusData) {
        const resultContainer = document.getElementById('status-result');
        const statusBadge = document.getElementById('status-badge');
        const appNumberElement = document.getElementById('result-app-number');
        
        if (!resultContainer || !statusBadge || !appNumberElement) {
            console.error('Status display elements not found');
            return;
        }
        
        // Update application number
        appNumberElement.textContent = statusData.applicationNumber;
        
        // Update status badge
        statusBadge.textContent = this.getStatusText(statusData.status);
        statusBadge.className = `status-badge ${statusData.status}`;
        
        // Update timeline with enhanced animations
        this.updateTimeline(statusData);
        
        // Show result with enhanced animation
        resultContainer.style.display = 'block';
        resultContainer.style.opacity = '0';
        resultContainer.style.transform = 'translateY(30px) scale(0.95)';
        
        setTimeout(() => {
            resultContainer.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            resultContainer.style.opacity = '1';
            resultContainer.style.transform = 'translateY(0) scale(1)';
            
            setTimeout(() => {
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
        }, 100);
    }

    getStatusText(status) {
        const statusTexts = {
            'filed': 'Application Filed',
            'examination': 'Under Examination',
            'published': 'Published for Opposition',
            'registered': 'Registered'
        };
        return statusTexts[status] || 'Unknown Status';
    }

    updateTimeline(statusData) {
        const timelineItems = [
            { key: 'filed', elementId: 'examination-item', dateId: 'filed-date' },
            { key: 'examination', elementId: 'examination-item', dateId: 'examination-date' },
            { key: 'published', elementId: 'publication-item', dateId: 'publication-date' },
            { key: 'registered', elementId: 'registration-item', dateId: 'registration-date' }
        ];
        
        const statusOrder = ['filed', 'examination', 'published', 'registered'];
        const currentIndex = statusOrder.indexOf(statusData.status);
        
        timelineItems.forEach((item, index) => {
            const element = document.getElementById(item.elementId);
            const dateElement = document.getElementById(item.dateId);
            
            if (element) {
                setTimeout(() => {
                    if (index <= currentIndex) {
                        element.classList.add('completed');
                    } else {
                        element.classList.remove('completed');
                    }
                }, index * 300);
            }
            
            if (dateElement) {
                const dateKey = `${item.key}Date`;
                setTimeout(() => {
                    if (statusData[dateKey] && index <= currentIndex) {
                        dateElement.textContent = statusData[dateKey];
                    } else {
                        dateElement.textContent = 'Pending';
                    }
                }, index * 300);
            }
        });

        // Update next steps
        const nextStepsText = document.getElementById('next-steps-text');
        if (nextStepsText) {
            const nextSteps = {
                'filed': 'Your application is now being processed by the trademark office. Examination typically begins within 3-4 months.',
                'examination': 'Your application is under review. If any objections arise, we will handle them for you.',
                'published': 'Your application is published for opposition. If no objections are raised in 4 months, registration will proceed.',
                'registered': 'Congratulations! Your trademark is now officially registered. Your certificate will be issued shortly.'
            };
            
            setTimeout(() => {
                nextStepsText.textContent = nextSteps[statusData.status] || 'Please contact us for more information.';
            }, 1000);
        }
    }

    setupModal() {
        const modal = document.getElementById('success-modal');
        const closeBtn = document.getElementById('modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Close modal on backdrop click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (modal && !modal.classList.contains('hidden')) {
                    this.hideModal();
                }
                const pricingModal = document.getElementById('pricing-modal');
                if (pricingModal && !pricingModal.classList.contains('hidden')) {
                    this.hidePricingModal();
                }
            }
        });
    }

    showModal(title, message) {
        const modal = document.getElementById('success-modal');
        const titleElement = document.getElementById('modal-title');
        const messageElement = document.getElementById('modal-message');
        
        if (modal && titleElement && messageElement) {
            titleElement.textContent = title;
            messageElement.textContent = message;
            modal.classList.remove('hidden');
            
            // Enhanced modal animation
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.transition = 'opacity 0.3s ease-out';
                modal.style.opacity = '1';
            }, 10);
            
            // Focus management for accessibility
            setTimeout(() => {
                const closeBtn = document.getElementById('modal-close');
                if (closeBtn) closeBtn.focus();
            }, 100);
        }
    }

    hideModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.transition = 'opacity 0.3s ease-out';
            modal.style.opacity = '0';
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.style.opacity = '';
                modal.style.transition = '';
            }, 300);
        }
    }

    showNotification(message, type = 'info') {
        // Create enhanced notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(145deg, var(--color-surface), #FAFBFF);
            border: 2px solid var(--color-border);
            border-left: 6px solid var(--color-${type === 'error' ? 'error' : 'success'});
            padding: var(--space-20);
            border-radius: var(--radius-lg);
            box-shadow: 0 15px 50px rgba(25, 118, 210, 0.15);
            z-index: 1500;
            max-width: 350px;
            animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            color: var(--color-text);
            font-weight: var(--font-weight-medium);
            backdrop-filter: blur(10px);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }

    initializePage() {
        console.log('Initializing page...');
        
        // Ensure home page is shown by default
        this.showPage('home');
        
        // Add enhanced initial animations
        setTimeout(() => {
            const heroContent = document.querySelector('.hero__content');
            if (heroContent && this.currentPage === 'home') {
                heroContent.style.opacity = '0';
                heroContent.style.transform = 'translateY(50px) scale(0.9)';
                
                setTimeout(() => {
                    heroContent.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                    heroContent.style.opacity = '1';
                    heroContent.style.transform = 'translateY(0) scale(1)';
                }, 200);
            }
        }, 300);

        // Initialize parallax effect for background elements
        this.initializeParallaxEffect();

        // Fix Why Choose Us section on initial load
        setTimeout(() => {
            this.fixWhyChooseUsSection();
        }, 500);
        
        console.log('Page initialization complete');
    }

    initializeParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.ppt-background, .ppt-grid-background');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Add enhanced CSS animations via JavaScript
const enhancedStyles = `
@keyframes planSelected {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 25px 70px rgba(25, 118, 210, 0.3); }
    100% { transform: scale(1.02); }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes slideDown {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes formSuccess {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

.form-control.error {
    border-color: var(--color-error);
    box-shadow: 0 0 0 4px rgba(var(--color-error-rgb), 0.1);
    animation: shake 0.5s ease-in-out;
}

.form-control.success {
    border-color: var(--color-success);
    box-shadow: 0 0 0 4px rgba(var(--color-success-rgb), 0.1);
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Smooth page transitions */
.page {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.page.active {
    animation: pageEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pageEnter {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
`;

// Add the enhanced styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = enhancedStyles;
document.head.appendChild(styleElement);

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing fixed website...');
    
    try {
        const website = new iPProWebsite();
        
        // Add enhanced contact info click handlers
        document.querySelectorAll('.contact-item').forEach(item => {
            const text = item.textContent;
            if (text.includes('@')) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    const email = text.split(': ')[1];
                    window.open(`mailto:${email}`, '_blank');
                });
            } else if (text.includes('+91')) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    const phone = text.split(': ')[1];
                    window.open(`tel:${phone}`, '_blank');
                });
            }
        });

        // Add setup CTA button functionality
        document.querySelectorAll('.setup-cta .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                website.showPage('contact');
            });
        });

        // Add smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        console.log('Fixed website initialized successfully');
        
    } catch (error) {
        console.error('Error initializing website:', error);
    }
});
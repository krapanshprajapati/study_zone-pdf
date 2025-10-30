// Main JavaScript for Study Zone Website - Exam Wise Structure

// Loading Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 2000);
});

// Initialize page functions
function initializePage() {
    // Set current year in footer
    const footer = document.querySelector('.footer-bottom p');
    if (footer) {
        footer.innerHTML = `© ${new Date().getFullYear()} Study Zone - Competitive Exam Portal | सभी अधिकार सुरक्षित`;
    }
    
    // Update user interface
    if (typeof auth !== 'undefined') {
        auth.updateUI();
    }
    
    // Initialize Quick Exam Guide
    initializeQuickExamGuide();
    
    console.log('Study Zone Website Initialized - Exam Wise Structure');
}

// Quick Exam Guide Data
const examGuideData = {
    'ssc': {
        title: 'SSC Exams Complete Guide',
        icon: 'fas fa-graduation-cap',
        description: 'Staff Selection Commission - Government Recruitment Exams',
        exams: [
            {
                name: 'SSC CGL',
                fullForm: 'Combined Graduate Level',
                eligibility: 'Graduation',
                age: '18-32 years',
                stages: 'Tier 1, Tier 2, Tier 3, Tier 4',
                subjects: 'Math, Reasoning, English, GK',
                salary: '₹25,000 - ₹1,50,000',
                popularity: 'Very High'
            },
            {
                name: 'SSC CHSL',
                fullForm: 'Combined Higher Secondary Level',
                eligibility: '12th Pass',
                age: '18-27 years',
                stages: 'Tier 1, Tier 2, Tier 3',
                subjects: 'Math, Reasoning, English, GK',
                salary: '₹19,000 - ₹81,000',
                popularity: 'High'
            },
            {
                name: 'SSC MTS',
                fullForm: 'Multi-Tasking Staff',
                eligibility: '10th Pass',
                age: '18-25 years',
                stages: 'Computer Based Test',
                subjects: 'General Intelligence, Numerical Aptitude, English, General Awareness',
                salary: '₹18,000 - ₹56,900',
                popularity: 'Medium'
            },
            {
                name: 'SSC GD',
                fullForm: 'General Duty Constable',
                eligibility: '10th Pass',
                age: '18-23 years',
                stages: 'CBT, PET, PST, Medical',
                subjects: 'General Knowledge, Reasoning, Elementary Math, English/Hindi',
                salary: '₹21,700 - ₹69,100',
                popularity: 'High'
            }
        ],
        preparationTips: [
            'Focus on speed and accuracy in Quantitative Aptitude',
            'Practice previous year papers regularly',
            'Read newspapers daily for General Awareness',
            'Learn shortcut methods for calculations',
            'Take mock tests every week'
        ],
        importantDates: {
            notification: 'March-April',
            application: 'April-May',
            exam: 'June-July',
            result: 'August-September'
        }
    },
    'railway': {
        title: 'Railway Exams Guide',
        icon: 'fas fa-train',
        description: 'Indian Railway Recruitment Board Exams',
        exams: [
            {
                name: 'RRB NTPC',
                fullForm: 'Non-Technical Popular Categories',
                eligibility: 'Graduation/12th/10th',
                age: '18-33 years',
                stages: 'CBT 1, CBT 2, Typing Test, Document Verification',
                subjects: 'Math, Reasoning, General Awareness, General Science',
                salary: '₹19,900 - ₹35,400',
                popularity: 'Very High'
            },
            {
                name: 'RRB Group D',
                fullForm: 'Group D Posts',
                eligibility: '10th Pass/ITI',
                age: '18-33 years',
                stages: 'CBT, Physical Efficiency Test, Document Verification',
                subjects: 'Math, Reasoning, General Science, General Awareness',
                salary: '₹18,000 - ₹56,900',
                popularity: 'High'
            },
            {
                name: 'RRB ALP',
                fullForm: 'Assistant Loco Pilot',
                eligibility: '10th Pass + ITI/Diploma',
                age: '18-30 years',
                stages: 'CBT 1, CBT 2, Computer Based Aptitude Test',
                subjects: 'Math, Reasoning, General Science, General Awareness',
                salary: '₹19,900 - ₹35,400',
                popularity: 'Medium'
            },
            {
                name: 'RRB JE',
                fullForm: 'Junior Engineer',
                eligibility: 'Diploma/Degree in Engineering',
                age: '18-33 years',
                stages: 'CBT 1, CBT 2, Document Verification',
                subjects: 'Technical Ability, General Awareness, General Science, Math, Reasoning',
                salary: '₹35,400 - ₹1,12,400',
                popularity: 'Medium'
            }
        ],
        preparationTips: [
            'Focus on basic concepts of Mathematics',
            'Practice railway-specific general knowledge',
            'Learn about Indian railway zones and divisions',
            'Solve previous year question papers',
            'Take sectional tests regularly'
        ],
        importantDates: {
            notification: 'Throughout the year',
            application: 'Varies by post',
            exam: 'Multiple sessions',
            result: 'Within 2-3 months of exam'
        }
    },
    'mp police': {
        title: 'MP Police Exams Guide',
        icon: 'fas fa-shield-alt',
        description: 'Madhya Pradesh Police Recruitment Exams',
        exams: [
            {
                name: 'MP Police Constable',
                fullForm: 'Police Constable',
                eligibility: '12th Pass',
                age: '18-25 years',
                stages: 'Written Test, Physical Test, Medical',
                subjects: 'General Knowledge, Reasoning, Numerical Ability, Hindi',
                salary: '₹21,700 - ₹69,100',
                popularity: 'Very High'
            },
            {
                name: 'MP Police SI',
                fullForm: 'Sub Inspector',
                eligibility: 'Graduation',
                age: '21-30 years',
                stages: 'Written Test, Physical Test, Interview',
                subjects: 'General Knowledge, Reasoning, Numerical Ability, Hindi, English',
                salary: '₹35,400 - ₹1,12,400',
                popularity: 'High'
            },
            {
                name: 'MP Jail Prahari',
                fullForm: 'Jail Guard',
                eligibility: '12th Pass',
                age: '18-25 years',
                stages: 'Written Test, Physical Test',
                subjects: 'General Knowledge, Reasoning, Numerical Ability, Hindi',
                salary: '₹21,700 - ₹69,100',
                popularity: 'Medium'
            }
        ],
        preparationTips: [
            'Focus on MP-specific general knowledge',
            'Practice physical fitness regularly',
            'Learn about Indian Penal Code and Criminal Procedure Code',
            'Read MP current affairs daily',
            'Solve MP Police previous year papers'
        ],
        importantDates: {
            notification: 'Varies yearly',
            application: 'Usually 1 month after notification',
            exam: 'Within 2-3 months of application',
            result: 'Within 1-2 months of exam'
        }
    },
    'banking': {
        title: 'Banking Exams Guide',
        icon: 'fas fa-university',
        description: 'Public Sector Bank Recruitment Exams',
        exams: [
            {
                name: 'IBPS PO',
                fullForm: 'Probationary Officer',
                eligibility: 'Graduation',
                age: '20-30 years',
                stages: 'Prelims, Mains, Interview',
                subjects: 'Quantitative Aptitude, Reasoning, English, General Awareness, Computer Knowledge',
                salary: '₹38,000 - ₹68,000',
                popularity: 'Very High'
            },
            {
                name: 'IBPS Clerk',
                fullForm: 'Clerical Cadre',
                eligibility: 'Graduation',
                age: '20-28 years',
                stages: 'Prelims, Mains',
                subjects: 'Quantitative Aptitude, Reasoning, English, General Awareness, Computer Knowledge',
                salary: '₹25,000 - ₹45,000',
                popularity: 'High'
            },
            {
                name: 'SBI PO',
                fullForm: 'Probationary Officer',
                eligibility: 'Graduation',
                age: '21-30 years',
                stages: 'Prelims, Mains, Interview, Group Exercise',
                subjects: 'Quantitative Aptitude, Reasoning, English, General Awareness, Computer Knowledge',
                salary: '₹42,000 - ₹78,000',
                popularity: 'Very High'
            }
        ],
        preparationTips: [
            'Focus on calculation speed and accuracy',
            'Read economic newspapers daily',
            'Practice computer awareness topics',
            'Learn banking terminology',
            'Take full-length mock tests regularly'
        ],
        importantDates: {
            notification: 'July-August (IBPS), April-May (SBI)',
            application: '1 month after notification',
            exam: 'October-November',
            result: 'December-January'
        }
    },
    'teaching': {
        title: 'Teaching Exams Guide',
        icon: 'fas fa-chalkboard-teacher',
        description: 'Teacher Eligibility and Recruitment Exams',
        exams: [
            {
                name: 'CTET',
                fullForm: 'Central Teacher Eligibility Test',
                eligibility: 'Graduation + B.Ed',
                age: 'No age limit',
                stages: 'Paper 1 (Primary), Paper 2 (Elementary)',
                subjects: 'Child Development, Language, Mathematics, Environmental Studies',
                salary: '₹35,000 - ₹1,00,000',
                popularity: 'Very High'
            },
            {
                name: 'MP TET',
                fullForm: 'Madhya Pradesh Teacher Eligibility Test',
                eligibility: 'Graduation + B.Ed/D.Ed',
                age: '21-40 years',
                stages: 'Single Paper',
                subjects: 'Child Development, Language, Mathematics, Environmental Studies',
                salary: '₹25,000 - ₹80,000',
                popularity: 'High'
            },
            {
                name: 'UPTET',
                fullForm: 'Uttar Pradesh Teacher Eligibility Test',
                eligibility: 'Graduation + B.Ed/D.Ed',
                age: '18-35 years',
                stages: 'Paper 1, Paper 2',
                subjects: 'Child Development, Language, Mathematics, Environmental Studies',
                salary: '₹25,000 - ₹80,000',
                popularity: 'High'
            }
        ],
        preparationTips: [
            'Focus on child psychology and teaching methodologies',
            'Practice previous year question papers',
            'Learn about educational policies and schemes',
            'Develop good communication skills',
            'Understand the curriculum and syllabus thoroughly'
        ],
        importantDates: {
            notification: 'Throughout the year',
            application: 'Varies by state',
            exam: 'Multiple sessions',
            result: 'Within 2-3 months'
        }
    }
};

// Initialize Quick Exam Guide
function initializeQuickExamGuide() {
    const guideItems = document.querySelectorAll('.guide-item');
    
    guideItems.forEach(item => {
        item.addEventListener('click', function() {
            const examType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showExamGuide(examType);
        });
    });
}

// Show Exam Guide Modal
function showExamGuide(examType) {
    const guideData = examGuideData[examType];
    if (!guideData) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'exam-guide-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div class="exam-guide-content" style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <button class="close-guide" onclick="closeExamGuide()" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: var(--primary);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="guide-header" style="text-align: center; margin-bottom: 30px;">
                <div class="guide-icon" style="font-size: 4rem; color: var(--primary); margin-bottom: 15px;">
                    <i class="${guideData.icon}"></i>
                </div>
                <h2 style="color: var(--dark); margin-bottom: 10px;">${guideData.title}</h2>
                <p style="color: var(--text-light); font-size: 1.1rem;">${guideData.description}</p>
            </div>

            <div class="guide-sections">
                <!-- Exams Overview -->
                <div class="guide-section" style="margin-bottom: 30px;">
                    <h3 style="color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-list-alt"></i> Available Exams
                    </h3>
                    <div class="exams-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                        ${guideData.exams.map(exam => `
                            <div class="exam-card" style="
                                background: var(--light);
                                padding: 20px;
                                border-radius: 15px;
                                border-left: 4px solid var(--success);
                                transition: var(--transition);
                                cursor: pointer;
                            " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                                <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 15px;">
                                    <h4 style="margin: 0; color: var(--dark);">${exam.name}</h4>
                                    <span style="
                                        background: ${getPopularityColor(exam.popularity)};
                                        color: white;
                                        padding: 4px 12px;
                                        border-radius: 15px;
                                        font-size: 0.8rem;
                                        font-weight: 600;
                                    ">${exam.popularity}</span>
                                </div>
                                <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 10px;"><strong>Full Form:</strong> ${exam.fullForm}</p>
                                <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 10px;"><strong>Eligibility:</strong> ${exam.eligibility}</p>
                                <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 10px;"><strong>Age:</strong> ${exam.age}</p>
                                <p style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 10px;"><strong>Salary:</strong> ${exam.salary}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Preparation Tips -->
                <div class="guide-section" style="margin-bottom: 30px;">
                    <h3 style="color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-lightbulb"></i> Preparation Tips
                    </h3>
                    <div class="tips-grid" style="display: grid; gap: 15px;">
                        ${guideData.preparationTips.map((tip, index) => `
                            <div class="tip-item" style="
                                display: flex;
                                align-items: start;
                                gap: 15px;
                                padding: 15px;
                                background: rgba(255, 65, 108, 0.05);
                                border-radius: 10px;
                                border-left: 4px solid var(--primary);
                            ">
                                <div style="
                                    background: var(--primary);
                                    color: white;
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: bold;
                                    font-size: 0.9rem;
                                    flex-shrink: 0;
                                ">${index + 1}</div>
                                <p style="margin: 0; color: var(--dark); line-height: 1.5;">${tip}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Important Dates -->
                <div class="guide-section" style="margin-bottom: 30px;">
                    <h3 style="color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-calendar-alt"></i> Important Dates (Tentative)
                    </h3>
                    <div class="dates-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        ${Object.entries(guideData.importantDates).map(([key, value]) => `
                            <div class="date-item" style="
                                text-align: center;
                                padding: 20px;
                                background: linear-gradient(135deg, #667eea, #764ba2);
                                color: white;
                                border-radius: 10px;
                            ">
                                <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 5px;">${formatDateKey(key)}</div>
                                <div style="font-size: 1.1rem; font-weight: 600;">${value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="guide-section">
                    <h3 style="color: var(--primary); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-rocket"></i> Quick Actions
                    </h3>
                    <div class="actions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <button onclick="filterByExam('${examType}'); closeExamGuide();" style="
                            background: linear-gradient(135deg, var(--success), var(--success-dark));
                            color: white;
                            border: none;
                            padding: 15px;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: var(--transition);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="fas fa-book"></i> View Study Materials
                        </button>
                        <button onclick="redirectToPayment('${guideData.title} Package', 399); closeExamGuide();" style="
                            background: linear-gradient(135deg, var(--primary), var(--secondary));
                            color: white;
                            border: none;
                            padding: 15px;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: var(--transition);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="fas fa-shopping-cart"></i> Buy Complete Package
                        </button>
                        <button onclick="scrollToTestimonials(); closeExamGuide();" style="
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            color: white;
                            border: none;
                            padding: 15px;
                            border-radius: 10px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: var(--transition);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        " onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="fas fa-users"></i> See Success Stories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close Exam Guide
function closeExamGuide() {
    const modal = document.querySelector('.exam-guide-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Helper functions
function getPopularityColor(popularity) {
    switch (popularity.toLowerCase()) {
        case 'very high': return '#e74c3c';
        case 'high': return '#e67e22';
        case 'medium': return '#f1c40f';
        case 'low': return '#27ae60';
        default: return '#95a5a6';
    }
}

function formatDateKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function scrollToTestimonials() {
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('exam-guide-modal')) {
        closeExamGuide();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeExamGuide();
    }
});

// Redirect to payment page
function redirectToPayment(product, price) {
    // Check if user is logged in
    if (!auth.currentUser) {
        if (confirm('Please login to continue with purchase. Redirect to login page?')) {
            window.location.href = 'login.html?redirect=payment.html';
        }
        return;
    }
    
    // Store product info in localStorage
    localStorage.setItem('selectedProduct', product);
    localStorage.setItem('selectedPrice', price);
    localStorage.setItem('selectedProductDesc', getProductDescription(product));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Get product description
function getProductDescription(product) {
    const descriptions = {
        'SSC CGL Complete Pack': 'Complete preparation for SSC CGL Tier 1 & 2 - Math, Reasoning, English, GK',
        'SSC CHSL Complete': 'Tier 1 preparation with quick math tricks and reasoning shortcuts',
        'SSC MTS & GD Pack': 'General awareness and basic knowledge for SSC MTS and GD exams',
        'SSC English Special': 'Grammar, vocabulary, comprehension for all SSC exams',
        'RRB NTPC Complete': 'CBT 1 & 2 preparation with practice questions and shortcuts',
        'RRB Group D Complete': 'Science, math, reasoning for Group D CBT and PET',
        'Railway ALP & Technician': 'Technical knowledge and general awareness for ALP posts',
        'RPF SI & Constable': 'General awareness and arithmetic for RPF recruitment',
        'MP Police Constable Complete': 'General knowledge, reasoning, math for MP Police constable exam',
        'MP High Court & Group 2': 'General studies and law knowledge for MP High Court exams',
        'MP Teacher Eligibility': 'Child development, teaching methods, and subject knowledge',
        'MP Patwari & Revenue': 'Revenue laws, agriculture, and general knowledge for Patwari exam',
        'IBPS PO Complete Pack': 'Quant, reasoning, English, general awareness for IBPS PO',
        'SBI Clerk & PO': 'Prelims and mains preparation for SBI exams',
        'UPSC Prelims GS Paper 1': 'History, geography, polity, economy for UPSC prelims',
        'CTET & Teaching Exams': 'Child development, pedagogy, and subject knowledge for CTET',
        'SSC Exams Complete Guide Package': 'Complete study materials for all SSC exams - CGL, CHSL, MTS, GD',
        'Railway Exams Guide Package': 'Complete preparation materials for all railway exams',
        'MP Police Exams Guide Package': 'Complete study package for MP Police recruitment exams',
        'Banking Exams Guide Package': 'Comprehensive materials for banking sector exams',
        'Teaching Exams Guide Package': 'Complete preparation for teaching eligibility tests'
    };
    
    return descriptions[product] || 'Complete study notes for competitive exams';
}

// Filter by exam type
function filterByExam(examType) {
    const allFolders = document.querySelectorAll('.folder');
    let foundAny = false;
    
    allFolders.forEach(folder => {
        const tags = folder.getAttribute('data-tags').toLowerCase();
        if (tags.includes(examType.toLowerCase())) {
            folder.style.display = 'block';
            foundAny = true;
            
            // Scroll to the first found folder
            if (!foundAny) {
                folder.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            folder.style.display = 'none';
        }
    });
    
    // Update active nav
    updateActiveNav(examType);
    
    // Show message if no results
    if (!foundAny) {
        showNoResultsMessage(examType);
    }
}

// Show all exams
function showAllExams() {
    const allFolders = document.querySelectorAll('.folder');
    allFolders.forEach(folder => {
        folder.style.display = 'block';
    });
    
    // Reset active nav
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    navLinks[0].classList.add('active'); // Activate first nav item
}

// Update active navigation
function updateActiveNav(examType) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(examType)) {
            link.classList.add('active');
        }
    });
}

// Show no results message
function showNoResultsMessage(searchTerm) {
    // Remove existing messages
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'no-results-message';
    message.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-light);">
            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; color: var(--primary);"></i>
            <h3>No packages found for "${searchTerm}"</h3>
            <p>Try searching with different exam names or browse by categories above</p>
            <button onclick="showAllExams()" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; cursor: pointer;">
                Show All Packages
            </button>
        </div>
    `;
    
    const foldersContainer = document.querySelector('.folders');
    if (foldersContainer) {
        foldersContainer.parentNode.insertBefore(message, foldersContainer);
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Scroll to coupon section
function scrollToCoupon() {
    window.location.href = 'payment.html';
}

// Contact functions
function contactSupport() {
    const phone = '+917869952173';
    if (confirm('Call support at +91 7869952173?')) {
        window.location.href = 'tel:+917869952173';
    }
}

function emailSupport() {
    const subject = 'Study Zone Support';
    const body = 'Hello Study Zone Team,\n\nI need help with:\n\n';
    
    window.location.href = `mailto:kripanshofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openWhatsApp() {
    const message = 'Hello Study Zone Team, I need help with...';
    window.open(`https://wa.me/917869952173?text=${encodeURIComponent(message)}`, '_blank');
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const allFolders = document.querySelectorAll('.folder');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    // Search function - Exam wise search
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            if (searchResults) searchResults.classList.add('hidden');
            sections.forEach(section => {
                section.style.display = 'block';
            });
            // Show all folders
            allFolders.forEach(folder => {
                folder.style.display = 'block';
            });
            return;
        }
        
        // Hide all sections initially
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Clear previous search results
        if (searchResultsContainer) {
            searchResultsContainer.innerHTML = '';
        }
        
        // Filter folders based on search term
        let foundResults = false;
        
        allFolders.forEach(folder => {
            const title = folder.getAttribute('data-title').toLowerCase();
            const desc = folder.getAttribute('data-desc').toLowerCase();
            const tags = folder.getAttribute('data-tags').toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm)) {
                const folderClone = folder.cloneNode(true);
                if (searchResultsContainer) {
                    searchResultsContainer.appendChild(folderClone);
                }
                foundResults = true;
            }
        });
        
        // Show search results
        if (searchResults) {
            searchResults.classList.remove('hidden');
        }
        
        // If no results found
        if (!foundResults && searchResultsContainer) {
            searchResultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No packages found for "${searchTerm}"</h3>
                    <p>Try searching with different exam names like: SSC CGL, Railway NTPC, MP Police, etc.</p>
                    <button onclick="showAllExams()" style="background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; cursor: pointer;">
                        Browse All Exams
                    </button>
                </div>
            `;
        }
    }
    
    // Event listeners for search
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});
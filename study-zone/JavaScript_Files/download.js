// Download JavaScript for Study Zone

const BACKEND_URL = 'https://your-backend-url.onrender.com'; // Replace with your backend URL

// Exam data with chapters
const exams = {
    ssc: {
        title: "SSC Exams Complete Package",
        icon: "fas fa-graduation-cap",
        desc: "Complete notes for SSC CGL, CHSL, MTS, GD exams with math, reasoning, English and GK.",
        chapters: [
            {
                title: "Quantitative Aptitude",
                desc: "Complete math formulas, shortcuts and practice questions for SSC exams.",
                icon: "fas fa-calculator",
                file: "ssc_quantitative_aptitude.pdf",
                pages: 45,
                size: "4.2 MB"
            },
            {
                title: "General Intelligence & Reasoning",
                desc: "Verbal and non-verbal reasoning concepts with solved examples.",
                icon: "fas fa-brain",
                file: "ssc_reasoning.pdf",
                pages: 38,
                size: "3.6 MB"
            },
            {
                title: "English Language",
                desc: "Grammar rules, vocabulary, comprehension and error detection.",
                icon: "fas fa-language",
                file: "ssc_english.pdf",
                pages: 42,
                size: "3.9 MB"
            },
            {
                title: "General Awareness",
                desc: "Current affairs, history, geography, polity and science for SSC.",
                icon: "fas fa-globe-asia",
                file: "ssc_general_awareness.pdf",
                pages: 50,
                size: "4.7 MB"
            },
            {
                title: "Computer Knowledge",
                desc: "Basic computer concepts and MS Office for SSC exams.",
                icon: "fas fa-laptop-code",
                file: "ssc_computer.pdf",
                pages: 28,
                size: "2.6 MB"
            }
        ]
    },
    railway: {
        title: "Railway Exams Complete Package",
        icon: "fas fa-train",
        desc: "Complete preparation for RRB NTPC, Group D, ALP, and other railway exams.",
        chapters: [
            {
                title: "Mathematics",
                desc: "Number system, algebra, geometry, and arithmetic for railway exams.",
                icon: "fas fa-square-root-alt",
                file: "railway_math.pdf",
                pages: 40,
                size: "3.8 MB"
            },
            {
                title: "General Intelligence & Reasoning",
                desc: "Analogy, classification, series, and logical reasoning.",
                icon: "fas fa-project-diagram",
                file: "railway_reasoning.pdf",
                pages: 35,
                size: "3.3 MB"
            },
            {
                title: "General Science",
                desc: "Physics, chemistry, biology and environmental science.",
                icon: "fas fa-flask",
                file: "railway_science.pdf",
                pages: 38,
                size: "3.6 MB"
            },
            {
                title: "General Awareness",
                desc: "Current affairs, Indian history, geography, and polity.",
                icon: "fas fa-newspaper",
                file: "railway_gk.pdf",
                pages: 45,
                size: "4.2 MB"
            }
        ]
    },
    'mp-exams': {
        title: "MP State Exams Package",
        icon: "fas fa-landmark",
        desc: "Complete notes for MP Police, Teacher, Patwari, and other MP state exams.",
        chapters: [
            {
                title: "General Knowledge - MP Specific",
                desc: "MP geography, history, culture, economy and current affairs.",
                icon: "fas fa-map-marker-alt",
                file: "mp_gk.pdf",
                pages: 35,
                size: "3.3 MB"
            },
            {
                title: "General Hindi",
                desc: "Hindi grammar, comprehension and vocabulary for MP exams.",
                icon: "fas fa-language",
                file: "mp_hindi.pdf",
                pages: 30,
                size: "2.8 MB"
            },
            {
                title: "Mathematics & Reasoning",
                desc: "Basic math and reasoning for MP state government exams.",
                icon: "fas fa-calculator",
                file: "mp_math_reasoning.pdf",
                pages: 32,
                size: "3.0 MB"
            },
            {
                title: "Computer Knowledge",
                desc: "Computer fundamentals and MS Office for MP exams.",
                icon: "fas fa-desktop",
                file: "mp_computer.pdf",
                pages: 25,
                size: "2.4 MB"
            }
        ]
    },
    banking: {
        title: "Banking Exams Package",
        icon: "fas fa-university",
        desc: "Complete preparation for IBPS, SBI, RBI and other banking exams.",
        chapters: [
            {
                title: "Quantitative Aptitude",
                desc: "Advanced math concepts and shortcuts for banking exams.",
                icon: "fas fa-chart-line",
                file: "banking_quant.pdf",
                pages: 48,
                size: "4.5 MB"
            },
            {
                title: "Reasoning Ability",
                desc: "Puzzles, seating arrangement and logical reasoning.",
                icon: "fas fa-puzzle-piece",
                file: "banking_reasoning.pdf",
                pages: 42,
                size: "3.9 MB"
            },
            {
                title: "English Language",
                desc: "Advanced grammar, vocabulary and reading comprehension.",
                icon: "fas fa-book",
                file: "banking_english.pdf",
                pages: 45,
                size: "4.2 MB"
            },
            {
                title: "Banking Awareness",
                desc: "Banking terms, RBI functions and financial awareness.",
                icon: "fas fa-piggy-bank",
                file: "banking_awareness.pdf",
                pages: 38,
                size: "3.6 MB"
            },
            {
                title: "Computer Awareness",
                desc: "Computer networks, DBMS and cybersecurity for banking.",
                icon: "fas fa-database",
                file: "banking_computer.pdf",
                pages: 32,
                size: "3.0 MB"
            }
        ]
    },
    'other-exams': {
        title: "Other Competitive Exams",
        icon: "fas fa-book",
        desc: "Notes for UPSC, Teaching, Defense and other competitive exams.",
        chapters: [
            {
                title: "General Studies Paper 1",
                desc: "History, geography, Indian polity and governance.",
                icon: "fas fa-landmark",
                file: "upsc_gs1.pdf",
                pages: 55,
                size: "5.1 MB"
            },
            {
                title: "General Studies Paper 2",
                desc: "Governance, constitution, and international relations.",
                icon: "fas fa-gavel",
                file: "upsc_gs2.pdf",
                pages: 48,
                size: "4.5 MB"
            },
            {
                title: "Child Development & Pedagogy",
                desc: "For CTET and teaching eligibility tests.",
                icon: "fas fa-child",
                file: "ctet_cdp.pdf",
                pages: 35,
                size: "3.3 MB"
            }
        ]
    }
};

// Track downloaded chapters
let downloadedChapters = JSON.parse(localStorage.getItem('downloadedChapters')) || {};
let currentExam = 'ssc';

// Initialize the page
function initPage() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1500);

    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    
    if (paymentSuccess === 'success') {
        showPaymentSuccess();
    }

    // Get exam from URL parameter or localStorage
    const examParam = urlParams.get('exam');
    const productParam = urlParams.get('product');
    
    if (examParam && exams[examParam]) {
        currentExam = examParam;
    } else if (productParam) {
        // Map product names to exams
        const productMap = {
            'SSC CGL Complete Pack': 'ssc',
            'SSC CHSL Complete': 'ssc',
            'SSC MTS & GD Pack': 'ssc',
            'SSC English Special': 'ssc',
            'RRB NTPC Complete': 'railway',
            'RRB Group D Complete': 'railway',
            'Railway ALP & Technician': 'railway',
            'RPF SI & Constable': 'railway',
            'MP Police Constable Complete': 'mp-exams',
            'MP High Court & Group 2': 'mp-exams',
            'MP Teacher Eligibility': 'mp-exams',
            'MP Patwari & Revenue': 'mp-exams',
            'IBPS PO Complete Pack': 'banking',
            'SBI Clerk & PO': 'banking',
            'UPSC Prelims GS Paper 1': 'other-exams',
            'CTET & Teaching Exams': 'other-exams'
        };
        currentExam = productMap[productParam] || 'ssc';
    }
    
    loadExam(currentExam);
    updateProgress();
    updateStats();
    
    // Set current year in footer
    const footer = document.querySelector('.footer-bottom p');
    if (footer) {
        footer.innerHTML = `© ${new Date().getFullYear()} Study Zone - Competitive Exam Portal | सभी अधिकार सुरक्षित`;
    }
}

// Show payment success banner
function showPaymentSuccess() {
    const successBanner = document.getElementById('paymentSuccess');
    if (successBanner) {
        successBanner.classList.remove('hidden');
        
        // Get order details
        const order = JSON.parse(localStorage.getItem('lastSuccessfulOrder') || '{}');
        if (order.orderId) {
            const pElement = successBanner.querySelector('p');
            if (pElement) {
                pElement.textContent = `Thank you for your purchase (Order #${order.orderId}). You can now download your notes.`;
            }
        }
    }
}

// Hide payment success banner
function hidePaymentSuccess() {
    const successBanner = document.getElementById('paymentSuccess');
    if (successBanner) {
        successBanner.classList.add('hidden');
    }
}

// Load exam data
function loadExam(exam) {
    currentExam = exam;
    const examData = exams[exam];
    
    if (!examData) return;
    
    // Update page title
    document.title = `Study Zone - ${examData.title}`;
    
    // Update exam header
    const examIcon = document.getElementById('subjectIcon');
    const examTitle = document.getElementById('subjectTitle');
    const examDesc = document.getElementById('subjectDesc');
    
    if (examIcon) examIcon.className = examData.icon;
    if (examTitle) examTitle.textContent = examData.title;
    if (examDesc) examDesc.textContent = examData.desc;
    
    // Load chapters
    const chaptersGrid = document.getElementById('chaptersGrid');
    if (!chaptersGrid) return;
    
    chaptersGrid.innerHTML = '';
    
    examData.chapters.forEach((chapter, index) => {
        const isDownloaded = downloadedChapters[exam] && 
                            downloadedChapters[exam].includes(chapter.file);
        
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        chapterCard.innerHTML = `
            <div class="chapter-icon">
                <i class="${chapter.icon}"></i>
            </div>
            <div style="position: absolute; top: 15px; right: 15px; background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">
                ${chapter.pages} pages
            </div>
            <h3 class="chapter-title">${chapter.title}</h3>
            <p class="chapter-desc">${chapter.desc}</p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.8rem; color: var(--text-light);">
                <span><i class="fas fa-file-pdf"></i> ${chapter.size}</span>
                <span>Chapter ${index + 1}</span>
            </div>
            <button class="download-btn" onclick="downloadChapter('${exam}', '${chapter.file}', '${chapter.title}', ${chapter.pages})">
                <i class="fas ${isDownloaded ? 'fa-check' : 'fa-download'}"></i>
                ${isDownloaded ? 'Downloaded' : 'Download Now'}
            </button>
        `;
        
        chaptersGrid.appendChild(chapterCard);
    });
}

// Verify download access
async function verifyDownloadAccess() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order');
        const paymentId = urlParams.get('payment_id');
        
        // If we have order details in URL, user has paid
        if (orderId && paymentId) {
            return true;
        }
        
        // Check localStorage for current order
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '{}');
        if (currentOrder.status === 'success') {
            return true;
        }
        
        // Check if user is logged in and has orders
        if (auth.currentUser && auth.currentUser.orders && auth.currentUser.orders.length > 0) {
            const hasSuccessfulOrder = auth.currentUser.orders.some(order => order.status === 'success');
            if (hasSuccessfulOrder) {
                return true;
            }
        }
        
        // Try backend verification
        if (BACKEND_URL && orderId) {
            const response = await fetch(`${BACKEND_URL}/api/verify-download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    product: currentExam
                })
            });
            
            const result = await response.json();
            return result.allowed;
        }
        
        return false;
        
    } catch (error) {
        console.error('Download verification error:', error);
        return false;
    }
}

// Download chapter function
async function downloadChapter(exam, file, title, pages) {
    const hasAccess = await verifyDownloadAccess();
    
    if (!hasAccess) {
        alert('Please complete payment first or contact support at +91 7869952173');
        return;
    }
    
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Show downloading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    button.disabled = true;
    
    // Simulate download process
    setTimeout(() => {
        // Mark as downloaded
        if (!downloadedChapters[exam]) {
            downloadedChapters[exam] = [];
        }
        
        if (!downloadedChapters[exam].includes(file)) {
            downloadedChapters[exam].push(file);
            localStorage.setItem('downloadedChapters', JSON.stringify(downloadedChapters));
        }
        
        // Update button
        button.innerHTML = '<i class="fas fa-check"></i> Downloaded';
        button.disabled = false;
        
        // Update progress and stats
        updateProgress();
        updateStats();
        
        // Add to user download history
        auth.addDownload({
            product: exams[currentExam].title,
            chapter: title,
            file: file,
            pages: pages
        });
        
        // Show success notification
        showDownloadNotification(title, pages);
        
        // Track download in analytics (simulated)
        trackDownload(exam, title);
        
    }, 2000);
}

// Show download notification
function showDownloadNotification(title, pages) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
            <div>
                <strong>Download Complete!</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">"${title}" (${pages} pages) has been downloaded successfully.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Track download (simulated analytics)
function trackDownload(exam, title) {
    const downloadHistory = JSON.parse(localStorage.getItem('downloadHistory')) || [];
    downloadHistory.push({
        exam: exam,
        title: title,
        timestamp: new Date().toISOString(),
        device: navigator.userAgent
    });
    localStorage.setItem('downloadHistory', JSON.stringify(downloadHistory));
}

// Download all chapters
async function downloadAllChapters() {
    const hasAccess = await verifyDownloadAccess();
    
    if (!hasAccess) {
        alert('Please complete payment first or contact support at +91 7869952173');
        return;
    }
    
    const examData = exams[currentExam];
    if (!examData) return;
    
    const totalChapters = examData.chapters.length;
    const downloadedCount = downloadedChapters[currentExam] ? downloadedChapters[currentExam].length : 0;
    
    if (downloadedCount === totalChapters) {
        alert('All chapters are already downloaded!');
        return;
    }
    
    // Show bulk download progress
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing bulk download...';
    button.disabled = true;
    
    setTimeout(() => {
        // Simulate bulk download
        examData.chapters.forEach((chapter, index) => {
            if (!downloadedChapters[currentExam] || !downloadedChapters[currentExam].includes(chapter.file)) {
                setTimeout(() => {
                    downloadChapter(currentExam, chapter.file, chapter.title, chapter.pages);
                }, index * 500);
            }
        });
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            alert('Bulk download initiated! All chapters will be downloaded one by one.');
        }, 1000);
        
    }, 2000);
}

// Update progress bar
function updateProgress() {
    const examData = exams[currentExam];
    if (!examData) return;
    
    const totalChapters = examData.chapters.length;
    const downloadedCount = downloadedChapters[currentExam] ? downloadedChapters[currentExam].length : 0;
    const percentage = totalChapters > 0 ? (downloadedCount / totalChapters) * 100 : 0;
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${downloadedCount}/${totalChapters} Chapters Downloaded`;
    if (progressPercent) progressPercent.textContent = `${Math.round(percentage)}% Complete`;
}

// Update stats
function updateStats() {
    const examData = exams[currentExam];
    if (!examData) return;
    
    const totalChapters = examData.chapters.length;
    const downloadedCount = downloadedChapters[currentExam] ? downloadedChapters[currentExam].length : 0;
    const remainingCount = totalChapters - downloadedCount;
    const percentage = totalChapters > 0 ? Math.round((downloadedCount / totalChapters) * 100) : 0;
    
    updateElementText('totalChapters', totalChapters);
    updateElementText('downloadedChapters', downloadedCount);
    updateElementText('remainingChapters', remainingCount);
    updateElementText('completionPercent', `${percentage}%`);
}

// Helper function to update element text
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Change exam
function changeSubject(exam) {
    loadExam(exam);
    updateProgress();
    updateStats();
    
    // Update URL without reloading page
    const newUrl = `${window.location.pathname}?exam=${exam}`;
    window.history.pushState({}, '', newUrl);
}

// Go back to main page
function goBack() {
    window.location.href = 'index.html';
}

// Contact support
function contactSupport() {
    const email = 'kripanshofficial@gmail.com';
    const subject = 'Download Help - Study Zone';
    const body = `I need help with downloading notes.\n\nExam: ${exams[currentExam].title}\n\nIssue Description: `;
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openWhatsApp() {
    const message = `Hello Study Zone Team, I need help with downloading ${exams[currentExam].title} notes. My issue is: `;
    window.open(`https://wa.me/917869952173?text=${encodeURIComponent(message)}`, '_blank');
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initPage);
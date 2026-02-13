// Navigation
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initModals();
    initVoiceRecorder();
    initFileUpload();
    initCalculator();
    initCharts();
    initAnimations();
});

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobileOverlay');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            this.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.className = 'fas fa-times';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                icon.className = 'fas fa-bars';
                document.body.style.overflow = ''; // Enable scrolling
            }
        });
    }
    
    // Close sidebar when clicking on nav item (mobile only)
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Close sidebar when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
    
    function closeMobileMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
        document.body.style.overflow = ''; // Enable scrolling
    }
}

// Navigation System
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            const pageId = this.getAttribute('data-page') + '-page';
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
}

// Modal System
function initModals() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceModal = document.getElementById('voiceModal');
    const uploadModal = document.getElementById('uploadModal');
    const uploadBtns = document.querySelectorAll('#uploadInvoiceBtn, #addTransactionBtn');
    const closeBtns = document.querySelectorAll('.modal-close');
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            voiceModal.classList.add('active');
        });
    }
    
    uploadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            uploadModal.classList.add('active');
        });
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Voice Recorder
function initVoiceRecorder() {
    const recordBtn = document.getElementById('recordBtn');
    const recorderStatus = document.querySelector('.recorder-status');
    const recorderTime = document.querySelector('.recorder-time');
    const pulseRing = document.querySelector('.pulse-ring');
    
    let isRecording = false;
    let recordingTime = 0;
    let recordingInterval;
    
    if (recordBtn) {
        recordBtn.addEventListener('click', function() {
            if (!isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        });
    }
    
    function startRecording() {
        isRecording = true;
        recordBtn.classList.add('recording');
        pulseRing.classList.add('active');
        recorderStatus.textContent = 'جاري التسجيل...';
        
        recordingTime = 0;
        recordingInterval = setInterval(() => {
            recordingTime++;
            const minutes = Math.floor(recordingTime / 60);
            const seconds = recordingTime % 60;
            recorderTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
        
        // Simulate voice recognition
        setTimeout(() => {
            recorderStatus.textContent = 'تم التعرف على الصوت...';
        }, 2000);
    }
    
    function stopRecording() {
        isRecording = false;
        recordBtn.classList.remove('recording');
        pulseRing.classList.remove('active');
        recorderStatus.textContent = 'تم حفظ التسجيل بنجاح';
        clearInterval(recordingInterval);
        
        // Show success message
        setTimeout(() => {
            showNotification('تم إضافة المعاملة بنجاح', 'success');
            document.getElementById('voiceModal').classList.remove('active');
            recorderStatus.textContent = 'اضغط للبدء في التسجيل';
            recorderTime.textContent = '00:00';
        }, 1500);
    }
}

// File Upload
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadArea && fileInput) {
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3b82f6';
            uploadArea.style.background = 'rgba(59, 130, 246, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#e2e8f0';
            uploadArea.style.background = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#e2e8f0';
            uploadArea.style.background = 'transparent';
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle" style="color: #10b981;"></i>
                <p>تم رفع الملف: ${file.name}</p>
            `;
            
            showNotification('تم رفع الفاتورة بنجاح', 'success');
        }
    }
}

// Calculator
function initCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const costInputs = document.querySelectorAll('.cost-input');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateProject);
    }
    
    // Auto-calculate on input change
    costInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (Array.from(costInputs).every(i => i.value)) {
                calculateProject();
            }
        });
    });
}

function calculateProject() {
    const costInputs = document.querySelectorAll('.cost-input');
    let totalCost = 0;
    
    costInputs.forEach(input => {
        totalCost += parseFloat(input.value) || 0;
    });
    
    // Calculate profit margins
    const profit20 = totalCost * 0.20;
    const profit5 = totalCost * 0.05;
    const profit30 = totalCost * 0.30;
    
    const recommendedPrice = totalCost + profit20;
    const minPrice = totalCost + profit5;
    const idealPrice = totalCost + profit30;
    
    // Update display with animation
    animateValue('totalCost', 0, totalCost, 1000);
    animateValue('profitMargin', 0, profit20, 1000);
    animateValue('recommendedPrice', 0, recommendedPrice, 1000);
    
    // Update pricing options
    document.querySelectorAll('.option-value')[0].textContent = formatCurrency(minPrice);
    document.querySelectorAll('.option-value')[1].textContent = formatCurrency(recommendedPrice);
    document.querySelectorAll('.option-value')[2].textContent = formatCurrency(idealPrice);
    
    // Update payment schedule
    const payment1 = recommendedPrice * 0.30;
    const payment2 = recommendedPrice * 0.40;
    const payment3 = recommendedPrice * 0.30;
    
    const paymentItems = document.querySelectorAll('.payment-item span:last-child');
    paymentItems[0].textContent = formatCurrency(payment1);
    paymentItems[1].textContent = formatCurrency(payment2);
    paymentItems[2].textContent = formatCurrency(payment3);
    
    showNotification('تم حساب المشروع بنجاح', 'success');
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatCurrency(current);
    }, 16);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(amount)) + ' ريال';
}

// Charts
function initCharts() {
    // Revenue and Expense Chart
    const revenueExpenseCtx = document.getElementById('revenueExpenseChart');
    
    if (revenueExpenseCtx) {
        new Chart(revenueExpenseCtx, {
            type: 'line',
            data: {
                labels: ['سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير'],
                datasets: [
                    {
                        label: 'الإيرادات',
                        data: [180000, 220000, 195000, 245000, 210000, 185000],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    },
                    {
                        label: 'المصروفات',
                        data: [120000, 145000, 138000, 165000, 142000, 128000],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Tajawal',
                                size: 14,
                                weight: '600'
                            },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            family: 'Tajawal',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Tajawal',
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                family: 'Tajawal'
                            },
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Tajawal',
                                size: 12
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Animations
function initAnimations() {
    // Animate stats on page load
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.stat-card, .chart-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: 'Tajawal', sans-serif;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Real-time updates simulation
setInterval(() => {
    // Simulate live data updates
    const profitElement = document.getElementById('netProfit');
    if (profitElement && Math.random() > 0.5) {
        const currentValue = parseFloat(profitElement.textContent.replace(/[^\d]/g, ''));
        const newValue = currentValue + Math.floor(Math.random() * 1000);
        profitElement.textContent = formatCurrency(newValue);
    }
}, 30000);

// Search functionality
const searchInputs = document.querySelectorAll('.search-input');
searchInputs.forEach(input => {
    input.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = this.closest('.page').querySelectorAll('[data-searchable]');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Export to Excel functionality
const exportBtns = document.querySelectorAll('[data-export]');
exportBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        showNotification('جاري تصدير البيانات إلى Excel...', 'info');
        
        setTimeout(() => {
            showNotification('تم التصدير بنجاح', 'success');
        }, 2000);
    });
});

// Progress bar animations
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-out';
            bar.style.width = width;
        }, 100);
    });
}

// Call animations on page load
window.addEventListener('load', () => {
    animateProgressBars();
});

// Auto-save functionality
let autoSaveTimeout;
const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    input.addEventListener('input', function() {
        clearTimeout(autoSaveTimeout);
        
        autoSaveTimeout = setTimeout(() => {
            // Simulate auto-save
            const saveIndicator = document.createElement('span');
            saveIndicator.textContent = '✓ تم الحفظ';
            saveIndicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #10b981;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                font-size: 0.875rem;
                animation: fadeInOut 2s ease;
            `;
            
            document.body.appendChild(saveIndicator);
            
            setTimeout(() => {
                document.body.removeChild(saveIndicator);
            }, 2000);
        }, 1000);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showNotification('تم حفظ البيانات', 'success');
    }
    
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.focus();
    }
});

// Print functionality
function printReport() {
    window.print();
}

// Dark mode toggle (for future implementation)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load saved preferences
window.addEventListener('load', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
});

console.log('نظام أركان الدانة للمقاولات - تم التحميل بنجاح ✓');

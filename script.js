// DOM Elements
const pages = document.querySelectorAll('.page');
const loginForm = document.getElementById('login-form');
const forgotPasswordLink = document.getElementById('forgot-password');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const closeModal = document.querySelector('.close-modal');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const logoutBtn = document.getElementById('logout-btn');
const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
const contentSections = document.querySelectorAll('.content-section');
const requestTypeTabs = document.querySelectorAll('.request-type-tabs .tab-btn');
const requestTypeSelect = document.getElementById('request-type');
const customerFields = document.getElementById('customer-fields');
const vehicleRequestForm = document.getElementById('vehicle-request-form');
const csvUpload = document.getElementById('csv-upload');
const browseBtn = document.getElementById('browse-btn');
const uploadPreview = document.getElementById('upload-preview');
const confirmUploadBtn = document.getElementById('confirm-upload');
const assignActions = document.getElementById('assign-actions');
const selectAllCheckbox = document.getElementById('select-all');
const confirmAssignBtn = document.getElementById('confirm-assign');
const assignToSelect = document.getElementById('assign-to');
const assignAgentSelect = document.getElementById('assign-agent');
const usernameInput = document.getElementById('username');
const adminUsername = document.getElementById('admin-username');
const userAvatar = document.getElementById('user-avatar');

// Sample Data
const agencies = [
    { id: 1, name: 'AutoValuers India', agents: ['Rahul Sharma', 'Neha Gupta'] },
    { id: 2, name: 'Vehicle Assessment', agents: ['Amit Singh', 'Priya Patel'] },
    { id: 3, name: 'CarValue Experts', agents: ['Vikram Joshi', 'Ananya Reddy'] }
];

// Initialize the app
function initApp() {
    setupEventListeners();
}

// Show specific page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = usernameInput.value;
            const password = document.getElementById('password').value;
            
            if (username && password) {
                // Store username and show in dashboard
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // Update UI with username
                adminUsername.textContent = username;
                userAvatar.textContent = username.charAt(0).toUpperCase() + (username.split(' ')[1] ? username.split(' ')[1].charAt(0).toUpperCase() : '');
                
                showDashboard();
            }
        });
    }
    
    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'flex';
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
        });
    }
    
    // Forgot password form
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;
            alert(`Reset link sent to ${email}`);
            forgotPasswordModal.style.display = 'none';
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            showPage('login-page');
        });
    }
    
    // Sidebar navigation
    if (sidebarLinks) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                
                // Remove active class from all links and sections
                sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked link and corresponding section
                this.parentElement.classList.add('active');
                document.getElementById(`${page}-content`).classList.add('active');
            });
        });
    }
    
    // Request type tabs
    if (requestTypeTabs) {
        requestTypeTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                
                requestTypeTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.getElementById('single-request-form').style.display = type === 'single' ? 'block' : 'none';
                document.getElementById('bulk-request-form').style.display = type === 'bulk' ? 'block' : 'none';
            });
        });
    }
    
    // Request type select change
    if (requestTypeSelect) {
        requestTypeSelect.addEventListener('change', function() {
            customerFields.style.display = this.value === 'refinance' ? 'block' : 'none';
        });
    }
    
    // Vehicle request form
    if (vehicleRequestForm) {
        vehicleRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Vehicle valuation request submitted successfully!');
            this.reset();
        });
    }
    
    // CSV upload
    if (browseBtn) {
        browseBtn.addEventListener('click', function() {
            csvUpload.click();
        });
    }
    
    if (csvUpload) {
        csvUpload.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const csvData = event.target.result;
                    const rows = csvData.split('\n').slice(0, 5);
                    
                    const tbody = document.querySelector('#csv-preview-table tbody');
                    tbody.innerHTML = '';
                    
                    rows.forEach(row => {
                        if (row.trim()) {
                            const cells = row.split(',');
                            const tr = document.createElement('tr');
                            
                            for (let i = 0; i < 5 && i < cells.length; i++) {
                                const td = document.createElement('td');
                                td.textContent = cells[i];
                                tr.appendChild(td);
                            }
                            
                            tbody.appendChild(tr);
                        }
                    });
                    
                    uploadPreview.style.display = 'block';
                    confirmUploadBtn.disabled = false;
                };
                
                reader.readAsText(file);
            }
        });
    }
    
    // Confirm upload
    if (confirmUploadBtn) {
        confirmUploadBtn.addEventListener('click', function() {
            alert('Bulk upload processed successfully!');
            uploadPreview.style.display = 'none';
            csvUpload.value = '';
        });
    }
    
    // Select all checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.request-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            updateAssignActions();
        });
    }
    
    // Individual request checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('request-checkbox')) {
            updateAssignActions();
        }
    });
    
    // Agency select change
    if (assignToSelect) {
        assignToSelect.addEventListener('change', function() {
            const agencyId = parseInt(this.value);
            const agency = agencies.find(a => a.id === agencyId);
            
            assignAgentSelect.innerHTML = '<option value="">Select agent</option>';
            assignAgentSelect.disabled = !agency;
            
            if (agency) {
                agency.agents.forEach(agent => {
                    const option = document.createElement('option');
                    option.value = agent;
                    option.textContent = agent;
                    assignAgentSelect.appendChild(option);
                });
            }
        });
    }
    
    // Confirm assign
    if (confirmAssignBtn) {
        confirmAssignBtn.addEventListener('click', function() {
            const agencyId = assignToSelect.value;
            const agentName = assignAgentSelect.value;
            
            if (!agencyId) {
                alert('Please select an agency');
                return;
            }
            
            if (!agentName) {
                alert('Please select an agent');
                return;
            }
            
            const selectedRequests = [];
            document.querySelectorAll('.request-checkbox:checked').forEach(checkbox => {
                selectedRequests.push(checkbox.getAttribute('data-id'));
            });
            
            alert(`Assigned ${selectedRequests.length} requests to ${agentName} at ${agencies.find(a => a.id == agencyId).name}`);
            
            // Reset selection
            selectAllCheckbox.checked = false;
            document.querySelectorAll('.request-checkbox').forEach(cb => cb.checked = false);
            assignActions.style.display = 'none';
        });
    }
}

// Show dashboard
function showDashboard() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn) {
        showPage('admin-dashboard');
        
        // Set username if available
        const username = localStorage.getItem('username');
        if (username) {
            adminUsername.textContent = username;
            userAvatar.textContent = username.charAt(0).toUpperCase() + (username.split(' ')[1] ? username.split(' ')[1].charAt(0).toUpperCase() : '');
        }
    } else {
        showPage('login-page');
    }
}

// Update assign actions visibility
function updateAssignActions() {
    const anyChecked = document.querySelectorAll('.request-checkbox:checked').length > 0;
    assignActions.style.display = anyChecked ? 'flex' : 'none';
    
    // Update confirm button text
    if (anyChecked) {
        const count = document.querySelectorAll('.request-checkbox:checked').length;
        confirmAssignBtn.textContent = `Assign Selected (${count})`;
    }
    
    // Update select all checkbox
    selectAllCheckbox.checked = anyChecked && 
        document.querySelectorAll('.request-checkbox:checked').length === 
        document.querySelectorAll('.request-checkbox').length;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        showDashboard();
    }
});
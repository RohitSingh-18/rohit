// Global variables
let currentDealerId = null;
let currentDealerToRemove = null;

// Initialize dealers page
function initializeDealers() {
    initializeSearch();
    initializeModals();
    initializePagination();
    attachViewListingsHandlers();
}

// Attach view listings handlers
function attachViewListingsHandlers() {
    const viewButtons = document.querySelectorAll('.btn-view-listings');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dealerId = this.closest('tr').dataset.dealerId;
            viewDealerListings(dealerId);
        });
    });
}

// Initialize search and filter functionality
function initializeSearch() {
    const searchInput = document.getElementById('dealerSearch');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterDealers();
        }, 300));
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterDealers();
        });
    }
}

// Filter dealers based on search and status
function filterDealers() {
    const searchValue = document.getElementById('dealerSearch').value.toLowerCase();
    const statusValue = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('.dealers-table tbody tr');

    rows.forEach(row => {
        const dealerName = row.querySelector('.dealer-info h4').textContent.toLowerCase();
        const dealerStatus = row.querySelector('.status-badge').textContent.toLowerCase();
        const matchesSearch = dealerName.includes(searchValue);
        const matchesStatus = statusValue === 'all' || dealerStatus === statusValue;

        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

// Initialize modal functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => closeModal(modal));
        }
    });
}

// Initialize pagination
function initializePagination() {
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');
    const pageButtons = document.querySelectorAll('.page-numbers button');

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            const currentPage = document.querySelector('.page-numbers button.active');
            const prevPage = currentPage.previousElementSibling;
            if (prevPage) {
                changePage(prevPage);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const currentPage = document.querySelector('.page-numbers button.active');
            const nextPage = currentPage.nextElementSibling;
            if (nextPage) {
                changePage(nextPage);
            }
        });
    }

    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            changePage(this);
        });
    });
}

// Change active page
function changePage(pageButton) {
    const currentPage = document.querySelector('.page-numbers button.active');
    if (currentPage) {
        currentPage.classList.remove('active');
    }
    pageButton.classList.add('active');
    // Here you would typically fetch and display the dealers for the selected page
}

// View dealer listings
function viewDealerListings(dealerId) {
    // Get dealer data from the table row
    const dealerRow = document.querySelector(`tr[data-dealer-id="${dealerId}"]`);
    if (!dealerRow) return;

    const dealerData = {
        id: dealerId,
        name: dealerRow.querySelector('.dealer-info h4').textContent,
        owner: dealerRow.querySelector('.dealer-info span').textContent,
        location: dealerRow.querySelector('[data-label="Location"]').textContent,
        totalListings: dealerRow.querySelector('[data-label="Listings"]').textContent,
        status: dealerRow.querySelector('.status-badge').textContent,
        joinDate: dealerRow.querySelector('[data-label="Join Date"]').textContent,
        avatar: dealerRow.querySelector('.dealer-info img').src,
        listings: [
            {
                id: '1',
                title: '2022 Honda City',
                price: '₹12,50,000',
                details: 'Petrol • 15,000 km • Automatic',
                status: 'active',
                date: '2024-01-15',
                views: '245',
                image: 'https://via.placeholder.com/300x200'
            },
            {
                id: '2',
                title: '2023 Hyundai Creta',
                price: '₹16,75,000',
                details: 'Diesel • 8,000 km • Manual',
                status: 'pending',
                date: '2024-02-01',
                views: '189',
                image: 'https://via.placeholder.com/300x200'
            }
        ]
    };

    // Store dealer data in sessionStorage
    sessionStorage.setItem('currentDealer', JSON.stringify(dealerData));
    
    // Navigate to dealer listings page
    window.location.href = 'dealer-listings.html?id=' + dealerId;
}

// Confirm dealer removal
function confirmRemoveDealer(dealerId) {
    const modal = document.getElementById('confirmationModal');
    if (!modal) return;

    currentDealerId = dealerId;
    modal.classList.add('active');
}

// Remove dealer
function removeDealer() {
    if (!currentDealerId) return;

    // In a real application, you would make an API call here
    const row = document.querySelector(`tr[data-dealer-id="${currentDealerId}"]`);
    if (row) {
        row.remove();
        updateDealerCount(-1);
    }

    // Close the confirmation modal
    closeModal(document.getElementById('confirmationModal'));
    currentDealerId = null;
}

// Update dealer count in stats
function updateDealerCount(change) {
    const totalDealersElement = document.querySelector('.stat-card .stat-value');
    if (totalDealersElement) {
        const currentCount = parseInt(totalDealersElement.textContent);
        totalDealersElement.textContent = currentCount + change;
    }
}

// Close modal
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
    }
}

// Helper function to get dealer data
function getDealerData(dealerId) {
    // In a real application, this would come from your backend
    const dealers = {
        1: {
            name: 'AutoMax Motors',
            location: 'Mumbai, Maharashtra',
            listings: [
                {
                    title: '2022 Honda City',
                    price: '₹12,50,000',
                    details: 'Petrol • 15,000 km • Automatic'
                }
                // Add more listings as needed
            ]
        },
        2: {
            name: 'Premium Cars',
            location: 'Delhi, NCR',
            listings: [
                {
                    title: '2023 Hyundai Creta',
                    price: '₹16,75,000',
                    details: 'Diesel • 8,000 km • Manual'
                }
                // Add more listings as needed
            ]
        }
    };
    return dealers[dealerId];
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the dealers page
    if (document.querySelector('.dealers-page')) {
        initializeDealers();
    }
});

function showDealerRemoveModal(button) {
    const row = button.closest('tr');
    const modal = document.getElementById('dealerRemoveModal');
    
    // Get dealer details
    const dealerInfo = row.querySelector('.dealer-info');
    const name = dealerInfo.querySelector('h4').textContent;
    const location = row.querySelector('[data-label="Location"]').textContent;
    const avatar = dealerInfo.querySelector('img').src;
    
    // Update modal content
    document.getElementById('dealerPreviewName').textContent = name;
    document.getElementById('dealerPreviewLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
    document.getElementById('dealerPreviewImage').src = avatar;
    
    currentDealerToRemove = row;
    modal.classList.add('active');
}

function closeDealerRemoveModal() {
    const modal = document.getElementById('dealerRemoveModal');
    modal.classList.remove('active');
    currentDealerToRemove = null;
}

function confirmDealerRemoval() {
    if (!currentDealerToRemove) return;
    
    // Add fade-out animation
    currentDealerToRemove.style.transition = 'all 0.3s ease';
    currentDealerToRemove.style.opacity = '0';
    currentDealerToRemove.style.transform = 'scale(0.95)';
    
    // Remove the row after animation
    setTimeout(() => {
        currentDealerToRemove.remove();
        
        // Update total dealers count
        const totalDealersElement = document.querySelector('.stat-card .stat-value');
        if (totalDealersElement) {
            const currentCount = parseInt(totalDealersElement.textContent);
            totalDealersElement.textContent = currentCount - 1;
        }
        
        // Show success notification
        showNotification('Dealer has been removed successfully', 'success');
    }, 300);
    
    closeDealerRemoveModal();
}

// Add event listener for clicking outside modal
document.addEventListener('DOMContentLoaded', function() {
    const dealerRemoveModal = document.getElementById('dealerRemoveModal');
    if (dealerRemoveModal) {
        dealerRemoveModal.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeDealerRemoveModal();
            }
        });
    }
});

// Notification function (if not already defined)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 
// Global variables
let currentDealerToRemove = null;

// Function to view dealer listings
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
        avatar: dealerRow.querySelector('.dealer-info img').src
    };

    // Store dealer data in sessionStorage
    sessionStorage.setItem('currentDealer', JSON.stringify(dealerData));
    
    // Navigate to dealer listings page
    window.location.href = 'dealer-listings.html?id=' + dealerId;
}

// Function to show dealer remove modal
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

// Function to close dealer remove modal
function closeDealerRemoveModal() {
    const modal = document.getElementById('dealerRemoveModal');
    modal.classList.remove('active');
    currentDealerToRemove = null;
}

// Function to confirm dealer removal
function confirmDealerRemoval() {
    if (!currentDealerToRemove) return;
    
    // Add removing class to current row
    currentDealerToRemove.classList.add('removing');
    
    // Remove the dealer row after animation
    setTimeout(() => {
        currentDealerToRemove.remove();
        
        // Update total dealers count
        const totalDealersElement = document.querySelector('.stat-card .stat-value');
        if (totalDealersElement) {
            const currentCount = parseInt(totalDealersElement.textContent);
            totalDealersElement.textContent = currentCount - 1;
        }
        
        showNotification('Dealer has been removed successfully', 'success');
    }, 300);
    
    closeDealerRemoveModal();
}

// Function to show notification
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

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.classList.remove('active');
            }
        });
    });

    // Initialize search and filter functionality
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
});

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
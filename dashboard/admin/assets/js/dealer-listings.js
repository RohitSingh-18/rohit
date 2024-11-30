let currentListingToRemove = null;

function showListingRemoveModal(button) {
    const card = button.closest('.listing-card');
    const modal = document.getElementById('listingRemoveModal');
    
    const title = card.querySelector('.listing-title h3').textContent;
    const price = card.querySelector('.listing-price').textContent;
    const image = card.querySelector('.listing-image img').src;
    
    document.getElementById('listingPreviewTitle').textContent = title;
    document.getElementById('listingPreviewPrice').textContent = price;
    document.getElementById('listingPreviewImage').src = image;
    
    currentListingToRemove = card;
    modal.classList.add('active');
}

function closeListingRemoveModal() {
    const modal = document.getElementById('listingRemoveModal');
    modal.classList.remove('active');
    currentListingToRemove = null;
}

function confirmListingRemoval() {
    if (!currentListingToRemove) return;
    
    currentListingToRemove.style.transition = 'all 0.3s ease';
    currentListingToRemove.style.opacity = '0';
    currentListingToRemove.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        currentListingToRemove.remove();
        
        const countElement = document.querySelector('.dealer-meta span:nth-child(2)');
        if (countElement) {
            const currentCount = parseInt(countElement.textContent.match(/\d+/)[0]);
            countElement.innerHTML = `<i class="fas fa-car"></i> ${currentCount - 1} Active Listings`;
        }
        
        showNotification('Listing removed successfully', 'success');
    }, 300);
    
    closeListingRemoveModal();
}

function confirmRemoveAllListings() {
    const modal = document.getElementById('removeAllListingsModal');
    modal.classList.add('active');
}

function closeRemoveAllListingsModal() {
    const modal = document.getElementById('removeAllListingsModal');
    modal.classList.remove('active');
}

function removeAllListings() {
    const listingsGrid = document.querySelector('.listings-grid');
    const listingCards = document.querySelectorAll('.listing-card');
    
    listingCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
    });

    setTimeout(() => {
        listingsGrid.innerHTML = '';
        
        const listingsCountElement = document.querySelector('.dealer-meta span:nth-child(2)');
        listingsCountElement.innerHTML = '<i class="fas fa-car"></i> 0 Active Listings';
        
        showNotification('All listings have been removed successfully', 'success');
        
        closeRemoveAllListingsModal();
    }, 300);
}

function confirmRemoveDealer() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('active');
}

function removeListing() {
    closeModal();
    showNotification('Dealer has been removed successfully', 'success');
    setTimeout(() => {
        window.location.href = 'portal.html?page=dealers';
    }, 1500);
}

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

document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.classList.remove('active');
            }
        });
    });
});

function editListing(button) {
    const listingId = button.getAttribute('data-listing-id');
    window.location.href = `edit-listing.html?id=${listingId}`;
} 
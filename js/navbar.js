/**
 * Navbar JavaScript functionality
 * Handles navigation loading, wallet connection, and mobile menu
 */

// Load navbar and footer
$(document).ready(function() {
    // Load navbar
    $('#navbar-container').load('navbar.html', function() {
        initializeNavbar();
    });
    
    // Load footer
    $('#footer-container').load('footer.html');
});

function initializeNavbar() {
    // Mobile menu toggle
    $('.mobile-menu-toggle').click(function() {
        $('.nav-links').toggleClass('mobile-active');
        $(this).toggleClass('active');
    });

    // Wallet connection (placeholder functionality)
    $('#wallet-connect').click(function() {
        const button = $(this);
        const status = $('#wallet-status');
        
        if (button.hasClass('connected')) {
            // Disconnect wallet
            button.removeClass('connected');
            status.text('Conectar Wallet');
        } else {
            // Connect wallet (placeholder)
            button.addClass('connected');
            status.text('Conectado');
        }
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Active page highlighting
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    $('.nav-link').each(function() {
        const href = $(this).attr('href');
        if (href && href.includes(currentPage)) {
            $(this).addClass('active');
        }
    });

    // Dropdown menu functionality
    $('.nav-dropdown').hover(
        function() {
            $(this).find('.dropdown-menu').addClass('show');
        },
        function() {
            $(this).find('.dropdown-menu').removeClass('show');
        }
    );
}

// Utility function for smooth scrolling
function smoothScroll(target) {
    $('html, body').animate({
        scrollTop: $(target).offset().top - 80
    }, 800);
}

// Export for global use
window.smoothScroll = smoothScroll;
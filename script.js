$(document).ready(function(){
    // Initialize AOS with enhanced settings
    AOS.init({
        duration: 1000,
        once: true,
        disable: 'mobile',
        offset: 100,
        easing: 'ease-in-out',
        delay: 100
    });

    // Track menu state
    let isMenuOpen = false;

    // Enhanced menu button functionality
    $('.menu-btn').click(function(e){
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        toggleMenu();
    });

    // Function to toggle menu state
    function toggleMenu() {
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
        
        if(isMenuOpen) {
            $('body').css('overflow', 'hidden'); // Prevent background scrolling
            // Animate menu items
            $('.navbar .menu li').each(function(index) {
                $(this).css({
                    'animation': `slideIn 0.5s ease forwards ${index * 0.1}s`,
                    'opacity': '0'
                });
            });
        } else {
            $('body').css('overflow', ''); // Restore scrolling
            $('.navbar .menu li').css({
                'animation': 'none',
                'opacity': '1'
            });
        }
    }

    // Close menu when clicking outside
    $(document).click(function(e) {
        if (isMenuOpen && !$(e.target).closest('.navbar .menu, .menu-btn').length) {
            isMenuOpen = false;
            toggleMenu();
        }
    });

    // Prevent menu close when clicking inside menu
    $('.navbar .menu').click(function(e) {
        e.stopPropagation();
    });

    // Close menu when clicking a menu item
    $('.navbar .menu li a').click(function(e){
        e.preventDefault();
        const target = $(this).attr('href');
        
        // Close menu if open
        if(isMenuOpen) {
            isMenuOpen = false;
            toggleMenu();
        }

        // Improved scroll to section
        scrollToSection(target);
    });

    // Improved function to handle smooth scrolling and offset
    function scrollToSection(target) {
        // Dynamic offset based on screen size
        let offset = 100;
        if($(window).width() <= 947) {
            offset = 60;
        }
        if($(window).width() <= 500) {
            offset = 50;
        }
        
        const $targetElement = $(target);
        if($targetElement.length) {
            let scrollTarget = $targetElement.offset().top - offset;
            if (scrollTarget < 0) scrollTarget = 0;
            // Only scroll if not already at the right position
            if (Math.abs($(window).scrollTop() - scrollTarget) > 2) {
                $('html, body').animate({scrollTop: scrollTarget}, 400);
            }
            // Update URL without triggering scroll
            if(history.pushState) {
                history.pushState(null, null, target);
            }
        }
    }

    // Handle scroll events
    $(window).scroll(function(){
        const scrollPos = $(this).scrollTop();

        // Sticky navbar on scroll
        if(scrollPos > 20){
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        // Scroll-up button display
        if(scrollPos > 500){
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }

        // Update active menu item
        updateActiveMenuItem(scrollPos);
    });

    // Function to update active menu item
    function updateActiveMenuItem(scrollPos) {
        const navLinks = $('.navbar .menu li a');
        const sections = $('section');
        
        sections.each(function() {
            const top = $(this).offset().top - 100;
            const bottom = top + $(this).outerHeight();
            
            if (scrollPos >= top && scrollPos <= bottom) {
                const currentId = $(this).attr('id');
                navLinks.removeClass('active');
                $(`.navbar .menu li a[href="#${currentId}"]`).addClass('active');
            }
        });
    }

    // Scroll up button with instant scroll
    $('.scroll-up-btn').click(function(){
        $('html, body').scrollTop(0);
        return false;
    });

    // Initial active menu item update
    updateActiveMenuItem($(window).scrollTop());

    // Handle window resize
    let resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close menu if open on larger screens
            if($(window).width() > 947 && isMenuOpen) {
                isMenuOpen = false;
                toggleMenu();
            }
        }, 250);
    });

    // Enhanced skill bars animation with progress tracking
    function animateSkillBars() {
        $('.skills .line').each(function() {
            const percentageText = $(this).prev('.info').find('span:last-child').text();
            const percentage = percentageText;
            
            // Only animate if not already animated
            if (!$(this).data('animated')) {
                $(this).css({
                    'width': percentage,
                    'transition': 'width 1.5s ease-in-out'
                });
                $(this).data('animated', true);
            }
        });
    }

    // Trigger skill bar animation only when skills section is in view
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsSectionTop = skillsSection.offsetTop;
        const skillsSectionHeight = skillsSection.clientHeight;
        const viewportTop = $(window).scrollTop();
        const viewportHeight = $(window).height();

        // Adjust offset as needed
        const offset = 200;

        if (skillsSectionTop < viewportTop + viewportHeight - offset && skillsSectionTop + skillsSectionHeight > viewportTop + offset) {
            animateSkillBars();
        }
    }
});

// Add easing function if not already included
if (typeof jQuery.easing['easeInOutQuad'] === 'undefined') {
    jQuery.easing['easeInOutQuad'] = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    };
} 
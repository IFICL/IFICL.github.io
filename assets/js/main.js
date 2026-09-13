jQuery(function () {
    "use strict";

    // Reveal page sections as they enter the viewport.
    new WOW().init();

    // Close the collapsed mobile menu after navigating to a section.
    jQuery('#main-navigation a[href^="#"]').on('click', function () {
        if (jQuery('#main-navigation').hasClass('in')) {
            jQuery('#main-navigation').collapse('hide');
        }
    });

    initResearchTopicHighlights();
    initPublicationFilter();
    initWorkTabs();
});

// Highlight the matching research image label when a topic is hovered.
function initResearchTopicHighlights() {
    var links = document.querySelectorAll('.topic-link');

    links.forEach(function (link) {
        var topic = link.getAttribute('data-topic');
        var pill = document.querySelector('.keyword-pill[data-topic="' + topic + '"]');
        if (!pill) return;

        function activate() {
            pill.classList.add('pill-active');
            link.classList.add('topic-active');
        }

        function deactivate() {
            pill.classList.remove('pill-active');
            link.classList.remove('topic-active');
        }

        link.addEventListener('mouseenter', activate);
        link.addEventListener('mouseleave', deactivate);
        pill.addEventListener('mouseenter', activate);
        pill.addEventListener('mouseleave', deactivate);
    });
}

// Switch the publication list between selected entries and the full archive.
function initPublicationFilter() {
    var section = document.getElementById('Publication');
    if (!section) return;

    var buttons = section.querySelectorAll('.pub-toggle-btn');
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            var showSelected = button.getAttribute('data-filter') === 'selected';
            section.classList.toggle('filter-selected', showSelected);

            buttons.forEach(function (candidate) {
                var isActive = candidate === button;
                candidate.classList.toggle('active', isActive);
                candidate.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            // WOW may leave initially hidden entries invisible after filtering.
            if (!showSelected) {
                section.querySelectorAll('.pub-entry .block.wow').forEach(function (entry) {
                    entry.style.visibility = 'visible';
                    entry.style.animationName = 'none';
                });
            }
        });
    });
}

// Coordinate the work-history tabs, panels, and keyboard navigation.
function initWorkTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.work-tab'));
    var panels = document.querySelectorAll('.work-panel');
    if (!tabs.length) return;

    function selectTab(index) {
        tabs.forEach(function (tab) {
            var isActive = tab.getAttribute('data-i') === String(index);
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        panels.forEach(function (panel) {
            var isActive = panel.getAttribute('data-i') === String(index);
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
            selectTab(tab.getAttribute('data-i'));
        });

        tab.addEventListener('keydown', function (event) {
            var supportedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
            if (supportedKeys.indexOf(event.key) === -1) return;

            event.preventDefault();
            var nextIndex = event.key === 'Home' ? 0
                : event.key === 'End' ? tabs.length - 1
                    : event.key === 'ArrowRight' ? (index + 1) % tabs.length
                        : (index - 1 + tabs.length) % tabs.length;

            tabs[nextIndex].focus();
            selectTab(tabs[nextIndex].getAttribute('data-i'));
        });
    });
}

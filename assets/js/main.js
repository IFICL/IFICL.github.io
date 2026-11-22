jQuery(function () {
    "use strict";

    // Reveal page sections as they enter the viewport.
    if (typeof WOW === 'function') {
        try {
            new WOW().init();
        } catch (error) {
            document.querySelectorAll('.wow').forEach(function (element) {
                element.style.visibility = 'visible';
            });
            console.warn('Section animations could not initialize.', error);
        }
    }

    // Close the collapsed mobile menu after navigating to a section.
    jQuery('#main-navigation a[href^="#"]').on('click', function () {
        if (jQuery('#main-navigation').hasClass('in')) {
            jQuery('#main-navigation').collapse('hide');
        }
    });

    initResearchTopicHighlights();
    initProjectFilter();
    initWorkTabs();
    initLegacyProjectAnchor();
});

// Keep links to the former Publication section working.
function initLegacyProjectAnchor() {
    function redirectLegacyAnchor() {
        if (window.location.hash !== '#Publication') return;
        var section = document.getElementById('Projects');
        if (!section) return;
        window.history.replaceState(null, '', '#Projects');
        section.scrollIntoView();
    }

    redirectLegacyAnchor();
    window.addEventListener('hashchange', redirectLegacyAnchor);
}

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

// Switch the project list between selected entries and the full archive.
function initProjectFilter() {
    var section = document.getElementById('Projects');
    if (!section) return;

    var buttons = section.querySelectorAll('.project-toggle-btn');

    function setFilter(filter) {
        section.classList.toggle('filter-selected', filter === 'selected');
        buttons.forEach(function (button) {
            var isActive = button.getAttribute('data-filter') === filter;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            setFilter(button.getAttribute('data-filter'));
        });
    });

    function revealLinkedProject() {
        var id;
        try {
            id = decodeURIComponent(window.location.hash.slice(1));
        } catch (error) {
            return;
        }
        var target = document.getElementById(id);
        if (!target || !section.contains(target) || !target.classList.contains('project-entry')) return;

        if (!target.classList.contains('project-selected')) setFilter('all');
        target.scrollIntoView();
    }

    revealLinkedProject();
    window.addEventListener('hashchange', revealLinkedProject);
}

// Coordinate the work-history tabs, panels, and keyboard navigation.
function initWorkTabs() {
    var work = document.getElementById('Work');
    if (!work) return;
    var tabs = Array.from(work.querySelectorAll('.work-tab'));
    var panels = work.querySelectorAll('.work-panel');

    function selectTab(selectedTab) {
        var panelId = selectedTab.getAttribute('aria-controls');
        tabs.forEach(function (tab) {
            var isActive = tab === selectedTab;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        panels.forEach(function (panel) {
            var isActive = panel.id === panelId;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
            selectTab(tab);
        });

        tab.addEventListener('keydown', function (event) {
            var supportedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
            if (supportedKeys.indexOf(event.key) === -1) return;

            event.preventDefault();
            var nextIndex = event.key === 'Home' ? 0
                : event.key === 'End' ? tabs.length - 1
                    : event.key === 'ArrowRight' ? (index + 1) % tabs.length
                        : (index - 1 + tabs.length) % tabs.length;

            selectTab(tabs[nextIndex]);
            tabs[nextIndex].focus();
        });
    });
}

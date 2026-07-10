// Vercel Speed Insights initialization
// This script initializes the Speed Insights tracking queue and loads the tracking script
(function() {
  'use strict';
  
  // Initialize the Speed Insights queue
  window.si = window.si || function() {
    (window.siq = window.siq || []).push(arguments);
  };

  // Load the Speed Insights script
  function loadSpeedInsights() {
    // Check if script is already loaded
    var scriptSrc = '/_vercel/speed-insights/script.js';
    if (document.head.querySelector('script[src*="' + scriptSrc + '"]')) {
      return;
    }

    // Create and configure the script element
    var script = document.createElement('script');
    script.src = scriptSrc;
    script.defer = true;
    
    // Add SDK metadata
    script.dataset.sdkn = '@vercel/speed-insights';
    script.dataset.sdkv = '2.0.0';
    
    script.onerror = function() {
      console.log('[Vercel Speed Insights] Failed to load script. Please check if any content blockers are enabled.');
    };
    
    document.head.appendChild(script);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSpeedInsights);
  } else {
    loadSpeedInsights();
  }
})();

  // File: script.js

// Wait until the entire HTML document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Premier League Home Page Scripts Initialized.');

    // **********************************************
    // API DATA FETCHING LOGIC 
    // IMPORTANT: Replace this entire function with your actual 'fetch' logic 
    // to get data from your chosen API endpoint.
    // **********************************************

    /**
     * Dummy function to simulate fetching data and placing "API WAITING" content.
     * @param {string} endpoint - The type of data to fetch ('table', 'matches', etc.)
     * @returns {Promise<string>} - A Promise resolving to the HTML content (Currently 'API WAITING').
     */
    const fetchDataFromAPI = async (endpoint) => {
        // Simulating network delay for realistic loading effect (0.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 500)); 

        // Currently returns the "API WAITING" message for all placeholders
        return `<p>API WAITING</p>`;
    };


    // **********************************************
    // Function to load data into content containers
    // **********************************************

    const loadSectionData = async (containerId, endpoint) => {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container element not found: ${containerId}`);
            return;
        }

        try {
            // 1. Fetch content (the "API WAITING" message)
            const dataHtml = await fetchDataFromAPI(endpoint);
            
            // 2. Display the content 
            container.innerHTML = dataHtml;

        } catch (error) {
            console.error(`Error fetching ${endpoint} data:`, error);
            container.innerHTML = `<p>Error fetching data.</p>`;
        }
    };

    // Initialize data loading for the main sections:
    loadSectionData('league-table-container', 'table');
    loadSectionData('matches-schedule-container', 'matches');
    loadSectionData('match-overview-container', 'overview');
    
    
    // **********************************************
    // UI INTERACTIONS 
    // **********************************************

    // Highlight the active link in the navigation bar
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Remove 'active' class from all links first
            navLinks.forEach(l => l.classList.remove('active'));
            // Add 'active' class to the link that was clicked
            event.currentTarget.classList.add('active');
        });
    });
});

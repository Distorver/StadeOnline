// File: matches.js (API Integration and UI Logic for Match Schedule)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Matches Page Scripts Initialized.');

    // --- CONFIGURATION ---
    const TOTAL_MATCHWEEKS = 38;
    // Initial state: You can set this dynamically based on the current date via API later.
    let currentMatchweek = 1; 

    // --- DOM ELEMENT REFERENCES ---
    const prevButton = document.getElementById('prev-matchweek');
    const nextButton = document.getElementById('next-matchweek');
    const titleElement = document.getElementById('current-matchweek-title');
    const datesElement = document.getElementById('current-matchweek-dates');
    const scheduleContainer = document.getElementById('detailed-schedule-container');

    // **********************************************
    // 💡 API INTEGRATION SECTION 💡
    // **********************************************
    
    /**
     * @TIPS_FOR_API_DEV: This function handles fetching the match schedule for a specific week.
     * 1. Replace the mock delay (setTimeout) with your actual API fetch call.
     * 2. The 'weekNumber' parameter determines which Matchweek schedule to fetch (e.g., /api/schedule?week=5).
     * 3. The function should return the raw HTML string or dynamically generated HTML based on JSON data.
     * 4. Ensure robust error handling (try/catch in loadScheduleData).
     */
    const fetchScheduleDataFromAPI = async (weekNumber) => {
        // --- API Mockup: Replace this block with your actual fetch call ---
        // Example: const response = await fetch(`/api/matches/week/${weekNumber}`);
        // Example: const data = await response.json();
        await new Promise(resolve => setTimeout(resolve, 300)); 
        
        // --- API Response Mockup (Expected data): ---
        return `<p style="font-size: 1.5em; color: var(--text-muted);">
                    [API SUCCESS] Match Schedule for Matchweek ${weekNumber} loaded.<br>
                    (Render your detailed schedule list here)
                </p>`;
        // ------------------------------------------------------------------
    };

    // **********************************************
    // CORE UI AND NAVIGATION LOGIC
    // **********************************************
    
    /**
     * Updates the text and visual state of the navigation buttons (disabled/enabled).
     */
    const updateUIState = () => {
        // Update Title and Dates
        titleElement.textContent = `Matchweek ${currentMatchweek}`;
        datesElement.textContent = `Week ${currentMatchweek} of ${TOTAL_MATCHWEEKS}`;
        
        // Manage Button State (Disable at min/max weeks)
        if (currentMatchweek <= 1) {
            prevButton.classList.add('disabled');
            prevButton.disabled = true;
        } else {
            prevButton.classList.remove('disabled');
            prevButton.disabled = false;
        }

        if (currentMatchweek >= TOTAL_MATCHWEEKS) {
            nextButton.classList.add('disabled');
            nextButton.disabled = true;
        } else {
            nextButton.classList.remove('disabled');
            nextButton.disabled = false;
        }
    };

    /**
     * Loads the schedule data for the current week using the API function.
     */
    const loadScheduleData = async () => {
        // Show loading state while fetching data
        scheduleContainer.innerHTML = `<p style="font-size: 1.5em; color: var(--primary-color);">Loading Match Schedule...</p>`;

        try {
            const dataHtml = await fetchScheduleDataFromAPI(currentMatchweek);
            scheduleContainer.innerHTML = dataHtml;
        } catch (error) {
            console.error(`Error fetching schedule data for MW ${currentMatchweek}:`, error);
            scheduleContainer.innerHTML = `<p style="color: var(--live-red);">Error loading schedule. Check API connection.</p>`;
        }
        updateUIState();
    };
    
    
    /**
     * Handles clicks on the navigation arrows, updates the week number, and reloads data.
     */
    const handleMatchweekNav = (direction) => {
        let newMatchweek = currentMatchweek;
        
        if (direction === 'previous' && currentMatchweek > 1) {
            newMatchweek -= 1;
        } else if (direction === 'next' && currentMatchweek < TOTAL_MATCHWEEKS) {
            newMatchweek += 1;
        }
        
        // Only reload if the week number actually changed (i.e., not disabled)
        if (newMatchweek !== currentMatchweek) {
            currentMatchweek = newMatchweek;
            console.log(`Navigating to Matchweek: ${currentMatchweek}. Reloading data...`);
            loadScheduleData(); 
        }
    };

    // **********************************************
    // EVENT LISTENERS AND INITIALIZATION
    // **********************************************
    
    // Attach click listeners to the navigation buttons
    prevButton?.addEventListener('click', () => handleMatchweekNav('previous'));
    nextButton?.addEventListener('click', () => handleMatchweekNav('next'));
    
    // Set active class for the current page link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.textContent.trim() === 'Matches') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Initial load: Start the process
    loadScheduleData();
});

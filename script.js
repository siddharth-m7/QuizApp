// Cache to store fetched events
const eventCache = {};

// Preload some facts
const preloadedFacts = [
    "In 1969, Apollo 11 landed on the moon, marking the first human step on another celestial body.",
    "In 1989, the World Wide Web was invented by Tim Berners-Lee, revolutionizing information sharing.",
    "In 1455, Johannes Gutenberg completed printing the Bible, ushering in the age of the printed book.",
    "In 1903, the Wright brothers made the first controlled, sustained flight of a powered aircraft.",
    "In 1928, Alexander Fleming discovered penicillin, paving the way for modern antibiotics."
];

// Function to get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to format date as MM/DD
function formatDate(month, day) {
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
}

async function fetchEvents(month, day) {
    const dateKey = formatDate(month, day);
    if (eventCache[dateKey]) {
        return eventCache[dateKey];
    }

    const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.events && data.events.length > 0) {
        eventCache[dateKey] = data.events;
        return data.events;
    }
    return null;
}

async function generateFact() {
    const factElement = document.getElementById('fact');
    
    // Immediately show a preloaded fact
    factElement.textContent = getRandomItem(preloadedFacts);
    
    // Generate a random month and day
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;

    try {
        const events = await fetchEvents(month, day);
        if (events) {
            const randomEvent = getRandomItem(events);
            factElement.textContent = `On ${formatDate(month, day)}/${randomEvent.year}: ${randomEvent.text}`;
        }
    } catch (error) {
        console.error('Error:', error);
        // Keep showing the preloaded fact if there's an error
    }
}

// Preload events for some dates
async function preloadEvents() {
    const datesToPreload = [
        [7, 4], [12, 25], [1, 1], [10, 31], [3, 17]
    ];
    
    for (const [month, day] of datesToPreload) {
        await fetchEvents(month, day);
    }
}

// Call preloadEvents when the page loads
preloadEvents();

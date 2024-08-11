// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const factElement = document.getElementById('randomFact');
    const newFactButton = document.getElementById('newFactButton');
    
    // Function to fetch a random knowable fact
    function fetchRandomFact() {
        const randomNum = Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000
        fetch(`http://numbersapi.com/${randomNum}/trivia`)
            .then(response => response.text())
            .then(data => {
                factElement.textContent = data;
            })
            .catch(error => {
                console.error('Error fetching the fact:', error);
                factElement.textContent = 'An error occurred. Please try again.';
            });
    }

    // Load a fact when the page loads
    fetchRandomFact();

    // Load a new fact when the button is clicked
    newFactButton.addEventListener('click', fetchRandomFact);
});

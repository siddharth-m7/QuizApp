function generateFact() {
    const factElement = document.getElementById('fact');
    factElement.textContent = 'Loading...';

    // Generate a random year between 1400 and 2023
    const year = Math.floor(Math.random() * (2023 - 1400 + 1)) + 1400;

    fetch(`http://numbersapi.com/${year}/year`)
        .then(response => response.text())
        .then(data => {
            factElement.textContent = data;
        })
        .catch(error => {
            factElement.textContent = 'Failed to load fact. Please try again.';
            console.error('Error:', error);
        });
}

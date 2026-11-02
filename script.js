document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('pokemon-input');
    const searchButton = document.getElementById('buscar-btn');
    const statusMessage = document.getElementById('status-message');
    const pokemonContainer = document.getElementById('pokemon-container');

    function createPokemonCard(data) {
        const imageUrl = data.sprites.front_default;
        return `
            <div class="pokemon-card">
                <img src="${imageUrl}" alt="${data.name}" style="width: 150px;">
                <h2 style="text-transform: capitalize; margin-bottom: 10px;">${data.name}</h2>
                <p><strong>ID:</strong> ${data.id}</p>
                <p><strong>Altura:</strong> ${data.height / 10} m</p>
                <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
            </div>`;
    }

    async function loadInitialPokemon() {
        statusMessage.textContent = 'Cargando Pokemon iniciales...';
        statusMessage.style.color = 'blue';

        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=8');
            const data = await response.json();

            const pokemonPromises = data.results.map(async (pokemon) => {
                const detailedResponse = await fetch(pokemon.url);
                return await detailedResponse.json();
            });

            const detailedPokemon = await Promise.all(pokemonPromises);

            let htmlContent = '';
            detailedPokemon.forEach(pokemon => {
                htmlContent += createPokemonCard(pokemon);
            });

            pokemonContainer.innerHTML = htmlContent;
            statusMessage.textContent = '';
        } catch (error) {
            statusMessage.textContent = 'Error al cargar Pokemon';
            statusMessage.style.color = 'red';
        }
    }

    async function searchPokemon() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        pokemonContainer.innerHTML = '';
        statusMessage.textContent = 'Cargando...';
        statusMessage.style.color = 'blue';

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

            if (!response.ok) {
                throw new Error('Not Found');
            }

            const data = await response.json();
            statusMessage.textContent = '';
            pokemonContainer.innerHTML = createPokemonCard(data);

        } catch (error) {
            statusMessage.textContent = 'No encontrado';
            statusMessage.style.color = 'red';
            pokemonContainer.innerHTML = '';
        }
    }

    searchButton.addEventListener('click', searchPokemon);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPokemon();
    });

    // Cargar los primeros 8 al iniciar
    loadInitialPokemon();
});
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('pokemon-search');
    const searchButton = document.getElementById('search-button');
    const statusMessage = document.getElementById('status-message');
    const pokemonList = document.getElementById('pokemon-list');

    async function searchPokemon() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        // 1. MOSTRAR "CARGANDO" SIEMPRE
        pokemonList.innerHTML = '';
        statusMessage.textContent = 'Cargando...';
        statusMessage.style.color = 'blue';

        try {
            // CONEXIÓN REAL A POKEAPI
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

            if (!response.ok) {
                // Si la respuesta no es 200 (ej. 404 Not Found), lanzamos error
                throw new Error('Not Found');
            }

            const data = await response.json();

            // 2. MOSTRAR RESULTADOS
            statusMessage.textContent = ''; // Quitamos el "Cargando..."

            // Obtenemos la imagen del pokemon
            const imageUrl = data.sprites.front_default;

            pokemonList.innerHTML = `
                <div class="pokemon-card">
                    <img src="${imageUrl}" alt="${data.name}" style="width: 150px;">
                    <h2 style="text-transform: capitalize;">${data.name}</h2>
                    <p><strong>ID:</strong> ${data.id}</p>
                    <p><strong>Altura:</strong> ${data.height / 10} m</p>
                    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
                </div>`;

        } catch (error) {
            // 3. MOSTRAR "NO ENCONTRADO"
            // Si el fetch falló o el pokemon no existe (404)
            statusMessage.textContent = 'No encontrado';
            statusMessage.style.color = 'red';
            pokemonList.innerHTML = '';
        }
    }

    searchButton.addEventListener('click', searchPokemon);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPokemon();
    });
});
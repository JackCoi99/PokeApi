document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('pokemon-input');
    const searchButton = document.getElementById('buscar-btn');
    const statusMessage = document.getElementById('status-message');
    const pokemonContainer = document.getElementById('pokemon-container');

    // Guardamos los Pokémon que aparecen en pantalla
    let currentPokemonList = [];

    // Caché para evitar repetir peticiones de traducción
    const translationCache = new Map();


    // TRADUCCIÓN DE TIPOS

    const typeTranslations = {
        normal: 'Normal',
        fire: 'Fuego',
        water: 'Agua',
        electric: 'Eléctrico',
        grass: 'Planta',
        ice: 'Hielo',
        fighting: 'Lucha',
        poison: 'Veneno',
        ground: 'Tierra',
        flying: 'Volador',
        psychic: 'Psíquico',
        bug: 'Bicho',
        rock: 'Roca',
        ghost: 'Fantasma',
        dragon: 'Dragón',
        dark: 'Siniestro',
        steel: 'Acero',
        fairy: 'Hada'
    };


    // TRADUCCIÓN DE ESTADÍSTICAS

    const statTranslations = {
        hp: 'Puntos de salud',
        attack: 'Ataque',
        defense: 'Defensa',
        'special-attack': 'Ataque especial',
        'special-defense': 'Defensa especial',
        speed: 'Velocidad'
    };


    // TRADUCCIÓN DE NATURALEZAS

    const natureTranslations = {
        adamant: 'Firme',
        bashful: 'Tímida',
        bold: 'Osada',
        brave: 'Audaz',
        calm: 'Serena',
        careful: 'Cauta',
        docile: 'Dócil',
        gentle: 'Amable',
        hardy: 'Fuerte',
        hasty: 'Activa',
        impish: 'Agitada',
        jolly: 'Alegre',
        lax: 'Floja',
        lonely: 'Huraña',
        mild: 'Afable',
        modest: 'Modesta',
        naive: 'Ingenua',
        naughty: 'Pícara',
        quiet: 'Mansa',
        quirky: 'Rara',
        rash: 'Alocada',
        relaxed: 'Plácida',
        sassy: 'Grosera',
        serious: 'Seria',
        timid: 'Miedosa'
    };


    // DESCRIPCIONES DE NATURALEZAS

    const natureDescriptions = {
        adamant: 'Aumenta el Ataque y reduce el Ataque especial.',
        jolly: 'Aumenta la Velocidad y reduce el Ataque especial.',
        modest: 'Aumenta el Ataque especial y reduce el Ataque.',
        timid: 'Aumenta la Velocidad y reduce el Ataque.',
        bold: 'Aumenta la Defensa y reduce el Ataque.',
        calm: 'Aumenta la Defensa especial y reduce el Ataque.',
        careful: 'Aumenta la Defensa especial y reduce el Ataque especial.',
        brave: 'Aumenta el Ataque y reduce la Velocidad.',
        quiet: 'Aumenta el Ataque especial y reduce la Velocidad.',
        relaxed: 'Aumenta la Defensa y reduce la Velocidad.'
    };


    // FORMATEAR NOMBRES

    function formatName(name) {
        return name
            .replace(/-/g, ' ')
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }


    // OBTENER NOMBRE EN ESPAÑOL DESDE POKEAPI

    async function getSpanishName(url) {

        if (translationCache.has(url)) {
            return translationCache.get(url);
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('No se pudo obtener la traducción');
            }

            const data = await response.json();

            const spanishName = data.names?.find(
                item => item.language.name === 'es'
            );

            const translatedName = spanishName
                ? spanishName.name
                : formatName(data.name);

            translationCache.set(url, translatedName);

            return translatedName;

        } catch (error) {
            console.error('Error al traducir:', error);
            return 'Nombre no disponible';
        }
    }


    // OBTENER TIPO EN ESPAÑOL

    function translateType(type) {
        return typeTranslations[type] || formatName(type);
    }


    // OBTENER ESTADÍSTICA EN ESPAÑOL

    function translateStat(stat) {
        return statTranslations[stat] || formatName(stat);
    }


    // CARGAR LOS PRIMEROS 8 POKÉMON

    async function loadInitialPokemon() {

        statusMessage.textContent = 'Cargando Pokémon iniciales...';
        statusMessage.style.color = 'blue';

        pokemonContainer.innerHTML = '';

        try {

            const response = await fetch(
                'https://pokeapi.co/api/v2/pokemon?limit=8'
            );

            if (!response.ok) {
                throw new Error('Error al cargar los Pokémon');
            }

            const data = await response.json();

            const pokemonPromises = data.results.map(async pokemon => {

                const detailedResponse = await fetch(pokemon.url);

                if (!detailedResponse.ok) {
                    throw new Error('Error al cargar un Pokémon');
                }

                return await detailedResponse.json();
            });

            const detailedPokemon = await Promise.all(pokemonPromises);

            currentPokemonList = detailedPokemon;

            renderPokemonList(detailedPokemon);

            statusMessage.textContent = '';

        } catch (error) {

            console.error(error);

            statusMessage.textContent =
                'Error al cargar los Pokémon. Inténtalo de nuevo.';

            statusMessage.style.color = 'red';
        }
    }


    // CREAR TARJETA DE POKÉMON

    function createPokemonCard(pokemon) {

        const imageUrl =
            pokemon.sprites.other?.['official-artwork']?.front_default ||
            pokemon.sprites.front_default;

        const typesHTML = pokemon.types.map(item => `
            <span class="tipo">
                ${translateType(item.type.name)}
            </span>
        `).join('');

        return `
            <article class="pokemon-card">

                <img
                    src="${imageUrl}"
                    alt="${pokemon.name}"
                >

                <h2>${formatName(pokemon.name)}</h2>

                <p><strong>ID:</strong> ${pokemon.id}</p>

                <p>
                    <strong>Altura:</strong>
                    ${pokemon.height / 10} m
                </p>

                <p>
                    <strong>Peso:</strong>
                    ${pokemon.weight / 10} kg
                </p>

                <div class="tipos">
                    ${typesHTML}
                </div>

                <button
                    class="btn-principal"
                    data-action="details"
                    data-id="${pokemon.id}"
                >
                    Ver más
                </button>

            </article>
        `;
    }


    // MOSTRAR LISTA DE POKÉMON

    function renderPokemonList(pokemonList) {

        pokemonContainer.innerHTML = pokemonList
            .map(pokemon => createPokemonCard(pokemon))
            .join('');

    }


    // BUSCAR POKÉMON

    async function searchPokemon() {

        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            return;
        }

        pokemonContainer.innerHTML = '';

        statusMessage.textContent = 'Buscando Pokémon...';
        statusMessage.style.color = 'blue';

        try {

            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`
            );

            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }

            const pokemon = await response.json();

            currentPokemonList = [pokemon];

            renderPokemonList(currentPokemonList);

            statusMessage.textContent = '';

        } catch (error) {

            statusMessage.textContent =
                'Pokémon no encontrado. Comprueba el nombre o el ID.';

            statusMessage.style.color = 'red';

            pokemonContainer.innerHTML = '';
        }
    }


    // CALCULAR DEBILIDADES

    async function getWeaknesses(pokemon) {

        const typeResponses = await Promise.all(
            pokemon.types.map(async item => {

                const response = await fetch(item.type.url);

                if (!response.ok) {
                    throw new Error('Error al cargar los tipos');
                }

                return await response.json();
            })
        );

        const allTypes = Object.keys(typeTranslations);

        const weaknesses = [];

        allTypes.forEach(attackType => {

            let multiplier = 1;

            typeResponses.forEach(typeData => {

                const relations = typeData.damage_relations;

                if (
                    relations.double_damage_from.some(
                        item => item.name === attackType
                    )
                ) {
                    multiplier *= 2;
                }

                if (
                    relations.half_damage_from.some(
                        item => item.name === attackType
                    )
                ) {
                    multiplier *= 0.5;
                }

                if (
                    relations.no_damage_from.some(
                        item => item.name === attackType
                    )
                ) {
                    multiplier = 0;
                }
            });

            if (multiplier > 1) {
                weaknesses.push({
                    name: translateType(attackType),
                    multiplier: multiplier
                });
            }
        });

        return weaknesses;
    }


    // OBTENER HABILIDADES EN ESPAÑOL

    async function getAbilities(pokemon) {

        const abilities = await Promise.all(

            pokemon.abilities.map(async item => {

                const name = await getSpanishName(
                    item.ability.url
                );

                return {
                    name: name,
                    hidden: item.is_hidden
                };
            })

        );

        return abilities;
    }


    // OBTENER MOVIMIENTOS EN ESPAÑOL

    async function getMoves(pokemon) {

        const moves = await Promise.all(

            pokemon.moves.slice(0, 10).map(async item => {

                return await getSpanishName(
                    item.move.url
                );

            })

        );

        return moves;
    }


    // RECOMENDAR NATURALEZA SEGÚN LAS ESTADÍSTICAS

    function getRecommendedNature(pokemon) {

        const stats = {};

        pokemon.stats.forEach(item => {
            stats[item.stat.name] = item.base_stat;
        });

        const attack = stats.attack;
        const specialAttack = stats['special-attack'];
        const defense = stats.defense;
        const specialDefense = stats['special-defense'];
        const speed = stats.speed;

        let nature;

        if (attack > specialAttack) {

            nature = speed >= 90 ? 'jolly' : 'adamant';

        } else if (specialAttack > attack) {

            nature = speed >= 90 ? 'timid' : 'modest';

        } else if (defense > specialDefense) {

            nature = 'bold';

        } else if (specialDefense > defense) {

            nature = 'calm';

        } else {

            nature = speed >= 100 ? 'jolly' : 'careful';
        }

        return {
            name: natureTranslations[nature] || formatName(nature),
            description: natureDescriptions[nature] ||
                'Esta naturaleza ofrece una combinación equilibrada de estadísticas.'
        };
    }


    // CREAR HTML DE LAS ESTADÍSTICAS

    function createStatsHTML(pokemon) {

        return pokemon.stats.map(item => {

            const statName = translateStat(item.stat.name);
            const statValue = item.base_stat;

            const percentage = Math.min(
                (statValue / 255) * 100,
                100
            );

            return `
                <div class="stat-row">

                    <span class="stat-name">
                        ${statName}
                    </span>

                    <div class="stat-bar">
                        <div
                            class="stat-fill"
                            style="width: ${percentage}%"
                        ></div>
                    </div>

                    <span class="stat-value">
                        ${statValue}
                    </span>

                </div>
            `;

        }).join('');
    }

    // VOLVER A LA LISTA INICIAL DE LOS 8 POKÉMON

    async function returnToHome() {
    searchInput.value = '';
    await loadInitialPokemon();
    }

    // MOSTRAR DETALLES DEL POKÉMON

    async function showPokemonDetails(pokemonId) {

        statusMessage.textContent = 'Cargando detalles...';
        statusMessage.style.color = 'blue';

        pokemonContainer.innerHTML = '';

        try {

            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
            );

            if (!response.ok) {
                throw new Error('No se pudieron cargar los detalles');
            }

            const pokemon = await response.json();

            // Recuperamos los datos adicionales en paralelo
            const [
                weaknesses,
                abilities,
                moves
            ] = await Promise.all([

                getWeaknesses(pokemon),
                getAbilities(pokemon),
                getMoves(pokemon)

            ]);

            const recommendedNature = getRecommendedNature(pokemon);

            const imageUrl =
                pokemon.sprites.other?.['official-artwork']?.front_default ||
                pokemon.sprites.front_default;

            const typesHTML = pokemon.types.map(item => `
                <span class="tipo">
                    ${translateType(item.type.name)}
                </span>
            `).join('');

            const weaknessesHTML = weaknesses.length > 0

                ? weaknesses.map(item => `
                    <span class="tipo-debilidad">
                        ${item.name} ×${item.multiplier}
                    </span>
                `).join('')

                : '<p>Este Pokémon no tiene debilidades de tipo.</p>';


            const abilitiesHTML = abilities.map(item => `
                <li>
                    ${item.name}
                    ${item.hidden ? '(Habilidad oculta)' : ''}
                </li>
            `).join('');


            const movesHTML = moves.map(move => `
                <li>${move}</li>
            `).join('');


            pokemonContainer.innerHTML = `

                <article class="pokemon-detail">

                    <div class="detail-header">

                        <img
                            src="${imageUrl}"
                            alt="${pokemon.name}"
                        >

                        <h2>
                            ${formatName(pokemon.name)}
                        </h2>

                        <p><strong>ID:</strong> ${pokemon.id}</p>

                        <div class="tipos">
                            ${typesHTML}
                        </div>

                    </div>


                    <section class="detail-section">

                        <h3>Información general</h3>

                        <p>
                            <strong>Altura:</strong>
                            ${pokemon.height / 10} m
                        </p>

                        <p>
                            <strong>Peso:</strong>
                            ${pokemon.weight / 10} kg
                        </p>

                        <p>
                            <strong>Experiencia base:</strong>
                            ${pokemon.base_experience ?? 'No disponible'}
                        </p>

                    </section>


                    <section class="detail-section">

                        <h3>Debilidades</h3>

                        <div class="debilidades">
                            ${weaknessesHTML}
                        </div>

                    </section>


                    <section class="detail-section">

                        <h3>Habilidades</h3>

                        <ul>
                            ${abilitiesHTML}
                        </ul>

                    </section>


                    <section class="detail-section">

                        <h3>Estadísticas</h3>

                        ${createStatsHTML(pokemon)}

                    </section>


                    <section class="detail-section">

                        <h3>Movimientos</h3>

                        <ul>
                            ${movesHTML}
                        </ul>

                        <p>
                            <small>
                                Se muestran los primeros 10 movimientos disponibles.
                            </small>
                        </p>

                    </section>


                    <section class="detail-section">

                        <h3>Naturaleza recomendada</h3>

                        <div class="naturaleza">

                            <p>
                                <strong>${recommendedNature.name}</strong>
                            </p>

                            <p>
                                ${recommendedNature.description}
                            </p>

                            <p>
                                <small>
                                    Recomendación orientativa basada en las estadísticas base del Pokémon.
                                    No representa la naturaleza más utilizada por los jugadores.
                                </small>
                            </p>

                        </div>

                    </section>

                        <div class="volver-container">

                            <button
                            class="btn-volver"
                            data-action="back"
                            >
                                    Volver
                            </button>

                            <button
                            class="btn-principal"
                            data-action="home"
                            >
                                    Volver al inicio
                            </button>

                        </div>

                </article>

            `;

            statusMessage.textContent = '';

        } catch (error) {

            console.error(error);

            statusMessage.textContent =
                'Error al cargar los detalles del Pokémon.';

            statusMessage.style.color = 'red';
        }
    }


    // GESTIONAR LOS CLICS DE LAS TARJETAS Y BOTONES

    pokemonContainer.addEventListener('click', event => {

        const button = event.target.closest('button[data-action]');

        if (!button) {
            return;
        }

        const action = button.dataset.action;

        if (action === 'details') {

            const pokemonId = button.dataset.id;

            showPokemonDetails(pokemonId);
        }

        if (action === 'back') {

    renderPokemonList(currentPokemonList);

    statusMessage.textContent = '';
}

if (action === 'home') {

    returnToHome();
    }    
});


    // EVENTOS DEL BUSCADOR

    searchButton.addEventListener('click', searchPokemon);

    searchInput.addEventListener('keydown', event => {

        if (event.key === 'Enter') {
            searchPokemon();
        }

    });


    // CARGAR LOS PRIMEROS 8 POKÉMON AL INICIAR

    loadInitialPokemon();

});
# Pokémon Explorer

## Descripción del proyecto

Pokémon Explorer es un proyecto web desarrollado como parte de un ejercicio práctico de desarrollo frontend. Su objetivo es aprender a consumir una API externa utilizando JavaScript y mostrar la información obtenida de forma dinámica en una interfaz web.

La aplicación utiliza [PokéAPI](https://pokeapi.co/) para consultar información sobre diferentes Pokémon, permitiendo al usuario buscar personajes, visualizar sus datos principales y acceder a una vista de detalle.

El proyecto trabaja los fundamentos de las solicitudes HTTP, el procesamiento de respuestas JSON, la manipulación del DOM y el diseño responsive.

## Objetivos del proyecto

- Comprender cómo funciona una API REST y cómo realizar solicitudes desde JavaScript.
- Utilizar `fetch()` para obtener información de una API externa.
- Procesar respuestas en formato JSON.
- Mostrar información dinámica mediante la manipulación del DOM.
- Implementar un sistema de búsqueda y selección de elementos.
- Crear una vista de detalle para consultar información específica.
- Adaptar la interfaz a diferentes tamaños de pantalla mediante CSS responsive.

## Funcionalidades

### Consulta y visualización de datos

- Búsqueda de Pokémon mediante la API.
- Obtención dinámica de información en formato JSON.
- Visualización de imágenes, nombres e identificadores.
- Presentación de los resultados mediante tarjetas.

### Interacción y navegación

- Selección de Pokémon para consultar información adicional.
- Acceso a una ficha individual con información detallada.
- Navegación entre la vista principal y la vista de detalle.
- Gestión de estados de carga y mensajes de error.

### Diseño y adaptación

- Estructura organizada mediante `header`, `main` y `footer`.
- Distribución de elementos utilizando Flexbox o CSS Grid.
- Diseño responsive mediante media queries.
- Adaptación de botones y elementos interactivos a dispositivos móviles.

## Tecnologías utilizadas

- **HTML5:** Estructura y organización del contenido.
- **CSS3:** Diseño visual, Flexbox, Grid y responsive design.
- **JavaScript:** Lógica de la aplicación, consumo de API y manipulación del DOM.
- **Fetch API:** Realización de solicitudes HTTP.
- **JSON:** Formato utilizado para recibir y procesar los datos.
- **PokéAPI:** Fuente externa de información sobre Pokémon.

## API utilizada

El proyecto utiliza [PokéAPI](https://pokeapi.co/), una API REST pública que proporciona información sobre el universo Pokémon.

**URL base:**

```text
https://pokeapi.co/api/v2/
```

**Endpoint de consulta de Pokémon:**

```text
https://pokeapi.co/api/v2/pokemon/{id or name}
```

Ejemplo:

```text
https://pokeapi.co/api/v2/pokemon/pikachu
```

La información obtenida puede incluir identificadores, nombres, imágenes, tipos, habilidades, estadísticas y otros atributos de cada Pokémon.

Documentación oficial: https://pokeapi.co/docs/v2

## Instalación y ejecución

1. Clonar el repositorio:

```bash
git clone <repository-url>
```

2. Acceder a la carpeta del proyecto:

```bash
cd pokemon-explorer
```

3. Abrir el proyecto en Visual Studio Code:

```bash
code .
```

4. Ejecutar el archivo HTML utilizando Live Server o un servidor local equivalente.

No es necesario configurar una clave API para realizar las consultas a PokéAPI.

## Estructura del proyecto

```text
pokemon-explorer/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│
└── README.md
```

*La estructura anterior es orientativa y debe ajustarse a la organización real de los archivos del proyecto.*

## Publicación

El proyecto está preparado para su publicación mediante **GitHub Pages**, permitiendo acceder a la aplicación directamente desde el navegador.

- **Repositorio:** <repository-url>
- **Web publicada:** <github-pages-url>

## Autor

Proyecto desarrollado como ejercicio práctico de aprendizaje de desarrollo web frontend y consumo de APIs REST.</p>

## Créditos

- [PokéAPI](https://pokeapi.co/)
- [Documentación oficial de PokéAPI](https://pokeapi.co/docs/v2)

Pokémon es una marca registrada de Nintendo, Game Freak y The Pokémon Company. Este proyecto tiene fines exclusivamente educativos y no está afiliado a dichas compañías.
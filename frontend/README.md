# Demon Slayer Characters App

Aplicación React que muestra personajes del anime Demon Slayer, con funcionalidad de favoritos gestionada mediante estado global.

## Implementación de Estado Global

### Context API
Se implementó un contexto global utilizando:
- `createContext`: Para crear el contexto de favoritos
- `Provider`: Componente `FavoritesProvider` que envuelve la aplicación
- `useContext`: Hook personalizado `useFavorites` para acceder al estado

### useReducer
Se utilizó `useReducer` para manejar el estado de los favoritos con las siguientes acciones:
- `ADD_FAVORITE`: Agregar un nuevo favorito
- `EDIT_FAVORITE`: Editar el nombre de un favorito existente
- `DELETE_FAVORITE`: Eliminar un favorito
- `LOAD_FAVORITES`: Cargar la lista inicial de favoritos
- `SET_LOADING`: Gestionar estado de carga
- `SET_ERROR`: Gestionar errores

### Estructura del Código
```
src/
  context/
    FavoritesContext.jsx  # Contexto y reducer para favoritos
  App.jsx                 # Componente principal que usa el contexto
  main.jsx               # Punto de entrada con el Provider
```

### Funcionalidades
- **Agregar favorito**: Agrega un personaje a la lista de favoritos
- **Editar favorito**: Permite cambiar el nombre de un favorito (usando prompt simple)
- **Eliminar favorito**: Remueve un personaje de los favoritos
- **Visualización**: Los personajes marcados como favoritos aparecen primero en la lista

### API Backend
La aplicación se conecta a un backend Express que maneja:
- GET /api/characters/external: Obtiene personajes de la API externa
- GET /api/characters: Obtiene la lista de favoritos
- POST /api/characters: Agrega un nuevo favorito
- PUT /api/characters/:id: Edita un favorito existente
- DELETE /api/characters/:id: Elimina un favorito

## Instalación y Ejecución

1. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Ejecutar el backend:
```bash
cd backend
npm start
```

4. Ejecutar el frontend:
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` y el backend en `http://localhost:5000`.

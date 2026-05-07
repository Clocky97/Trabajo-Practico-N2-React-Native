import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  favorites: [],
  loading: false,
  error: null
};

const ADD_FAVORITE = 'ADD_FAVORITE';
const EDIT_FAVORITE = 'EDIT_FAVORITE';
const DELETE_FAVORITE = 'DELETE_FAVORITE';
const LOAD_FAVORITES = 'LOAD_FAVORITES';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case LOAD_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
        loading: false,
        error: null
      };
    case ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        loading: false,
        error: null
      };
    case EDIT_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.map(fav =>
          fav.id === action.payload.id ? { ...fav, name: action.payload.name } : fav
        ),
        loading: false,
        error: null
      };
    case DELETE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(fav => fav.id !== action.payload),
        loading: false,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  const loadFavorites = async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axios.get("http://localhost:5000/api/characters");
      dispatch({ type: LOAD_FAVORITES, payload: res.data });
    } catch (error) {
      console.error('Error loading favorites:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const addFavorite = async (character) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axios.post("http://localhost:5000/api/characters", {
        name: character.name
      });
      dispatch({ type: ADD_FAVORITE, payload: res.data });
    } catch (error) {
      console.error('Error adding favorite:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const editFavorite = async (id, newName) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const res = await axios.put(`http://localhost:5000/api/characters/${id}`, {
        name: newName
      });
      dispatch({ type: EDIT_FAVORITE, payload: { id, name: newName } });
    } catch (error) {
      console.error('Error editing favorite:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  const deleteFavorite = async (id) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      await axios.delete(`http://localhost:5000/api/characters/${id}`);
      dispatch({ type: DELETE_FAVORITE, payload: id });
    } catch (error) {
      console.error('Error deleting favorite:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const value = {
    ...state,
    addFavorite,
    editFavorite,
    deleteFavorite,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
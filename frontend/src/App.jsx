import { useEffect, useState } from "react"
import axios from "axios"
import { useFavorites } from "./context/FavoritesContext.jsx"

function App() {
  const [characters, setCharacters] = useState([])
  const [allCharacters, setAllCharacters] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingAll, setLoadingAll] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('all')
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const { favorites, addFavorite, editFavorite, deleteFavorite } = useFavorites()

  const loadPage = async (pageNumber = 1) => {
    setLoadingPage(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/characters/external?page=${pageNumber}`)
      setCharacters(res.data?.content || [])
      setPagination(res.data?.pagination || null)
      setPage(pageNumber)
    } catch (error) {
      console.error(error)
      setCharacters([])
      setPagination(null)
    } finally {
      setLoadingPage(false)
    }
  }

  const loadAllCharacters = async () => {
    setLoadingAll(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/characters/external`)
      setAllCharacters(Array.isArray(res.data) ? res.data : res.data?.content || [])
    } catch (error) {
      console.error('Error loading all characters:', error)
      setAllCharacters([])
    } finally {
      setLoadingAll(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'all') {
      if (viewMode === 'all') {
        loadAllCharacters()
      } else {
        loadPage(1)
      }
    }
  }, [activeTab, viewMode])

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'paged' ? 'all' : 'paged')
  }

  const agregarFavorito = async (character) => {
    await addFavorite(character)
  }

  const eliminarFavorito = async (id) => {
    await deleteFavorite(id)
  }

  const editarFavorito = async (id, currentName) => {
    const newName = prompt("Editar nombre del favorito:", currentName)
    if (newName && newName !== currentName) {
      await editFavorite(id, newName)
    }
  }

  const openCharacter = (character) => {
    setSelectedCharacter(character)
  }

  const closeCharacter = () => {
    setSelectedCharacter(null)
  }

  const isFavorite = (characterName) => {
    return favorites.some(f => f.name === characterName)
  }

  const getFavoriteId = (characterName) => {
    const fav = favorites.find(f => f.name === characterName)
    return fav?.id
  }

  const goToPreviousPage = () => {
    if (pagination?.currentPage > 1) {
      loadPage(pagination.currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (pagination?.currentPage < pagination?.totalPages) {
      loadPage(pagination.currentPage + 1)
    }
  }

  const sortedCharacters = [...(viewMode === 'all' ? allCharacters : characters)].sort((a, b) => {
    const aIsFav = isFavorite(a.name) ? 1 : 0
    const bIsFav = isFavorite(b.name) ? 1 : 0
    return bIsFav - aIsFav
  })

  const favoriteCharacters = (viewMode === 'all' ? allCharacters : characters).filter(c => isFavorite(c.name))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: 0 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(90deg, rgba(15,52,96,0.8) 0%, rgba(26,26,46,0.9) 100%)', backdropFilter: 'blur(10px)', padding: '24px', borderBottom: '2px solid rgba(255,105,180,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
            Demon Slayer
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#a0aec0', fontSize: 14, fontWeight: 500 }}>Explora los personajes del anime</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Sección de personajes */}
        <div>
          <h2 style={{ fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 700 }}>{activeTab === 'all' ? 'Personajes' : 'Favoritos'}</h2>
          <p style={{ color: '#cbd5e0', marginBottom: 24, fontSize: 15 }}>{activeTab === 'all' ? 'Descubre Personajes' : 'Tus personajes favoritos guardados'}</p>

          {/* Pestañas */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'all' ? 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Todos los personajes
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === 'favorites' ? 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)' : 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Favoritos ({favorites.length})
            </button>
          </div>

          {/* Toggle para modo de vista - solo en pestaña "Todos los personajes" */}
          {activeTab === 'all' && (
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={toggleViewMode}
                disabled={loadingPage || loadingAll}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'rgba(0,212,255,0.1)',
                  color: '#00d4ff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,212,255,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(0,212,255,0.2)'
                  e.target.style.borderColor = 'rgba(0,212,255,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0,212,255,0.1)'
                  e.target.style.borderColor = 'rgba(0,212,255,0.3)'
                }}
              >
                {loadingAll ? 'Cargando...' : viewMode === 'paged' ? 'Ver todos los personajes' : 'Ver paginado'}
              </button>
            </div>
          )}

          {/* Paginación - solo en modo paginado */}
          {activeTab === 'all' && viewMode === 'paged' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
              <button
                onClick={goToPreviousPage}
                disabled={loadingPage || !pagination || pagination.currentPage <= 1}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: pagination?.currentPage > 1 ? 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)' : '#4a5568',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: pagination?.currentPage > 1 ? 'pointer' : 'not-allowed',
                  opacity: pagination?.currentPage > 1 ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  fontSize: 14
                }}
              >
                ← Anterior
              </button>
              <button
                onClick={goToNextPage}
                disabled={loadingPage || !pagination || pagination.currentPage >= pagination.totalPages}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: pagination?.currentPage < pagination?.totalPages ? 'linear-gradient(90deg, #00d4ff 0%, #0099ff 100%)' : '#4a5568',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: pagination?.currentPage < pagination?.totalPages ? 'pointer' : 'not-allowed',
                  opacity: pagination?.currentPage < pagination?.totalPages ? 1 : 0.5,
                  transition: 'all 0.3s ease',
                  fontSize: 14
                }}
              >
                Siguiente →
              </button>
              {pagination && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(0,212,255,0.3)' }}>
                    <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>
                      Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                  </div>
                  <span style={{ color: '#a0aec0', fontSize: 13 }}>{pagination.totalElements} personajes</span>
                </div>
              )}
            </div>
          )}

          {/* Grid de personajes */}
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {(activeTab === 'all' ? sortedCharacters : favoriteCharacters).map((c) => {
              const isFav = isFavorite(c.name)
              const favId = getFavoriteId(c.name)
              return (
                <div
                  key={c.id || c.name}
                  style={{
                    background: 'linear-gradient(135deg, rgba(31,55,99,0.8) 0%, rgba(15,52,96,0.9) 100%)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '2px solid rgba(0,212,255,0.2)',
                    backdrop: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative'
                  }}
                  onClick={() => openCharacter(c)}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.border = '2px solid rgba(255,107,166,0.6)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(255,107,166,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.border = '2px solid rgba(0,212,255,0.2)'
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)'
                  }}
                >
                  {isFav && (
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, fontSize: 24 }}>⭐</div>
                  )}

                  {c.img && (
                    <div style={{ position: 'relative', overflow: 'hidden', height: 200, background: '#fff', flex: '0 0 auto' }}>
                      <img
                        src={c.img}
                        alt={c.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '8px',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)' }}
                        onMouseLeave={(e) => { e.target.style.transform = 'scale(1)' }}
                      />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)' }} />
                    </div>
                  )}
                  <div style={{ padding: 16, flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700, color: '#fff' }}>{c.name}</h3>
                    <div style={{ display: 'grid', gap: 6, marginBottom: 12, fontSize: 12 }}>
                      <p style={{ margin: 0, color: '#cbd5e0' }}>
                        <span style={{ color: '#ff6ba6', fontWeight: 600 }}>Edad:</span> {c.age ?? 'N/A'}
                      </p>
                      <p style={{ margin: 0, color: '#cbd5e0' }}>
                        <span style={{ color: '#00d4ff', fontWeight: 600 }}>Género:</span> {c.gender ?? 'N/A'}
                      </p>
                      <p style={{ margin: 0, color: '#cbd5e0' }}>
                        <span style={{ color: '#a78bfa', fontWeight: 600 }}>Raza:</span> {c.race ?? 'N/A'}
                      </p>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: 11, lineHeight: 1.5, color: '#a0aec0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', flex: 1 }}>
                      {c.description || 'Sin descripción disponible.'}
                    </p>
                    
                    {/* Botones de acción */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      {isFav ? (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); editarFavorito(favId, c.name) }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 6,
                              border: 'none',
                              background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
                              color: '#fff',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: 12,
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.boxShadow = '0 4px 15px rgba(167,139,250,0.4)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.boxShadow = 'none'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); eliminarFavorito(favId) }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 6,
                              border: 'none',
                              background: 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)',
                              color: '#fff',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: 12,
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.boxShadow = '0 4px 15px rgba(255,107,166,0.4)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.boxShadow = 'none'
                            }}
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); agregarFavorito(c) }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 13,
                            transition: 'all 0.3s ease',
                            borderColor: 'rgba(0,212,255,0.3)',
                            borderWidth: '1px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.15)'
                            e.target.style.borderColor = 'rgba(0,212,255,0.6)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.1)'
                            e.target.style.borderColor = 'rgba(0,212,255,0.3)'
                          }}
                        >
                          Agregar a favoritos
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedCharacter && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 1000
          }}
          onClick={closeCharacter}
        >
          <div
            style={{
              maxWidth: 680,
              width: '100%',
              background: '#0f172a',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
              color: '#f8fafc',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeCharacter}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                border: 'none',
                background: 'transparent',
                color: '#cbd5e0',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700
              }}
            >
              Cerrar
            </button>
            <h2 style={{ margin: '0 0 12px 0', fontSize: 28 }}>{selectedCharacter.name}</h2>
            <div style={{ display: 'grid', gap: 10, marginBottom: 18, fontSize: 14 }}>
              <p style={{ margin: 0 }}><strong>Edad:</strong> {selectedCharacter.age ?? 'N/A'}</p>
              <p style={{ margin: 0 }}><strong>Género:</strong> {selectedCharacter.gender ?? 'N/A'}</p>
              <p style={{ margin: 0 }}><strong>Raza:</strong> {selectedCharacter.race ?? 'N/A'}</p>
            </div>
            <p style={{ margin: 0, lineHeight: 1.8, fontSize: 14 }}>{selectedCharacter.description || 'Sin descripción disponible.'}</p>
          </div>
        </div>
      )}
      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 20px', color: '#718096', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 60 }}>
        <p>Demon Slayer Characters • {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export default App
import { useEffect, useState } from "react"
import axios from "axios"

function App() {
  const [characters, setCharacters] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loadingPage, setLoadingPage] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

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

  useEffect(() => {
    loadPage(1)
  }, [])

  const cargarFavoritos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/characters")
      setFavoritos(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    cargarFavoritos()
  }, [])

  const agregarFavorito = async (character) => {
    try {
      await axios.post("http://localhost:5000/api/characters", {
        name: character.name
      })
      cargarFavoritos()
    } catch (error) {
      console.error(error)
    }
  }

  const eliminarFavorito = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/characters/${id}`)
      cargarFavoritos()
    } catch (error) {
      console.error(error)
    }
  }

  const isFavorite = (characterName) => {
    return favoritos.some(f => f.name === characterName)
  }

  const getFavoriteId = (characterName) => {
    const fav = favoritos.find(f => f.name === characterName)
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

  const sortedCharacters = [...characters].sort((a, b) => {
    const aIsFav = isFavorite(a.name) ? 1 : 0
    const bIsFav = isFavorite(b.name) ? 1 : 0
    return bIsFav - aIsFav
  })

  const favoriteCharacters = characters.filter(c => isFavorite(c.name))

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: 0 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(90deg, rgba(15,52,96,0.8) 0%, rgba(26,26,46,0.9) 100%)', backdropFilter: 'blur(10px)', padding: '24px', borderBottom: '2px solid rgba(255,105,180,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 }}>
            ⚔️ Demon Slayer
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
              Favoritos ({favoritos.length})
            </button>
          </div>

          {/* Paginación */}
          {activeTab === 'all' && (
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
                  {/* Estrella de favorito */}
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
                    
                    {/* Botón de favorito */}
                    <button
                      onClick={() => isFav ? eliminarFavorito(favId) : agregarFavorito(c)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: isFav ? 'linear-gradient(90deg, #ff6ba6 0%, #ff1076 100%)' : 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 13,
                        transition: 'all 0.3s ease',
                        borderColor: isFav ? 'transparent' : 'rgba(0,212,255,0.3)',
                        borderWidth: '1px',
                        marginTop: 'auto'
                      }}
                      onMouseEnter={(e) => {
                        if (isFav) {
                          e.target.style.boxShadow = '0 4px 15px rgba(255,107,166,0.4)'
                        } else {
                          e.target.style.background = 'rgba(255,255,255,0.15)'
                          e.target.style.borderColor = 'rgba(0,212,255,0.6)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isFav) {
                          e.target.style.boxShadow = 'none'
                        } else {
                          e.target.style.background = 'rgba(255,255,255,0.1)'
                          e.target.style.borderColor = 'rgba(0,212,255,0.3)'
                        }
                      }}
                    >
                      {isFav ? '⭐ En favoritos' : '☆ Agregar a favoritos'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 20px', color: '#718096', fontSize: 13, borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 60 }}>
        <p>⚔️ Demon Slayer Characters • {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export default App
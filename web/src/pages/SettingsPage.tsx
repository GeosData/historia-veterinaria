import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState, ErrorNote, Spinner } from '../components/Feedback'
import { TextInput } from '../components/Field'
import { api, ApiError } from '../lib/api'
import type { Species } from '../types'

export function SpeciesSettingsPage() {
  const [items, setItems] = useState<Species[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await api.listSpecies())
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudieron cargar las especies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onAdd = async (event: FormEvent) => {
    event.preventDefault()
    const value = name.trim()
    if (!value) return
    setError(null)
    setAdding(true)
    try {
      await api.createSpecies({ name: value })
      setName('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo agregar la especie.')
    } finally {
      setAdding(false)
    }
  }

  const startEdit = (item: Species) => {
    setError(null)
    setEditingId(item.id)
    setEditingName(item.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEdit = async (item: Species) => {
    const value = editingName.trim()
    if (!value || value === item.name) {
      cancelEdit()
      return
    }
    setError(null)
    setSavingId(item.id)
    try {
      const updated = await api.updateSpecies(item.id, { name: value })
      setItems((prev) =>
        prev
          .map((current) => (current.id === item.id ? updated : current))
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      cancelEdit()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar la especie.')
    } finally {
      setSavingId(null)
    }
  }

  const onDelete = async (item: Species) => {
    setError(null)
    setPendingId(item.id)
    try {
      await api.deleteSpecies(item.id)
      setItems((prev) => prev.filter((current) => current.id !== item.id))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la especie.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Ajustes</p>
        <h1 className="font-display text-2xl font-bold text-ink-950">Especies</h1>
        <p className="text-sm text-ink-500">
          Catálogo de especies que aparece al registrar un paciente. Se comparte entre tus clínicas.
        </p>
      </header>

      {error && <ErrorNote message={error} />}

      <Card className="max-w-xl space-y-4 p-6">
        <form onSubmit={onAdd} className="flex gap-2">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nueva especie…"
          />
          <Button type="submit" loading={adding} disabled={!name.trim()}>
            Agregar
          </Button>
        </form>

        {loading ? (
          <Spinner label="Cargando especies…" />
        ) : items.length === 0 ? (
          <EmptyState
            title="Todavía no hay especies"
            description="Agrega la primera para usarla al registrar pacientes."
          />
        ) : (
          <ul className="divide-y divide-ink-100 overflow-hidden rounded-lg border border-ink-200">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                {editingId === item.id ? (
                  <>
                    <TextInput
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          void saveEdit(item)
                        }
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void saveEdit(item)}
                      loading={savingId === item.id}
                      disabled={!editingName.trim()}
                    >
                      Guardar
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-ink-800">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-xs font-medium text-brand-600 transition hover:text-brand-700"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={pendingId === item.id}
                      onClick={() => void onDelete(item)}
                      className="text-xs font-medium text-ink-400 transition hover:text-accent-600 disabled:opacity-40"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

import { CATEGORIAS, RESPONSABLES, STATUSES } from '../types'

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  categoria: string
  onCategoriaChange: (value: string) => void
  responsable: string
  onResponsableChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onAddLead: () => void
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

const selectClasses =
  'bg-slate-50 text-sm text-slate-600 rounded-xl px-3 py-2.5 outline-none border-0 appearance-none cursor-pointer hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-terracota/20'

export default function FilterBar({
  search,
  onSearchChange,
  categoria,
  onCategoriaChange,
  responsable,
  onResponsableChange,
  status,
  onStatusChange,
  onAddLead,
}: FilterBarProps) {
  return (
    <div className="card-base p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar leads..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 text-sm text-slate-600 rounded-xl pl-10 pr-4 py-2.5 outline-none border-0 placeholder:text-slate-300 focus:ring-2 focus:ring-terracota/20 transition-colors"
          />
        </div>

        {/* Categoría */}
        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Responsable */}
        <select
          value={responsable}
          onChange={(e) => onResponsableChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">Todos los responsables</option>
          {RESPONSABLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Add Lead button */}
        <button onClick={onAddLead} className="btn-primary">
          <PlusIcon />
          <span className="hidden sm:inline">Agregar Lead</span>
        </button>
      </div>
    </div>
  )
}

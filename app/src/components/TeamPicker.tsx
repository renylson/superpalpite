'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { searchStaticTeams, searchClubs, type TeamEntry } from '@/lib/teams';

interface TeamPickerProps {
  label: string;
  nameField: string;
  logoField: string;
  defaultName?: string;
  defaultLogo?: string;
}

function TeamLogo({ logo, name, size = 32 }: { logo: string; name: string; size?: number }) {
  const [error, setError] = useState(false);
  if (error || !logo) {
    return (
      <span
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-base"
      >
        ⚽
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded object-contain"
      onError={() => setError(true)}
    />
  );
}

export function TeamPicker({ label, nameField, logoField, defaultName = '', defaultLogo = '' }: TeamPickerProps) {
  const [query, setQuery] = useState(defaultName);
  const [selectedName, setSelectedName] = useState(defaultName);
  const [selectedLogo, setSelectedLogo] = useState(defaultLogo);
  const [results, setResults] = useState<TeamEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function search(q: string) {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);

    // Busca imediata no banco estático (seleções + clubes principais)
    const staticResults = searchStaticTeams(q);
    if (staticResults.length > 0) {
      setResults(staticResults.slice(0, 10));
      setOpen(true);
    }

    // Busca complementar online para times não listados
    const online = await searchClubs(q);
    const merged: TeamEntry[] = [...staticResults];
    const seen = new Set<string>(staticResults.map((t) => t.name.toLowerCase()));
    for (const t of online) {
      if (!seen.has(t.name.toLowerCase())) { seen.add(t.name.toLowerCase()); merged.push(t); }
    }
    setResults(merged.slice(0, 10));
    setOpen(merged.length > 0);
    setLoading(false);
  }

  function handleInput(value: string) {
    setQuery(value);
    setSelectedName(value);
    setSelectedLogo('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void search(value); }, 350);
  }

  function select(team: TeamEntry) {
    setSelectedName(team.name);
    setSelectedLogo(team.logo);
    setQuery(team.name);
    setOpen(false);
    setResults([]);
  }

  function clear() {
    setQuery('');
    setSelectedName('');
    setSelectedLogo('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* Inputs hidden para o form */}
      <input type="hidden" name={nameField} value={selectedName} />
      <input type="hidden" name={logoField} value={selectedLogo} />

      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</p>

      {/* Preview do time selecionado */}
      {selectedLogo && (
        <div className="flex items-center gap-3 rounded-lg border border-sp-gold/30 bg-sp-gold/5 px-3 py-2">
          <TeamLogo logo={selectedLogo} name={selectedName} size={36} />
          <span className="flex-1 font-bold">{selectedName}</span>
          <button type="button" onClick={clear} className="text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input de busca */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={`Buscar ${label.toLowerCase()}...`}
          className="min-h-11 w-full rounded-md border border-zinc-700 bg-sp-black py-2 pl-9 pr-3 text-sm text-sp-white placeholder-zinc-600 outline-none focus:border-sp-gold"
          autoComplete="off"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-sp-gold" />
          </span>
        )}
      </div>

      {/* Dropdown de resultados */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-zinc-700 bg-sp-dark shadow-2xl">
          <div className="max-h-72 overflow-y-auto">
            {results.map((team) => (
              <button
                key={`${team.name}-${team.logo}`}
                type="button"
                onClick={() => select(team)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-800"
              >
                <TeamLogo logo={team.logo} name={team.name} size={32} />
                <div className="min-w-0">
                  <p className="truncate font-bold text-sp-white">{team.name}</p>
                  {team.country && (
                    <p className="truncate text-xs text-zinc-500">
                      {team.type === 'national' ? '🌍 Seleção' : `🏟️ ${team.country}`}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="border-t border-zinc-800 px-4 py-2 text-xs text-zinc-600">
            Dados de seleções via flagcdn.com · Clubes via thesportsdb.com
          </div>
        </div>
      )}

      {/* Permite digitar nome manual sem logo */}
      {query.length >= 2 && !loading && results.length === 0 && !selectedLogo && (
        <p className="text-xs text-zinc-600">
          Nenhum time encontrado — o nome digitado será usado assim mesmo.
        </p>
      )}
    </div>
  );
}

// Componente simples para exibir logo de time (usado fora do formulário)
export function TeamLogoDisplay({ logo, name, size = 40 }: { logo?: string | null; name: string; size?: number }) {
  const [error, setError] = useState(false);
  if (!logo || error) {
    return (
      <span
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xl"
      >
        ⚽
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded object-contain"
      onError={() => setError(true)}
    />
  );
}

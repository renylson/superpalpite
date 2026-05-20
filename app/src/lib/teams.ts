export interface TeamEntry {
  name: string;
  logo: string;
  type: 'national' | 'club';
  country?: string;
}

const sf = (id: number) => `https://api.sofascore.com/api/v1/team/${id}/image`;
const flag = (code: string) => `https://flagcdn.com/w80/${code}.png`;

// Seleções nacionais — flagcdn.com
export const NATIONAL_TEAMS: TeamEntry[] = [
  { name: 'Brasil', logo: flag('br'), type: 'national' },
  { name: 'Argentina', logo: flag('ar'), type: 'national' },
  { name: 'Uruguai', logo: flag('uy'), type: 'national' },
  { name: 'Colômbia', logo: flag('co'), type: 'national' },
  { name: 'Chile', logo: flag('cl'), type: 'national' },
  { name: 'Equador', logo: flag('ec'), type: 'national' },
  { name: 'Paraguai', logo: flag('py'), type: 'national' },
  { name: 'Peru', logo: flag('pe'), type: 'national' },
  { name: 'Bolívia', logo: flag('bo'), type: 'national' },
  { name: 'Venezuela', logo: flag('ve'), type: 'national' },
  { name: 'México', logo: flag('mx'), type: 'national' },
  { name: 'Estados Unidos', logo: flag('us'), type: 'national' },
  { name: 'Portugal', logo: flag('pt'), type: 'national' },
  { name: 'Espanha', logo: flag('es'), type: 'national' },
  { name: 'França', logo: flag('fr'), type: 'national' },
  { name: 'Alemanha', logo: flag('de'), type: 'national' },
  { name: 'Inglaterra', logo: flag('gb-eng'), type: 'national' },
  { name: 'Itália', logo: flag('it'), type: 'national' },
  { name: 'Holanda', logo: flag('nl'), type: 'national' },
  { name: 'Bélgica', logo: flag('be'), type: 'national' },
  { name: 'Croácia', logo: flag('hr'), type: 'national' },
  { name: 'Sérvia', logo: flag('rs'), type: 'national' },
  { name: 'Suíça', logo: flag('ch'), type: 'national' },
  { name: 'Dinamarca', logo: flag('dk'), type: 'national' },
  { name: 'Suécia', logo: flag('se'), type: 'national' },
  { name: 'Noruega', logo: flag('no'), type: 'national' },
  { name: 'Polônia', logo: flag('pl'), type: 'national' },
  { name: 'Ucrânia', logo: flag('ua'), type: 'national' },
  { name: 'Turquia', logo: flag('tr'), type: 'national' },
  { name: 'Escócia', logo: flag('gb-sct'), type: 'national' },
  { name: 'País de Gales', logo: flag('gb-wls'), type: 'national' },
  { name: 'Irlanda', logo: flag('ie'), type: 'national' },
  { name: 'República Tcheca', logo: flag('cz'), type: 'national' },
  { name: 'Áustria', logo: flag('at'), type: 'national' },
  { name: 'Japão', logo: flag('jp'), type: 'national' },
  { name: 'Coreia do Sul', logo: flag('kr'), type: 'national' },
  { name: 'Marrocos', logo: flag('ma'), type: 'national' },
  { name: 'Senegal', logo: flag('sn'), type: 'national' },
  { name: 'Nigéria', logo: flag('ng'), type: 'national' },
  { name: 'Costa do Marfim', logo: flag('ci'), type: 'national' },
  { name: 'Egito', logo: flag('eg'), type: 'national' },
  { name: 'Gana', logo: flag('gh'), type: 'national' },
  { name: 'Camarões', logo: flag('cm'), type: 'national' },
  { name: 'Austrália', logo: flag('au'), type: 'national' },
  { name: 'Irã', logo: flag('ir'), type: 'national' },
  { name: 'Arábia Saudita', logo: flag('sa'), type: 'national' },
  { name: 'Qatar', logo: flag('qa'), type: 'national' },
  { name: 'Costa Rica', logo: flag('cr'), type: 'national' },
];

// Clubes — logos via Sofascore CDN (api.sofascore.com/api/v1/team/{id}/image)
export const CLUBS: TeamEntry[] = [
  // ── Brasileirão Série A ──
  { name: 'Flamengo', logo: sf(5981), type: 'club', country: 'Brasil' },
  { name: 'Palmeiras', logo: sf(1963), type: 'club', country: 'Brasil' },
  { name: 'Corinthians', logo: sf(1957), type: 'club', country: 'Brasil' },
  { name: 'São Paulo', logo: sf(1981), type: 'club', country: 'Brasil' },
  { name: 'Fluminense', logo: sf(1961), type: 'club', country: 'Brasil' },
  { name: 'Atlético Mineiro', logo: sf(1977), type: 'club', country: 'Brasil' },
  { name: 'Botafogo', logo: sf(1958), type: 'club', country: 'Brasil' },
  { name: 'Grêmio', logo: sf(5926), type: 'club', country: 'Brasil' },
  { name: 'Internacional', logo: sf(1966), type: 'club', country: 'Brasil' },
  { name: 'Cruzeiro', logo: sf(1954), type: 'club', country: 'Brasil' },
  { name: 'Vasco da Gama', logo: sf(1974), type: 'club', country: 'Brasil' },
  { name: 'Athletico Paranaense', logo: sf(1967), type: 'club', country: 'Brasil' },
  { name: 'Bahia', logo: sf(1955), type: 'club', country: 'Brasil' },
  { name: 'Fortaleza', logo: sf(2020), type: 'club', country: 'Brasil' },
  { name: 'Atlético Goianiense', logo: sf(7314), type: 'club', country: 'Brasil' },
  { name: 'Vitória', logo: sf(1962), type: 'club', country: 'Brasil' },
  { name: 'Red Bull Bragantino', logo: sf(1999), type: 'club', country: 'Brasil' },
  { name: 'Cuiabá', logo: sf(49202), type: 'club', country: 'Brasil' },
  { name: 'Criciúma', logo: sf(1984), type: 'club', country: 'Brasil' },
  { name: 'Juventude', logo: sf(1980), type: 'club', country: 'Brasil' },
  // ── Outros clubes brasileiros ──
  { name: 'Santos', logo: sf(1968), type: 'club', country: 'Brasil' },
  { name: 'Sport Recife', logo: sf(1959), type: 'club', country: 'Brasil' },
  { name: 'América Mineiro', logo: sf(1973), type: 'club', country: 'Brasil' },
  { name: 'Goiás', logo: sf(1960), type: 'club', country: 'Brasil' },
  { name: 'Guarani', logo: sf(1972), type: 'club', country: 'Brasil' },
  // ── Premier League ──
  { name: 'Arsenal', logo: sf(42), type: 'club', country: 'Inglaterra' },
  { name: 'Aston Villa', logo: sf(40), type: 'club', country: 'Inglaterra' },
  { name: 'Chelsea', logo: sf(38), type: 'club', country: 'Inglaterra' },
  { name: 'Liverpool', logo: sf(44), type: 'club', country: 'Inglaterra' },
  { name: 'Manchester City', logo: sf(17), type: 'club', country: 'Inglaterra' },
  { name: 'Manchester United', logo: sf(35), type: 'club', country: 'Inglaterra' },
  { name: 'Newcastle United', logo: sf(39), type: 'club', country: 'Inglaterra' },
  { name: 'Tottenham Hotspur', logo: sf(33), type: 'club', country: 'Inglaterra' },
  { name: 'West Ham United', logo: sf(37), type: 'club', country: 'Inglaterra' },
  { name: 'Brighton', logo: sf(30), type: 'club', country: 'Inglaterra' },
  // ── La Liga ──
  { name: 'FC Barcelona', logo: sf(2817), type: 'club', country: 'Espanha' },
  { name: 'Real Madrid', logo: sf(2829), type: 'club', country: 'Espanha' },
  { name: 'Atlético Madrid', logo: sf(2836), type: 'club', country: 'Espanha' },
  { name: 'Real Betis', logo: sf(2816), type: 'club', country: 'Espanha' },
  { name: 'Sevilla', logo: sf(2833), type: 'club', country: 'Espanha' },
  { name: 'Valencia', logo: sf(2828), type: 'club', country: 'Espanha' },
  { name: 'Villarreal', logo: sf(2819), type: 'club', country: 'Espanha' },
  // ── Bundesliga ──
  { name: 'FC Bayern München', logo: sf(2672), type: 'club', country: 'Alemanha' },
  { name: 'Borussia Dortmund', logo: sf(2673), type: 'club', country: 'Alemanha' },
  { name: 'Bayer 04 Leverkusen', logo: sf(2681), type: 'club', country: 'Alemanha' },
  { name: 'RB Leipzig', logo: sf(36360), type: 'club', country: 'Alemanha' },
  // ── Serie A italiana ──
  { name: 'Juventus', logo: sf(2687), type: 'club', country: 'Itália' },
  { name: 'AC Milan', logo: sf(2692), type: 'club', country: 'Itália' },
  { name: 'Inter de Milão', logo: sf(2697), type: 'club', country: 'Itália' },
  { name: 'Atalanta', logo: sf(2686), type: 'club', country: 'Itália' },
  { name: 'Napoli', logo: sf(2714), type: 'club', country: 'Itália' },
  { name: 'AS Roma', logo: sf(2699), type: 'club', country: 'Itália' },
  { name: 'Lazio', logo: sf(2700), type: 'club', country: 'Itália' },
  // ── Ligue 1 francesa ──
  { name: 'Paris Saint-Germain', logo: sf(1644), type: 'club', country: 'França' },
  { name: 'AS Monaco', logo: sf(1653), type: 'club', country: 'França' },
  { name: 'Lille', logo: sf(1643), type: 'club', country: 'França' },
  { name: 'Olympique de Marseille', logo: sf(1641), type: 'club', country: 'França' },
  { name: 'Olympique Lyonnais', logo: sf(1642), type: 'club', country: 'França' },
  // ── Portugal ──
  { name: 'Benfica', logo: sf(3006), type: 'club', country: 'Portugal' },
  { name: 'Sporting CP', logo: sf(3001), type: 'club', country: 'Portugal' },
  { name: 'FC Porto', logo: sf(3004), type: 'club', country: 'Portugal' },
  // ── Turquia ──
  { name: 'Galatasaray', logo: sf(3061), type: 'club', country: 'Turquia' },
  { name: 'Fenerbahçe', logo: sf(3052), type: 'club', country: 'Turquia' },
  { name: 'Beşiktaş', logo: sf(3065), type: 'club', country: 'Turquia' },
  // ── Holanda ──
  { name: 'Ajax', logo: sf(2958), type: 'club', country: 'Holanda' },
  { name: 'PSV Eindhoven', logo: sf(2952), type: 'club', country: 'Holanda' },
  { name: 'Feyenoord', logo: sf(2959), type: 'club', country: 'Holanda' },
  // ── Argentina ──
  { name: 'Boca Juniors', logo: sf(2059), type: 'club', country: 'Argentina' },
  { name: 'River Plate', logo: sf(2060), type: 'club', country: 'Argentina' },
  { name: 'Racing Club', logo: sf(2068), type: 'club', country: 'Argentina' },
  { name: 'Independiente', logo: sf(2062), type: 'club', country: 'Argentina' },
  { name: 'San Lorenzo', logo: sf(2064), type: 'club', country: 'Argentina' },
  { name: 'Estudiantes', logo: sf(2067), type: 'club', country: 'Argentina' },
  // ── Outros sul-americanos ──
  { name: 'Peñarol', logo: sf(2140), type: 'club', country: 'Uruguai' },
  { name: 'Nacional (Uru)', logo: sf(2141), type: 'club', country: 'Uruguai' },
  { name: 'Olimpia', logo: sf(2291), type: 'club', country: 'Paraguai' },
  { name: 'Colo-Colo', logo: sf(2179), type: 'club', country: 'Chile' },
  { name: 'Universidad de Chile', logo: sf(2177), type: 'club', country: 'Chile' },
];

export const ALL_TEAMS: TeamEntry[] = [...NATIONAL_TEAMS, ...CLUBS];

export function searchNationalTeams(query: string): TeamEntry[] {
  if (query.length < 2) return [];
  const q = normalize(query);
  return NATIONAL_TEAMS.filter((t) => normalize(t.name).includes(q));
}

export function searchStaticTeams(query: string): TeamEntry[] {
  if (query.length < 2) return [];
  const q = normalize(query);
  return ALL_TEAMS.filter((t) => normalize(t.name).includes(q)).slice(0, 10);
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '');
}

export interface TheSportsDBTeam {
  idTeam: string;
  strTeam: string;
  strBadge: string | null;
  strLeague: string | null;
  strCountry: string | null;
}

// Busca complementar via proxy server-side (para times não listados)
export async function searchClubs(query: string): Promise<TeamEntry[]> {
  if (query.length < 2) return [];
  try {
    const res = await fetch(`/api/teams?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const json = (await res.json()) as { teams: TheSportsDBTeam[] | null };
    if (!json.teams) return [];
    return json.teams
      .filter((t) => t.strBadge)
      .slice(0, 6)
      .map((t) => ({
        name: t.strTeam,
        logo: t.strBadge!,
        type: 'club' as const,
        country: t.strCountry ?? t.strLeague ?? undefined,
      }));
  } catch {
    return [];
  }
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_JOBS } from "./seed-jobs";
import type {
  Application,
  ApplicationStatus,
  Job,
  Profile,
  ResumeVersion,
  Settings,
} from "./types";

const STORAGE_KEY = "matchcv.session.v1";

export const emptyProfile: Profile = {
  personal: {
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "Brasil",
  },
  goal: {
    targetRole: "",
    area: "",
    seniority: "pleno",
    workModel: "remoto",
    desiredLocation: "",
    availability: "Imediata",
  },
  education: [],
  experiences: [],
  skills: {
    hard: [],
    soft: [],
    tools: [],
    languages: [],
    frameworks: [],
    databases: [],
    certifications: [],
    idioms: [],
  },
  projects: [],
  summary: "",
  onboardingCompleted: false,
};

export const defaultSettings: Settings = {
  emailAlerts: true,
  matchAlerts: true,
  analytics: false,
  compactResume: true,
  minMatch: 50,
};

interface SessionState {
  profile: Profile;
  versions: ResumeVersion[];
  applications: Application[];
  savedJobs: string[];
  favoriteCompanies: string[];
  settings: Settings;
}

const initialState: SessionState = {
  profile: emptyProfile,
  versions: [],
  applications: [],
  savedJobs: [],
  favoriteCompanies: [],
  settings: defaultSettings,
};

interface StoreValue extends SessionState {
  jobs: Job[];
  hydrated: boolean;
  setProfile: (updater: (p: Profile) => Profile) => void;
  addVersion: (v: ResumeVersion) => void;
  updateVersion: (id: string, patch: Partial<ResumeVersion>) => void;
  removeVersion: (id: string) => void;
  toggleSavedJob: (id: string) => void;
  toggleFavoriteCompany: (name: string) => void;
  upsertApplication: (jobId: string, status: ApplicationStatus) => void;
  removeApplication: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as SessionState) });
    } catch {
      /* estado local corrompido: segue com o padrão */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  }, [state, hydrated]);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      jobs: SEED_JOBS,
      hydrated,
      setProfile: (updater) => setState((s) => ({ ...s, profile: updater(s.profile) })),
      addVersion: (v) => setState((s) => ({ ...s, versions: [v, ...s.versions] })),
      updateVersion: (id, patch) =>
        setState((s) => ({
          ...s,
          versions: s.versions.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      removeVersion: (id) =>
        setState((s) => ({ ...s, versions: s.versions.filter((v) => v.id !== id) })),
      toggleSavedJob: (id) =>
        setState((s) => ({
          ...s,
          savedJobs: s.savedJobs.includes(id)
            ? s.savedJobs.filter((j) => j !== id)
            : [...s.savedJobs, id],
        })),
      toggleFavoriteCompany: (name) =>
        setState((s) => ({
          ...s,
          favoriteCompanies: s.favoriteCompanies.includes(name)
            ? s.favoriteCompanies.filter((c) => c !== name)
            : [...s.favoriteCompanies, name],
        })),
      upsertApplication: (jobId, status) =>
        setState((s) => {
          const existing = s.applications.find((a) => a.jobId === jobId);
          if (existing) {
            return {
              ...s,
              applications: s.applications.map((a) =>
                a.jobId === jobId ? { ...a, status } : a,
              ),
            };
          }
          return {
            ...s,
            applications: [
              {
                id: `app-${Date.now()}`,
                jobId,
                status,
                createdAt: new Date().toISOString(),
              },
              ...s.applications,
            ],
          };
        }),
      removeApplication: (id) =>
        setState((s) => ({ ...s, applications: s.applications.filter((a) => a.id !== id) })),
      updateSettings: (patch) =>
        setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      resetAll: () => setState(initialState),
    }),
    [state, hydrated],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}

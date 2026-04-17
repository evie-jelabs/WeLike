"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface ProductContext {
  id: string;
  userId: string;
  name: string;
  url?: string;
  oneLiner: string;
  description: string;
  category: string;
  stage: string;
  targetAudience: string;
  targetRegions: string[];
  competitors: string[];
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  productContext: ProductContext | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setProductContext: (ctx: ProductContext) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Lazy import supabase only when configured
async function getSupabaseClient() {
  const { getSupabase } = await import("@/lib/supabase");
  return getSupabase();
}

/** Map DB row (snake_case) to ProductContext (camelCase) */
function mapProductContext(row: Record<string, unknown>): ProductContext {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    url: (row.url as string) || undefined,
    oneLiner: row.one_liner as string,
    description: (row.description as string) ?? "",
    category: row.category as string,
    stage: (row.stage as string) ?? "",
    targetAudience: (row.target_audience as string) ?? "",
    targetRegions: (row.target_regions as string[]) ?? [],
    competitors: (row.competitors as string[]) ?? [],
    language: (row.language as string) ?? "en",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── LocalStorage fallback (dev mode without Supabase) ───

function localStorageAuth() {
  const getUser = (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("welike_user");
    return raw ? JSON.parse(raw) : null;
  };

  const getProductContext = (): ProductContext | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("welike_product_context");
    return raw ? JSON.parse(raw) : null;
  };

  const saveUser = (u: User) =>
    localStorage.setItem("welike_user", JSON.stringify(u));
  const saveProductContext = (ctx: ProductContext) =>
    localStorage.setItem("welike_product_context", JSON.stringify(ctx));
  const clear = () => {
    localStorage.removeItem("welike_user");
    localStorage.removeItem("welike_product_context");
  };

  return { getUser, getProductContext, saveUser, saveProductContext, clear };
}

// ─── Provider ───

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    productContext: null,
    isLoading: true,
  });

  const useSupabase = isSupabaseConfigured();

  // Initialize
  useEffect(() => {
    if (useSupabase) {
      // Supabase mode
      const init = async () => {
        try {
          const supabase = await getSupabaseClient();
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email ?? "",
              name:
                session.user.user_metadata?.full_name ??
                session.user.user_metadata?.name ??
                session.user.email?.split("@")[0] ??
                "",
              avatar: session.user.user_metadata?.avatar_url,
            };

            const { data } = await supabase
              .from("product_contexts")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();

            setState({
              user,
              productContext: data ? mapProductContext(data) : null,
              isLoading: false,
            });
          } else {
            setState({ user: null, productContext: null, isLoading: false });
          }
        } catch {
          setState({ user: null, productContext: null, isLoading: false });
        }
      };

      init();

      // Listen for auth changes
      let subscription: { unsubscribe: () => void } | null = null;
      getSupabaseClient().then((supabase) => {
        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email ?? "",
              name:
                session.user.user_metadata?.full_name ??
                session.user.user_metadata?.name ??
                session.user.email?.split("@")[0] ??
                "",
              avatar: session.user.user_metadata?.avatar_url,
            };

            const { data } = await supabase
              .from("product_contexts")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();

            setState({
              user,
              productContext: data ? mapProductContext(data) : null,
              isLoading: false,
            });
          } else if (event === "SIGNED_OUT") {
            setState({ user: null, productContext: null, isLoading: false });
          }
        });
        subscription = sub;
      });

      return () => subscription?.unsubscribe();
    } else {
      // localStorage fallback mode
      const ls = localStorageAuth();
      setState({
        user: ls.getUser(),
        productContext: ls.getProductContext(),
        isLoading: false,
      });
    }
  }, [useSupabase]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (useSupabase) {
        const supabase = await getSupabaseClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw new Error(error.message);
      } else {
        // localStorage fallback
        const ls = localStorageAuth();
        const user: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split("@")[0],
        };
        ls.saveUser(user);
        setState((s) => ({ ...s, user }));
      }
    },
    [useSupabase]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (useSupabase) {
        const supabase = await getSupabaseClient();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw new Error(error.message);
      } else {
        const ls = localStorageAuth();
        const user: User = {
          id: crypto.randomUUID(),
          email,
          name,
        };
        ls.saveUser(user);
        setState((s) => ({ ...s, user }));
      }
    },
    [useSupabase]
  );

  const loginWithGoogle = useCallback(async () => {
    if (useSupabase) {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw new Error(error.message);
    } else {
      alert("Google login requires Supabase configuration. Please set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    }
  }, [useSupabase]);

  const logout = useCallback(async () => {
    if (useSupabase) {
      const supabase = await getSupabaseClient();
      await supabase.auth.signOut();
    } else {
      localStorageAuth().clear();
    }
    setState({ user: null, productContext: null, isLoading: false });
  }, [useSupabase]);

  const setProductContext = useCallback(
    (ctx: ProductContext) => {
      if (useSupabase && state.user) {
        // Fire and forget — save to Supabase in background
        getSupabaseClient().then((supabase) => {
          supabase
            .from("product_contexts")
            .upsert(
              {
                id: ctx.id,
                user_id: state.user!.id,
                name: ctx.name,
                url: ctx.url || null,
                one_liner: ctx.oneLiner,
                description: ctx.description,
                category: ctx.category,
                stage: ctx.stage,
                target_audience: ctx.targetAudience,
                target_regions: ctx.targetRegions,
                competitors: ctx.competitors,
                language: ctx.language,
              },
              { onConflict: "user_id" }
            )
            .then(({ error }) => {
              if (error) console.error("Failed to save product context:", error);
            });
        });
      } else {
        localStorageAuth().saveProductContext(ctx);
      }
      setState((s) => ({ ...s, productContext: ctx }));
    },
    [useSupabase, state.user]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithGoogle,
        logout,
        setProductContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { organization } from "@/data/organization";
import { supabase } from "@/lib/supabase";

export type AccountRole = "student" | "trainer" | "admin";

export type AccountProfile = {
  id: string;
  name: string;
  role: AccountRole;
  goal: string;
  status: "active" | "pending";
};

type AuthState = {
  ready: boolean;
  session: Session | null;
  profile: AccountProfile | null;
  profileMissing: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function isRole(value: unknown): value is AccountRole {
  return value === "student" || value === "trainer" || value === "admin";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [profileMissing, setProfileMissing] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    let current = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!current) return;
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    return () => {
      current = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || !session) {
      setProfile(null);
      setProfileMissing(false);
      return;
    }
    let current = true;
    const email = session.user.email?.toLowerCase() ?? "";
    const fallbackName =
      (typeof session.user.user_metadata?.name === "string" && session.user.user_metadata.name) ||
      email.split("@")[0] ||
      "Learner";
    const requested = session.user.user_metadata?.role;
    const isAdmin = email === organization.email.toLowerCase();
    supabase
      .from("profiles")
      .select("id,name,role,goal,status")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!current) return;
        const storedRole: AccountRole = isAdmin ? "admin" : isRole(data?.role) ? data.role : "student";
        const askedForTrainer = requested === "trainer" && !isAdmin;
        const role: AccountRole = storedRole === "student" && askedForTrainer ? "trainer" : storedRole;
        const approved = role === "admin" || (role === "trainer" ? data?.status === "active" : data?.status !== "pending");
        setProfile({
          id: session.user.id,
          name: data?.name || fallbackName,
          role,
          goal: data?.goal ?? "",
          status: approved ? "active" : "pending",
        });
        setProfileMissing(false);
      });
    return () => {
      current = false;
    };
  }, [session]);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      session,
      profile,
      profileMissing,
      signOut: async () => {
        await supabase?.auth.signOut();
      },
    }),
    [profile, profileMissing, ready, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

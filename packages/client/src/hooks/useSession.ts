import { useContext } from "react";

import { SessionProviderContext } from "@/context/SessionProviderContext";

export function useSession() {
  const context = useContext(SessionProviderContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}

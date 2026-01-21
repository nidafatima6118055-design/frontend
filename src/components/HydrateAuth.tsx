"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

// export default function HydrateAuth() {
//   const hydrateUser = useAuthStore((s) => s.hydrateUser);
//   const hydrated = useAuthStore((state) => state.hydrated);

//   useEffect(() => {
//     // Run only once per app load (if not hydrated yet)
//     if (!hydrated) {
//       hydrateUser();
//     }
//   }, [hydrated, hydrateUser]);

//   return null;
// }



export default function HydrateAuth({ force = false }: { force?: boolean }) {
  const hydrateUser = useAuthStore((s) => s.hydrateUser);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated || force) {
      hydrateUser(force);
    }
  }, [hydrated, force, hydrateUser]);

  return null;
}

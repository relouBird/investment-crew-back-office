import useAuthStore from "~/stores/auth.store";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  const router = useRouter();

  if (auth.expired_at && Date.now() < auth.expired_at) {
    const links = router.currentRoute.value.fullPath.split("=/");

    if (links[1]) {
      return navigateTo(`/${links[1]}`);
    }

    return navigateTo("/");
  }
});

import { revalidatePath } from "next/cache";

export function revalidateDiscoveryPaths() {
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/categories");
  revalidatePath("/my-events");
}

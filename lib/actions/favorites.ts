"use server";

import { revalidatePath } from "next/cache";

import {
  type ActionState,
  actionError,
  actionSuccess,
  getErrorMessage,
} from "@/lib/action-state";
import { getSession } from "@/lib/auth/server";
import { getTranslations } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

function revalidateFavoritePaths() {
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/my-events");
  revalidatePath("/categories");
}

export async function toggleFavoriteAction(
  eventId: string,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    if (!userId) {
      return actionError(t("favorites.signInRequired"));
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, visibility: "public" },
      select: { id: true },
    });

    if (!event) {
      return actionError(t("favorites.eventNotFound"));
    }

    const existing = await prisma.eventFavorite.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.eventFavorite.delete({
        where: { id: existing.id },
      });
      revalidateFavoritePaths();
      return actionSuccess(t("favorites.removed"));
    }

    await prisma.eventFavorite.create({
      data: {
        userId,
        eventId,
      },
    });
    revalidateFavoritePaths();
    return actionSuccess(t("favorites.added"));
  } catch (error) {
    return actionError(getErrorMessage(error));
  }
}

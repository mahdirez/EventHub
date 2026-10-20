"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  type ActionState,
  actionError,
  actionSuccess,
  getErrorMessage,
} from "@/lib/action-state";
import { createEventFormSchema } from "@/lib/validations/event";
import { parseFormData } from "@/lib/validations/parse-form-data";
import { createRsvpFormSchema } from "@/lib/validations/rsvp";
import { getTranslations } from "@/lib/i18n/server";
import { revalidateDiscoveryPaths } from "@/lib/revalidate-discovery";
import {
  assertCapacityAllowsUpdate,
  createEventForOwner,
  deleteEventForOwner,
  EventServiceError,
  requireEventOwner,
  updateEventForOwner,
  upsertInviteToken,
} from "@/lib/services/event.service";
import {
  RsvpServiceError,
  submitRsvpForInviteToken,
} from "@/lib/services/rsvp.service";
import { getSession } from "@/lib/auth/server";

function mapEventServiceError(error: unknown, t: (key: string) => string) {
  if (error instanceof EventServiceError) {
    if (error.code === "UNAUTHORIZED") {
      return actionError(t("actions.signInRequired"));
    }
    if (error.code === "NOT_FOUND") {
      return actionError(t("actions.eventNotFound"));
    }
  }

  return actionError(getErrorMessage(error));
}

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let createdId: string;

  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    if (!userId) {
      return actionError(t("actions.signInRequired"));
    }

    const parsed = parseFormData(createEventFormSchema(t), formData, {
      fallbackMessage: t("validation.generic"),
    });
    if (!parsed.success) {
      return parsed.state;
    }

    const created = await createEventForOwner(userId, parsed.data);
    createdId = created.id;
  } catch (error) {
    const { t } = await getTranslations();
    return mapEventServiceError(error, t);
  }

  revalidatePath("/dashboard");
  revalidateDiscoveryPaths();
  redirect(`/events/${createdId}`);
}

export async function updateEventAction(
  eventId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    const parsed = parseFormData(createEventFormSchema(t), formData, {
      fallbackMessage: t("validation.generic"),
    });
    if (!parsed.success) {
      return parsed.state;
    }

    await requireEventOwner(eventId, userId);

    const blockedGoingCount = await assertCapacityAllowsUpdate(
      eventId,
      parsed.data.capacity,
    );
    if (blockedGoingCount != null) {
      return actionError(
        t("actions.capacityTooLow", { count: blockedGoingCount }),
      );
    }

    await updateEventForOwner(eventId, parsed.data);
  } catch (error) {
    const { t } = await getTranslations();
    return mapEventServiceError(error, t);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  revalidateDiscoveryPaths();
  redirect(`/events/${eventId}`);
}

export async function deleteEventAction(
  eventId: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;

    await requireEventOwner(eventId, userId);
    await deleteEventForOwner(eventId);
  } catch (error) {
    const { t } = await getTranslations();
    return mapEventServiceError(error, t);
  }

  revalidatePath("/dashboard");
  revalidateDiscoveryPaths();
  redirect("/dashboard");
}

export async function createInviteLinkAction(
  eventId: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const session = await getSession();
    const userId = session.data?.user?.id;
    const { t } = await getTranslations();

    await requireEventOwner(eventId, userId);
    await upsertInviteToken(eventId);

    revalidatePath(`/events/${eventId}`);
    return actionSuccess(t("toast.inviteGenerated"));
  } catch (error) {
    const { t } = await getTranslations();
    return mapEventServiceError(error, t);
  }
}

export async function submitOrUpdateRsvpAction(
  token: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let submittedEmail: string;

  try {
    const { t } = await getTranslations();
    const parsed = parseFormData(createRsvpFormSchema(t), formData, {
      fallbackMessage: t("validation.generic"),
    });
    if (!parsed.success) {
      return parsed.state;
    }

    submittedEmail = await submitRsvpForInviteToken(token, parsed.data);
  } catch (error) {
    const { t } = await getTranslations();
    if (error instanceof RsvpServiceError) {
      if (error.code === "INVITE_INVALID") {
        return actionError(t("actions.inviteInvalid"));
      }
      if (error.code === "AT_CAPACITY") {
        return actionError(t("actions.atCapacity"));
      }
    }
    return actionError(getErrorMessage(error));
  }

  redirect(
    `/invite/${token}?submitted=1&email=${encodeURIComponent(submittedEmail)}`,
  );
}

export const en = {
  site: {
    name: "EventHub",
    description:
      "Plan events, share invite links, and track RSVPs with Going, Maybe, and Not going counts.",
  },
  common: {
    dashboard: "Dashboard",
    back: "Back",
    cancel: "Cancel",
    createEvent: "Create event",
    editEvent: "Edit event",
    saveChanges: "Save changes",
    deleteEvent: "Delete event",
    viewDetails: "View details",
    exportCsv: "Export CSV",
    copyLink: "Copy link",
    copied: "Copied",
    generateLink: "Generate link",
    unlimited: "Unlimited",
    capacity: "Capacity",
    attendees: "Attendees",
    inviteLink: "Invite link",
    noDateSet: "No date set",
  },
  home: {
    badge: "Next.js 16 + Neon Auth + Neon Postgres",
    title: "Plan events and track RSVPs fast",
    description:
      "Create events, share a unique invite link, and watch attendee status update in real-time with Going, Maybe, and Not going counts.",
    createAccount: "Create account",
    signIn: "Sign in",
    openDashboard: "Open dashboard",
    featureCreateTitle: "Create events",
    featureCreateDescription: "Set title, date, and details in seconds.",
    featureShareTitle: "Share invite links",
    featureShareDescription: "Generate a unique event token per event.",
    featureTrackTitle: "Track attendance",
    featureTrackDescription: "See attendee list and response totals at a glance.",
    featureTrackNote: "Going, Maybe, and Not going are always up-to-date.",
  },
  dashboard: {
    title: "Your events",
    description: "Track attendance responses and manage invite links.",
    emptyTitle: "No events yet",
    emptyDescription:
      "Create your first event, generate an invite link, and start collecting RSVPs from guests.",
    createFirstEvent: "Create your first event",
    metadataDescription: "View your events and track RSVP responses.",
  },
  event: {
    createTitle: "Create event",
    editTitle: "Edit event",
    creating: "Creating...",
    saving: "Saving...",
    deleting: "Deleting...",
    generating: "Generating...",
    deleteTitle: "Delete this event?",
    deleteDescription:
      '“{title}” will be permanently deleted along with its invite link and all RSVP responses. This action cannot be undone.',
    inviteDescription:
      "Share this link with guests so they can RSVP without creating an account.",
    noInviteTitle: "No invite link yet",
    noInviteDescription:
      "Generate a link and share it with guests so they can RSVP without an account.",
    noRsvpsTitle: "No RSVPs yet",
    noRsvpsWithLink:
      "Share your invite link with guests. Their responses will appear here as they RSVP.",
    noRsvpsWithoutLink:
      "Generate an invite link first, then share it with guests to start collecting responses.",
    form: {
      title: "Title",
      titlePlaceholder: "Team dinner",
      description: "Description",
      descriptionPlaceholder: "Optional details about the event",
      location: "Location",
      locationPlaceholder: "Optional location",
      dateTime: "Date and time",
      capacity: "Capacity (optional)",
    },
    metadata: {
      createDescription: "Add a new event with title, date, location, and details.",
      editDescription: "Update your event title, date, location, and details.",
      detailsDescription: "View event details, invite links, and attendee responses.",
      detailsFor: "Manage invite links and RSVPs for {title}.",
    },
  },
  rsvp: {
    badge: "RSVP",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    attendance: "Attendance",
    submit: "Submit RSVP",
    update: "Update RSVP",
    submitting: "Submitting...",
    recorded: "Your RSVP has been recorded.",
    prefilled:
      "We found your previous RSVP for this event. Update your response below if anything changed.",
    atCapacity:
      "This event is at capacity for Going responses. You can still RSVP as Maybe or Not going.",
    goingFull: "Going (full)",
    status: {
      going: "Going",
      maybe: "Maybe",
      notGoing: "Not going",
    },
    metadataDescription: "Submit your RSVP for this event.",
    metadataFor: "Respond to {title} on EventHub.",
  },
  badges: {
    going: "Going: {count}",
    maybe: "Maybe: {count}",
    notGoing: "Not going: {count}",
    capacity: "Capacity: {going} / {capacity} going",
  },
  table: {
    name: "Name",
    email: "Email",
    status: "Status",
    updated: "Updated",
    respondedAt: "Responded at",
  },
  toast: {
    inviteCopied: "Invite link copied to clipboard",
    inviteCopyFailed: "Could not copy link. Please copy it manually.",
    inviteGenerated: "Invite link generated successfully",
  },
  actions: {
    signInRequired: "You must be signed in to create an event.",
    capacityTooLow:
      "Capacity cannot be less than the current number of going RSVPs ({count}).",
    inviteInvalid: "Invite link is invalid.",
    atCapacity: "This event is at capacity. Please choose Maybe or Not going.",
  },
  auth: {
    description: "Sign in or create an EventHub account to manage your events.",
    callback: "Auth callback",
    emailOtp: "Email verification",
    forgotPassword: "Forgot password",
    magicLink: "Magic link",
    recoverAccount: "Recover account",
    resetPassword: "Reset password",
    signIn: "Sign in",
    signOut: "Sign out",
    signUp: "Create account",
    twoFactor: "Two-factor authentication",
    acceptInvitation: "Accept invitation",
  },
  account: {
    description: "Manage your EventHub account settings.",
    settings: "Account settings",
    security: "Security",
    teams: "Teams",
    apiKeys: "API keys",
    organizations: "Organizations",
  },
  error: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred. Please try again, or return to the dashboard if the problem continues.",
    tryAgain: "Try again",
    goDashboard: "Go to dashboard",
  },
  theme: {
    light: "Light mode",
    dark: "Dark mode",
    toggle: "Toggle theme",
  },
  language: {
    en: "English",
    fa: "فارسی",
    switch: "Switch language",
  },
} as const;

export type Dictionary = DeepStringDictionary<typeof en>;

type DeepStringDictionary<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? DeepStringDictionary<T[K]>
      : never;
};

"use client";

import { getAvatar } from "@/lib/avatars";

export default function AvatarTheme({ avatarId }: { avatarId: string | null | undefined }) {
  const avatar = getAvatar(avatarId);
  return (
    <style
      // Overrides just the CSS custom properties driving primary/accent
      // colors across the app — a subtle re-skin, not a redesign.
      dangerouslySetInnerHTML={{
        __html: `:root {
          --color-primary-500: ${avatar.primary};
          --color-primary-600: ${avatar.primaryDark};
          --color-primary-700: ${avatar.primaryDark};
          --color-accent-300: ${avatar.accent};
        }`,
      }}
    />
  );
}

export type AnimationVariant = "gif";
export type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

interface Animation {
  name: string;
  css: string;
}

export const createAnimation = (
  variant: AnimationVariant,
  start: AnimationStart,
  url?: string
): Animation => {
  return {
    name: `${variant}-${start}`,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-in);
      }

      ::view-transition-new(root) {
        mask: url('${url}') center / 0 no-repeat;
        animation: scale 1s;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 1s;
      }

      @keyframes scale {
        0% {
          mask-size: 0;
        }
        10% {
          mask-size: 50vmax;
        }
        90% {
          mask-size: 50vmax;
        }
        100% {
          mask-size: 2000vmax;
        }
      }
    `,
  };
};

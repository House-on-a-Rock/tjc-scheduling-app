// indicate there's more to scroll with a subtle shadow https://codepen.io/hchiam/pen/bGEJweq

export const verticalScrollIndicatorShadow = (backgroundColor: string = 'white') => {
  return {
    background: `linear-gradient(
      ${backgroundColor},
      ${backgroundColor}
      )
      0 0,
    linear-gradient(${backgroundColor}, ${backgroundColor}) 0 100%,
      radial-gradient(farthest-side at 50% 0%, rgba(0, 0, 0, 0.1), transparent) 50% 0%,
    radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.1), transparent) 50% 100%`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: backgroundColor,
    backgroundSize: '100% 14px',
    backgroundAttachment: 'local, local, scroll, scroll',
  };
};

export const horizontalScrollIndicatorShadow = (backgroundColor: string = 'white') => {
  return {
    background: `linear-gradient(
      ${backgroundColor},
      ${backgroundColor}
      )
      0 0,
    linear-gradient(${backgroundColor}, ${backgroundColor}) 0 100%,
      radial-gradient(farthest-side at 0% 50%, rgba(0, 0, 0, 0.1), transparent) 0% 50%,
    radial-gradient(farthest-side at 100% 50%, rgba(0, 0, 0, 0.1), transparent) 100% 50%`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: backgroundColor,
    backgroundSize: '14px 100%',
    backgroundAttachment: 'local, local, scroll, scroll',
  };
};

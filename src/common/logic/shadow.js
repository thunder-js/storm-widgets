export const getShadowProps = (elevation) => {
  if (elevation) {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.16,
      shadowRadius: 5,
    };
  }
  return null;
};

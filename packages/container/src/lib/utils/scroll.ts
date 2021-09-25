export const scrollToBottomOfWrapper = (wrapper: HTMLDivElement | null) => {
  if (wrapper) {
    const wrapperHeight = wrapper.scrollHeight;
    wrapper.scrollBy(0, wrapperHeight);
  }
};
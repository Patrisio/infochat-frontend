export const scrollToBottomOfWrapper = (wrapper: HTMLDivElement | null) => {
  console.log(wrapper, '__WRAPPER__');
  if (wrapper) {
    const wrapperHeight = wrapper.scrollHeight;
    wrapper.scrollBy(0, wrapperHeight);
  }
};
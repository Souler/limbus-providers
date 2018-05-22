export default function delay<T>(time: number, arg?: T) {
  return new Promise((resolve) => {
    setTimeout(resolve, time, arg);
  });
}

export default function warnOnlyOnce(message: string) {
  let run = false;
  return () => {
    if (!run) {
      console.warn(message);
    }
    run = true;
  };
}

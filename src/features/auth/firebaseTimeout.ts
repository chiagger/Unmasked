const defaultTimeoutMs = 12_000;

export function withFirebaseTimeout<T>(
  operation: Promise<T>,
  message = 'Cloud Firestore did not respond. Enable Firestore, then try again.',
  timeoutMs = defaultTimeoutMs,
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return new Promise<T>((resolve, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
    operation.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

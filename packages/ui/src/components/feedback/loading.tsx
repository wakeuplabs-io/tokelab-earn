/**
 * Loading Component
 */

export function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <span className="loading loading-spinner loading-lg"></span>
      {message && <p className="mt-4 text-sm text-base-content/70">{message}</p>}
    </div>
  );
}


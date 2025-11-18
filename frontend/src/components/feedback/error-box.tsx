// src/components/feedback/error-box.tsx
export function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
      {message}
    </p>
  );
}

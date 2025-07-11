interface BookErrorProps {
  error: string;
  bookTitle: string;
}

/**
 * BookError component for displaying error state
 *
 * Shows a user-friendly error message with technical details
 * and a link to return to the home page
 */
export default function BookError({ error, bookTitle }: BookErrorProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-grad bg-[length:400%_400%] animate-gradient-slow p-4">
      <div className="text-center max-w-lg bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 shadow-2xl">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-3xl font-bold text-white mb-4">Oops! Book Not Found</h2>
        <p className="text-white/90 mb-6 text-lg leading-relaxed">
          We&apos;re having trouble loading the {bookTitle} book. The story file might be missing or
          temporarily unavailable.
        </p>
        <details className="mb-6 text-left">
          <summary className="text-white/70 cursor-pointer hover:text-white transition-colors">
            Technical Details
          </summary>
          <p className="text-white/60 mt-2 font-mono text-sm bg-black/20 p-3 rounded">{error}</p>
        </details>
        <a
          href="/"
          className="inline-block bg-purple/90 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple/80 transition-all hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          🏠 Back to Home
        </a>
      </div>
    </div>
  );
}

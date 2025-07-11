/**
 * BookLoader component for displaying loading state
 *
 * Shows a rainbow spinner on animated gradient background
 */
export default function BookLoader(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background-grad bg-[length:400%_400%] animate-gradient-slow">
      <div className="w-16 h-16 rounded-full bg-conic-gradient animate-loader" aria-label="Loading">
        <div className="absolute top-1 left-1 right-1 bottom-1 bg-background rounded-full"></div>
      </div>
    </div>
  );
}

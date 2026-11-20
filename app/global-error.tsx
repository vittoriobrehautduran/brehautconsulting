'use client'

// Last-resort error page, used only if the locale layout itself crashes.
// It replaces the whole document, so it renders its own <html>.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#000', color: '#fff' }}>
        <main
          style={{
            minHeight: '100svh',
            display: 'grid',
            placeContent: 'center',
            gap: '1rem',
            textAlign: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Something went wrong</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Please try again, or email contact@brehautconsulting.com.
          </p>
          <p style={{ margin: 0 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '0.7rem 1.4rem',
                borderRadius: 999,
                border: 0,
                background: '#fff',
                color: '#061018',
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </p>
        </main>
      </body>
    </html>
  )
}

// Inject JSON-LD structured data into the page.

interface JsonLdProps {
  data: object | object[]
}

// Escape "<" so text from translations can never close the script tag.
function serialize(schema: object) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

export default function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data]

  return (
    <>
      {items.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(schema) }}
        />
      ))}
    </>
  )
}

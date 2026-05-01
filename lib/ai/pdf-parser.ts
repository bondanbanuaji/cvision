export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import prevents pdf-parse from reading its test fixture at module load time
    // (a known bug where it tries to open test/data/05-versions-space.pdf on import)
    // @ts-ignore
    const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js")
    const data = await pdfParse(buffer)
    const text = data.text

    // Check if the extracted text is too short, which might indicate a scanned PDF
    if (text.trim().length < 100) {
      throw new Error("Extracted text is too short. Please ensure the PDF is not a scanned image.")
    }

    return text
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to parse PDF file. Please ensure it's a valid PDF document.")
  }
}

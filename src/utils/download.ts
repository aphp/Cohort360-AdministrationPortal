export const extractFilename = (contentDisposition: string): string => {
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = filenameRegex.exec(contentDisposition)
  let default_filename = 'export_logs.json'
  if (matches != null && matches[1]) {
    default_filename = matches[1].replace(/['"]/g, '')
  }
  return default_filename
}

// Language of each lab code folder: a label for the code panel, and a key for formatting
const LANGUAGES = {
  matlabcodes: { key: 'matlab', label: 'MATLAB' },
  cprog: { key: 'c', label: 'C' },
  cppcodes: { key: 'cpp', label: 'C++' },
  javacodes: { key: 'java', label: 'Java' },
  pythoncodes: { key: 'python', label: 'Python' },
  webcodes: { key: 'html', label: 'HTML' },
}

// ACN programs are a mix of Java and Python
export function languageFor(folder, html = '') {
  if (LANGUAGES[folder]) return LANGUAGES[folder]
  if (/import java|public static void|System\.out/.test(html)) return { key: 'java', label: 'Java' }
  if (/import socket|def |print\(/.test(html)) return { key: 'python', label: 'Python' }
  return { key: 'text', label: 'Code' }
}

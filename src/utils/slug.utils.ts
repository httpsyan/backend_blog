/**
 * Gera um slug a partir de um texto, removendo caracteres especiais e substituindo espaços por hífens
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize("NFD") // Normaliza para decomposição de caracteres
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/[^\w-]+/g, "") // Remove caracteres não alfanuméricos
    .replace(/--+/g, "-") // Substitui múltiplos hífens por um único
    .replace(/^-+/, "") // Remove hífens no início
    .replace(/-+$/, ""); // Remove hífens no final
}

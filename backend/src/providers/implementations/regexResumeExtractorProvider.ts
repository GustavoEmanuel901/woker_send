import { IResumeExtractorProvider } from '@providers/IResumeExtractorProvider'
import { IUserInfoExtractDTO } from '@usecases/extractInfo/extractInfoDTO'

const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
const PHONE_REGEX = /(?:\(?\d{2}\)?[\s.-]?)(?:9[\s.-]?)?\d{4}[\s.-]?\d{4}/
const NAME_LABEL_REGEX = /^\s*nome(?:\s+completo)?\s*[:\-–]\s*(.+)$/im
const JOB_LABEL_REGEX = /^\s*(?:cargo(?:\s+pretendido)?|vaga|posi[cç][aã]o|[aá]rea\s+de\s+atua[cç][aã]o|t[ií]tulo\s+profissional)\s*[:\-–]\s*(.+)$/im
const JOB_KEYWORDS_REGEX = /\b(desenvolvedor(?:a)?|engenheiro(?:a)?|analista|programador(?:a)?|arquiteto(?:a)?|gerente|coordenador(?:a)?|designer|administrador(?:a)?|assistente|consultor(?:a)?|tecnico|técnico|estagi[aá]rio(?:a)?|cientista de dados|product owner|scrum master|devops|qa)\b[^\n]{0,60}/i
const ABSTRACT_HEADER_REGEX = /^\s*(?:resumo(?:\s+profissional)?|perfil(?:\s+profissional)?|objetivo(?:\s+profissional)?|sobre\s+mim|apresenta[cç][aã]o|summary)\s*:?\s*$/im
const SECTION_HEADER_REGEX = /^\s*(?:experi[eê]ncias?(?:\s+profissionais?)?|forma[cç][aã]o(?:\s+acad[eê]mica)?|educa[cç][aã]o|habilidades|compet[eê]ncias|idiomas|cursos|certifica[cç][oõ]es|projetos|contato|skills|experience|education)\s*:?\s*$/i

const clean = (value?: string): string | undefined => {
  const trimmed = value?.replace(/\s+/g, ' ').trim()
  return trimmed || undefined
}

function extractName (lines: string[], text: string): string | undefined {
  const labeled = text.match(NAME_LABEL_REGEX)?.[1]
  if (labeled) return clean(labeled)

  const nameLike = /^\p{Lu}[\p{L}'.-]+(?:\s+(?:d[aeo]s?|e|\p{Lu}[\p{L}'.-]+)){1,5}$/u
  return clean(lines.slice(0, 8).find(line => line.length <= 60 && !/[@\d]/.test(line) && nameLike.test(line)))
}

function extractAbstract (text: string): string | undefined {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex(line => ABSTRACT_HEADER_REGEX.test(line))
  if (start === -1) return undefined

  const collected: string[] = []
  for (const line of lines.slice(start + 1)) {
    if (SECTION_HEADER_REGEX.test(line)) break
    if (!line.trim() && collected.length) break
    if (line.trim()) collected.push(line.trim())
  }

  const joined = clean(collected.join(' '))
  return joined && joined.length > 400 ? `${joined.slice(0, 397)}...` : joined
}

export class RegexResumeExtractorProvider implements IResumeExtractorProvider {
  async extract (resumeText: string): Promise<IUserInfoExtractDTO> {
    const lines = resumeText.split(/\r?\n/).map(line => line.trim()).filter(Boolean)

    const result: IUserInfoExtractDTO = {}

    const name = extractName(lines, resumeText)
    const email = clean(resumeText.match(EMAIL_REGEX)?.[0])
    const phone = clean(resumeText.match(PHONE_REGEX)?.[0])
    const jobtitle = clean(resumeText.match(JOB_LABEL_REGEX)?.[1]) ?? clean(resumeText.match(JOB_KEYWORDS_REGEX)?.[0])
    const abstract = extractAbstract(resumeText)

    if (name) result.name = name
    if (phone) result.phone = phone
    if (email) result.email = email
    if (jobtitle) result.jobtitle = jobtitle
    if (abstract) result.abstract = abstract

    return result
  }
}

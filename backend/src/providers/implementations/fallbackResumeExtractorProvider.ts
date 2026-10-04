import { IResumeExtractorProvider } from '@providers/IResumeExtractorProvider'
import { IUserInfoExtractDTO } from '@usecases/extractInfo/extractInfoDTO'

export class FallbackResumeExtractorProvider implements IResumeExtractorProvider {
  constructor (
    private primary: IResumeExtractorProvider,
    private fallback: IResumeExtractorProvider
  ) {}

  async extract (resumeText: string): Promise<IUserInfoExtractDTO> {
    let aiResult: IUserInfoExtractDTO = {}
    try {
      aiResult = await this.primary.extract(resumeText)
    } catch (error) {
      console.warn('AI extraction failed, falling back to regex:', error)
    }

    let regexResult: IUserInfoExtractDTO = {}
    try {
      regexResult = await this.fallback.extract(resumeText)
    } catch (error) {
      console.warn('Regex extraction failed:', error)
    }
    return { ...regexResult, ...aiResult }
  }
}

import { IUserInfoExtractDTO } from '@usecases/extractInfo/extractInfoDTO'

export interface IResumeExtractorProvider {
  extract(resumeText: string): Promise<IUserInfoExtractDTO>
}

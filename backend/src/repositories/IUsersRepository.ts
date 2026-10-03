import { User } from '@entities/User'

export interface IUsersRepository {
    findByEmail(email: string): Promise<User | null>
    save(user: Omit<User, 'id'>): Promise<void>
}
export interface IListAllUsersResponseDTO {
    name: string
    email: string
    phone?: string  
    jobtitle?: string
    abstract?: string
    file: {
        name: string
        size: number
        key: string
        url: string
    }
}
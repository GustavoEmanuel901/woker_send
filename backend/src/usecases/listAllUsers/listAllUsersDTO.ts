export interface IListAllUsersResponseDTO {
    name: string
    email: string
    phone?: string  
    jobtitle?: string
    abstract?: string
    file: {
        id: number
        name: string
        url: string
    }
}
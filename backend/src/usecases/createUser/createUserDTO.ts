export interface ICreateUserRequestDTO {
    name: string
    email: string
    phone?: string
    jobtitle?: string
    abstract?: string
    file?: {
        id: number
    }
}

export interface ICreateUserResponseDTO {
    id: number
    name: string
    email: string
    phone?: string
    jobtitle?: string
    abstract?: string
    file?: {
        id: number
        url: string;
        name: string;
    }
}
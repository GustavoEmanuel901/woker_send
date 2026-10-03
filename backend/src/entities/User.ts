import { File } from "./File"

export class User {
    public readonly id: number
    public name: string
    public email: string
    public phone?: string
    public jobtitle?: string
    public abstract?: string
    public file: File

    private constructor (id: number, name: string, email: string, file: File, phone?: string, jobtitle?: string, abstract?: string, ) {
        this.id = id
        this.name = name
        this.email = email
        this.phone = phone
        this.jobtitle = jobtitle
        this.abstract = abstract
        this.file = file
    }

    static create (props: { name: string; email: string; file: File; phone?: string; jobtitle?: string; abstract?: string }): Omit<User, "id"> {
        return { name: props.name, email: props.email, file: props.file, phone: props.phone, jobtitle: props.jobtitle, abstract: props.abstract } as Omit<User, "id">
    }

    static restore (props: { id: number; name: string; email: string; file: File; phone?: string; jobtitle?: string; abstract?: string }): User {
        return new User(props.id, props.name, props.email, props.file, props.phone, props.jobtitle, props.abstract)
    }

}
export class File {
    public readonly id: number
    public name: string
    public size: number
    public key: string
    public url: string        
    private constructor (id: number, name: string, size: number, key: string, url: string) {
        this.id = id
        this.name = name
        this.size = size
        this.key = key
        this.url = url
    }

    static create (props: { name: string; size: number; key: string; url: string }): Omit<File, "id"> {
        return { name: props.name, size: props.size, key: props.key, url: props.url } as Omit<File, "id">
    }

    static restore (props: { id: number; name: string; size: number; key: string; url: string }): File {
        return new File(props.id, props.name, props.size, props.key, props.url)
    }
}
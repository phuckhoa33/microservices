export class Permission {
    public title: string;

    public key: string;

    public children?: Permission[];

    public constructor(title: string, key: string) {
        this.title = title;
        this.key = key;
    }

    public addChild(title: string, key: string): this {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(new Permission(title, key));
        return this;
    }
}

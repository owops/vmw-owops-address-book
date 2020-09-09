interface PhoneInterface {
    office?: string,
    cell?: string,
}

export class PhoneModel implements PhoneInterface {
    cell?: string;
    office?: string;

    constructor(office: string, cell: string) {
        this.cell = cell;
        this.office = office;
    }
}

export interface AddressBookInterface {
    id: string,
    name: string,
    location?: string,
    office?: string,
    phone: PhoneInterface,
    checked: boolean,
    editing: boolean,
}


export class AddressBookModel implements AddressBookInterface {
    // id为空字符串则为编辑状态
    id: string;
    location?: string;
    name: string;
    office?: string;
    phone: PhoneInterface;
    checked: boolean = false;
    editing: boolean = false;

    constructor(id: string, name: string, phone: PhoneInterface, office?: string, location?: string) {
        this.id = id;
        this.location = location;
        this.name = name;
        this.office = office;
        this.phone = phone;
    }
}
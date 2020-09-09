import {AddressBookInterface, AddressBookModel, PhoneModel} from "./Models/AddressBookModel";

const getAddressBooks = (): Promise<Array<AddressBookInterface>> => {
    // Mock
    return new Promise((resolve, reject) => {
        const arr = new Array<AddressBookInterface>();
        arr.push(new AddressBookModel('00000001', 'Rango', new PhoneModel('', '18816653791')))
        arr.push(new AddressBookModel('00000002', 'Rango1', new PhoneModel('a', '18816653793')))
        arr.push(new AddressBookModel('00000003', 'Rango5', new PhoneModel('b', '18816653792'), 'SH BusinessSH BusinessSH BusinessSH Business', 'Shanghai'))
        arr.push(new AddressBookModel('00000004', 'Rango3', new PhoneModel('aaa', '18816653795'), 'SH Business'))
        arr.push(new AddressBookModel('00000005', 'Rango4', new PhoneModel('sssss', '18816653794'), undefined, 'Shanghai'))
        arr.push(new AddressBookModel('00000006', 'Rango10', new PhoneModel('', '18816653797')))
        arr.push(new AddressBookModel('00000007', 'Rango6', new PhoneModel('', '18816653791')))

        resolve(arr);
    });
}

const updateAddressBooks = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

const deleteAddressBooks = (addressBookList: Array<AddressBookInterface>): Promise<any> => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

export default {
    getAddressBooks,
    updateAddressBooks,
    deleteAddressBooks,
}
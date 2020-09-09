import React, {useEffect} from 'react';
import './App.css';
import TableView from "./components/TableView";
import {api} from "./api";
import {AddressBookInterface, AddressBookModel, PhoneModel} from "./api/Models/AddressBookModel";
import {translate} from "./i18n";

let editing: Array<any> = [];

function App() {
    const [data, setData] = React.useState<Array<AddressBookInterface>>([]);

    useEffect(() => {
        editing = [];
        api.AddressBookApi.getAddressBooks().then(resp => {
            setData(resp);
        })
        return () => {
            editing = [];
        }
    }, []);

    const onDelete = () => {
        const tmp = data.filter(oo => {
            return editing.findIndex(o => o.id && o.id === oo.id) < 0;
        })
        setData([...tmp]);
    }

    const onAdd = () => {
        setData([...data, new AddressBookModel('', '', new PhoneModel('', ''))])
    }

    const requiredCheckHasError = () => {
        for (let i = 0; i < editing.length; i++) {
            if (editing[i].name === '') {
                return `${translate('invalid_message')}\nline:${i} 姓名缺失\ninfo: ${JSON.stringify(editing[i])}`
            }
            const cell = editing[i].phone.cell;
            if (cell.length > 11 || cell[0] !== '1') {
                return `${translate('invalid_message')}\nline:${i} 手机号码错误\ninfo: ${JSON.stringify(editing[i])}`
            }
            // 增加其他预检
        }
        return false;
    }

    const onUpdate = () => {
        const res = requiredCheckHasError()
        if (!res) {
            alert(JSON.stringify(editing.map(o => o.id || o.name)));
            data.forEach((o, index) => {
                o.editing = false;
                o.checked = false;
                if (!o.id) {
                    o.id = ('000000000' + index).slice(-10);
                }
            })
            setData([...data]);
        } else {
            alert(res)
        }
    }

    return (
        <div className="App">
            {
                <TableView
                    header={[
                        {
                            label: '',
                            title: '',
                            key: '',
                            type: 'checkbox',
                            width: 40,
                        },
                        {
                            label: 'ID',
                            title: '',
                            key: 'id',
                            auto: true,
                            width: 120,
                            sortable: true,
                        },
                        {
                            label: 'Name',
                            title: '',
                            key: 'name',
                            width: 150,
                            sortable: true,
                        },
                        {
                            label: 'Location',
                            title: '',
                            key: 'location',
                            width: 150,
                        },
                        {
                            label: 'Office',
                            title: '',
                            key: 'office',
                            width: 150,
                        },
                        {
                            label: 'Phone',
                            title: '',
                            key: 'phone',
                            children: [
                                {
                                    label: 'Office',
                                    title: '',
                                    key: 'office',
                                },
                                {
                                    label: 'Cell',
                                    title: '',
                                    key: 'cell',
                                    sortable: true,
                                }
                            ],
                        },
                    ]}
                    value={data}
                    revoke={(value: Array<AddressBookInterface>) => {
                        console.log(value);
                        editing = value;
                    }}
                />
            }
            <div className={'flex-row func-panel row-align-center'}>
                <div>
                    <button onClick={() => {
                        onDelete();
                    }}>{
                        translate('delete_button')
                    }</button>
                </div>
                <div className={'flex-row'}>
                    <div>
                        <button onClick={() => {
                            onUpdate();
                        }}>{
                            translate('update_button')
                        }</button>
                    </div>
                    <div style={{
                        marginLeft: 30,
                    }}>
                        <button onClick={() => {
                            onAdd();
                        }}>{
                            translate('add_button')
                        }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

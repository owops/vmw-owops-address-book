import React, {useEffect, useState} from "react";
import './index.css';
import {AddressBookInterface} from "../../api/Models/AddressBookModel";

interface TableViewProps {
    revoke: Function,
    header: Array<any>,
    value?: Array<AddressBookInterface>,
    defaultValue?: Array<AddressBookInterface>,
}

const getFixedWidth = (width?: string | number) => {
    return {
        width: width || "auto",
        minWidth: width || "auto",
        maxWidth: width || "auto",
        flexGrow: width ? 0 : 1,
        flexShrink: width ? 0 : 1,
    }
}

let current = {
    index: -1,
    timestamp: Date.now(),
}

let sortedKey = '';
let sortType = 0;

function TableView(props: TableViewProps) {

    const [data, setData] = useState<Array<AddressBookInterface>>([]);

    const isNew = (obj: AddressBookInterface) => {
        return !obj.id;
    }

    const isChecked = (index: number) => {
        return data[index].checked;
    }

    const testDoubleClick = (index: number) => {
        const cur = Date.now();
        if (current.index != -1) {
            if (cur - current.timestamp > 300) {
                current.timestamp = cur;
            } else {
                data[index].editing = true;
                setData([...data]);
                current.index = -1;
            }
        } else {
            current.index = index;
            current.timestamp = cur;
        }
    }

    const onChange = (tmp?: Array<AddressBookInterface>) => {
        const dt = tmp || data;
        setTimeout(() => {
            const res: Array<AddressBookInterface> = [];
            dt.forEach((val, index) => {
                if (val.checked) {
                    res.push(val)
                }
            })
            props.revoke && props.revoke(res);
        }, 0);
    }

    useEffect(() => {
        const {value, defaultValue} = props;
        if (value) {
            setData(props.value || []);
        } else {
            if (defaultValue) {
                setData(props.value || []);
            }
        }
    }, []);

    useEffect(() => {
        props.value?.forEach((o, index) => {
            if (!o.id) {
                o.checked = true;
            }
        })
        setData([...props.value || []]);
        onChange(props.value);
    }, [props.value]);

    const getSorted = (key: string) => {
        if (sortedKey === key) {
            if (sortType === 1) {
                return '↑'
            }
            if (sortType === 0) {
                return '--'
            }
            if (sortType === -1) {
                return '↓'
            }
        }
        return '--'
    }

    const sort = (key: string) => {
        if(sortedKey === key) {
            sortType = -sortType
        } else {
            sortedKey = key;
            sortType = 1;
        }
        const sorted = data.sort((a, b) => {
            // 目前只支持两层
            const keyArr = key.split('||');
            if(keyArr.length === 1) {
                if ((a as any)[key] > (b as any)[key]) {
                    return sortType
                } else {
                    return -sortType
                }
            } else {
                if ((a as any)[keyArr[0]][keyArr[1]] > (b as any)[keyArr[0]][keyArr[1]]) {
                    return sortType
                } else {
                    return -sortType
                }
            }
        });
        console.log(sorted.map(o => o.id))
        setData([...sorted]);
    }

    const renderHeader = () => {
        return (
            <div className={'table-row table-header'}>
                {
                    props.header.map(o => {
                        if (o.type === 'checkbox') {
                            return (
                                <div
                                    className={'table-col'}
                                    style={getFixedWidth(o.width)}
                                ><input onClick={(e) => {
                                    const checked = (e.target as HTMLInputElement).checked;
                                    data.forEach((o: AddressBookInterface, index) => {
                                        if (o.id) {
                                            o.checked = checked;
                                        }
                                    })
                                    setData([...data]);
                                    onChange();
                                }} type="checkbox"/></div>
                            );
                        }
                        return (
                            <div
                                className={'table-col'}
                                style={getFixedWidth(o.width)}
                            >
                                <div onClick={() => {
                                    sort(o.key)
                                }} style={o.children && {
                                    height: 20,
                                    lineHeight: 1,
                                }}>{o.label}{o.sortable && <a>{getSorted(o.key)}</a>}</div>
                                {
                                    o.children &&
                                    <div className={'table-row'}>
                                        {
                                            o.children.map((obj: any) => {
                                                const sortKey = `${o.key}||${obj.key}`
                                                return (
                                                    <div
                                                        onClick={() => {
                                                            sort(sortKey)
                                                        }}
                                                        className={'table-col'}
                                                        style={{...getFixedWidth(o.width), height: 20, lineHeight: 1,}}
                                                    >{obj.label}{obj.sortable && <a>{getSorted(sortKey)}</a>}</div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const renderRow = (obj: AddressBookInterface, index: number) => {
        return (
            <div className={'table-row'}>
                {
                    props.header.map((o) => {
                        if (o.type === 'checkbox') {
                            return (
                                <div
                                    className={'table-col'}
                                    style={getFixedWidth(o.width)}
                                ><input
                                    key={index}
                                    onClick={(e) => {
                                        const checked = (e.target as HTMLInputElement).checked;
                                        data[index].checked = checked;
                                        setData([...data]);
                                        onChange();
                                    }}
                                    type="checkbox" disabled={isNew(obj)} checked={isChecked(index) || isNew(obj)}
                                /></div>
                            );
                        }
                        return (
                            <div
                                className={'table-col'}
                                style={getFixedWidth(o.width)}
                            >
                                {
                                    !o.children && <div
                                        className={'table-col'}
                                        style={getFixedWidth(o.width)}
                                    >{
                                        isNew(obj) ? (<div>{
                                            !o.auto && <input onChange={(val) => {
                                                (obj as any)[o.key] = val.target.value;
                                                onChange();
                                            }} style={{
                                                width: '100%',
                                            }}></input>
                                        }</div>) : ((obj as any)[o.key] || '-')
                                    }</div>
                                }
                                {
                                    o.children &&
                                    <div className={'table-row'}>
                                        {
                                            o.children.map((so: any) => {
                                                return (
                                                    <div
                                                        onClick={(e) => {
                                                            testDoubleClick(index)
                                                        }}
                                                        className={'table-col'}
                                                        style={getFixedWidth(o.width)}
                                                    >
                                                        {
                                                            isNew(obj) ? (<div><input
                                                                onChange={(val) => {
                                                                    ((obj as any)[o.key] as any)[so.key] = val.target.value;
                                                                    onChange();
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                }}></input>
                                                            </div>) : obj.editing && so.key === 'cell' ? <input
                                                                type='number'
                                                                defaultValue={obj.phone.cell}
                                                                onChange={(val) => {
                                                                    obj.checked = true;
                                                                    setData([...data]);
                                                                    let value = val.target.value;
                                                                    ((obj as any)[o.key] as any)[so.key] = value.toString();
                                                                    onChange();
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                }}></input> : (((obj as any)[o.key] as any)[so.key] || '-')
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div>
            <div className={'table-body'}>
                {renderHeader()}
                <div className={'table-body-content'}>
                    {
                        data.map(
                            (o: AddressBookInterface, index) => (
                                renderRow(o, index)
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default TableView;
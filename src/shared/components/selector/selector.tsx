import React, {useCallback} from "react";
import styles from './selector.module.css';

interface SelectorProps<T> {
    data: T[],
    selectedValue?: string;
    displayTextSelector: (item: T) => string;
    valueSelector: (item: T) => string;
    placeholderText?: string;
    onSelect?: (item: T) => void;
    name?: string;
    id?: string;
}

export function Selector<T> (props: SelectorProps<T>) {

    const {placeholderText, data, displayTextSelector, valueSelector, onSelect, selectedValue, name} = props;

    const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = e.currentTarget.selectedIndex;
        if (index === 0) {
            return;
        }
        const item = data[index];
        onSelect?.(item);
    }, [data, onSelect]);

    return (
        <select className={styles.selector} placeholder={placeholderText}
                onChange={onChangeHandler}
                value={selectedValue}
                name={name}
                >
            <option>Select a product</option>
            {data.map((x, i) => {
                const displayText = displayTextSelector(x);
                const value = valueSelector(x);
                return <option key={`option-${i}`} value={value}>{displayText}</option>
            })}
        </select>
    )
}
import { createSignal } from 'solid-js'

export interface DropdownOption {
    value: string
    label: string
    placeholder?: boolean
}

interface DropdownProps {
    ref?: any
    options: DropdownOption[]
    defaultValue?: string
    disabled?: boolean
    onChange?: (value: string) => void
}

export const Dropdown = (props: DropdownProps) => {
    const [selectedValue, setSelectedValue] = createSignal(
        props.defaultValue || ''
    )

    const handleChange = (event: Event) => {
        const target = event.target as HTMLSelectElement
        setSelectedValue(target.value)
        if (props.onChange) {
            props.onChange(target.value)
        }
    }

    return (
        <select
            ref={props.ref}
            class="dropdown"
            onChange={handleChange}
            value={selectedValue()}
            disabled={props.disabled}
        >
            {props.options.map(option => (
                <option
                    value={option.value}
                    {...(option.placeholder
                        ? { disabled: true, selected: true }
                        : {})}
                >
                    {option.label}
                </option>
            ))}
        </select>
    )
}

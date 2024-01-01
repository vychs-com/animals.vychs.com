import { ParentProps } from 'solid-js'

interface PlaceholderProps extends ParentProps {
    text?: string
}

export const Placeholder = ({ text }: PlaceholderProps) => (
    <div class="placeholder">{text || 'Placeholder'}</div>
)

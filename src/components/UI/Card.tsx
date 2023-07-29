import { ParentProps } from 'solid-js'
import { CardContent } from './CardContent'
import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'

const Card = ({ children }: ParentProps) => <div class="card">{children}</div>

export default Object.assign(Card, {
    Content: CardContent,
    Header: CardHeader,
    Footer: CardFooter,
})

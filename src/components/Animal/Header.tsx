import { Badge } from '@suid/material'
import logo from '../../assets/logo.svg'

export const AnimalCardHeader = () => (
    <>
        <h2 class="card-title">
            <Badge badgeContent="web" color="primary">
                Random Animals
            </Badge>
        </h2>
        <a class="logotype" href="https://t.me/softik">
            <img src={logo} width="52" alt="logotype" />
        </a>
    </>
)

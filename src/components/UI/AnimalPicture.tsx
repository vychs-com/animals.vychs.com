import { Accessor, ParentProps } from 'solid-js'

interface AnimalPictureProps extends ParentProps {
    animalPicture: Accessor<string | undefined>
    onClick: any
}

export const AnimalPicture = ({
    animalPicture,
    onClick,
    children,
}: AnimalPictureProps) => (
    <div
        class={
            animalPicture() ? 'animal-picture with-content' : 'animal-picture'
        }
        onClick={onClick}
        style={{
            'background-image': animalPicture()
                ? `url(${animalPicture()})`
                : undefined,
        }}
    >
        {children}
    </div>
)

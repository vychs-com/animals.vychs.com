import { Accessor, ParentProps } from 'solid-js'

interface AnimalPictureProps extends ParentProps {
    animalPicture: Accessor<string | undefined>
}

export const AnimalPicture = ({
    animalPicture,
    children,
}: AnimalPictureProps) => {
    const onClick = () => {
        if (animalPicture()) {
            window.open(animalPicture(), '_blank')
        }
    }

    return (
        <div
            class={
                animalPicture()
                    ? 'animal-picture with-content'
                    : 'animal-picture'
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
}

import { Accessor, ParentProps } from 'solid-js'

interface AnimalPictureProps extends ParentProps {
    animalPicture: Accessor<string | undefined>
}

export const AnimalPicture = ({
    animalPicture,
    children,
}: AnimalPictureProps) => (
    <div
        class="animal-picture"
        style={{
            'background-image': animalPicture()
                ? `url(${animalPicture()})`
                : undefined,
        }}
    >
        {children}
    </div>
)

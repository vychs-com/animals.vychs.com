import { Show, createSignal, type Component } from 'solid-js'
import { AnimalCardFooter } from '../components/Animal/Footer'
import { AnimalCardHeader } from '../components/Animal/Header'
import { AnimalPicture } from '../components/Animal/Picture'
import { AnimalPicturePlaceholder } from '../components/Animal/Placeholder'
import Card from '../components/UI/Card'
import { Loader } from '../components/UI/Loader'
import { generateRandomAnimal } from '../services/animals.service'
import { AnimalData } from '../types/animal/AnimalData'

export const MainPage: Component = () => {
    const [generatedAnimalPicture, setGeneratedAnimalPicture] = createSignal<
        string | undefined
    >()
    const [generatedAnimalData, setGeneratedAnimalData] = createSignal<
        AnimalData | undefined
    >()
    const [showPlaceholder, setShowPlaceholder] = createSignal(true)
    const [showLoader, setShowLoader] = createSignal(false)

    const resetAnimalPicture = () => {
        setGeneratedAnimalPicture()
        setGeneratedAnimalData()
        setShowPlaceholder(true)
    }

    const onGenerateAnimalClick = async ({
        animal,
        color,
        background,
    }: {
        animal?: string | undefined
        color?: string | undefined
        background?: string | undefined
    } = {}) => {
        try {
            setShowLoader(true)
            setShowPlaceholder(false)

            const res = await generateRandomAnimal({
                animal,
                color,
                background,
            })
            if (!res) {
                resetAnimalPicture()
                return
            }

            const { url, ...rest } = res.result

            setGeneratedAnimalPicture(import.meta.env.VITE_MEDIA_URL + url)
            setGeneratedAnimalData(rest)
        } catch (e) {
            console.error(e)
            resetAnimalPicture()
        } finally {
            setShowLoader(false)
        }
    }

    return (
        <div class="container">
            <Card>
                <Card.Content>
                    <Card.Header>
                        <AnimalCardHeader />
                    </Card.Header>

                    <AnimalPicture animalPicture={generatedAnimalPicture}>
                        <Show when={showPlaceholder()}>
                            <AnimalPicturePlaceholder />
                        </Show>
                        <Show when={showLoader()}>
                            <Loader />
                        </Show>
                    </AnimalPicture>

                    <Card.Footer>
                        <AnimalCardFooter
                            onGenerateAnimalClick={onGenerateAnimalClick}
                            generatedAnimalData={generatedAnimalData}
                            generatedAnimalPicture={generatedAnimalPicture}
                            showLoader={showLoader}
                        />
                    </Card.Footer>
                </Card.Content>
            </Card>
        </div>
    )
}

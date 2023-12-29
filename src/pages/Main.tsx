import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { Badge } from '@suid/material'
import Fa from 'solid-fa'
import { Show, createSignal, type Component } from 'solid-js'
import { toast } from 'solid-toast'
import logo from '../assets/logo.svg'
import { AnimalPictureLoader } from '../components/Loaders/AnimalPictureLoader'
import { AnimalPicturePlaceholder } from '../components/Placeholders/AnimalPicturePlaceholder'
import { AnimalPicture } from '../components/UI/AnimalPicture'
import Card from '../components/UI/Card'
import { downloadImage } from '../helpers/download-image'
import { generateRandomAnimal } from '../services/animals.service'
import { AnimalData } from '../types/animal/AnimalData'

const AnimalsPage: Component = () => {
    const [animalPicture, setAnimalPicture] = createSignal<string | undefined>()
    const [animalData, setAnimalData] = createSignal<AnimalData | undefined>()
    const [showPlaceholder, setShowPlaceholder] = createSignal(true)
    const [showLoader, setShowLoader] = createSignal(false)

    const resetAnimalPicture = () => {
        setAnimalPicture()
        setAnimalData()
        setShowPlaceholder(true)
        setShowLoader(false)
    }

    const onGenerateClick = async () => {
        try {
            setShowLoader(true)
            setShowPlaceholder(false)

            const res = await generateRandomAnimal()
            if (!res) {
                resetAnimalPicture()
                return
            }

            const { url, information } = res.result
            setShowLoader(false)
            setAnimalPicture(import.meta.env.VITE_MEDIA_URL + url)
            setAnimalData(information)
        } catch (e) {
            console.error(e)
        } finally {
            resetAnimalPicture()
        }
    }

    const onDownloadClick = () => {
        if (!animalPicture() || !animalData()) {
            toast.error('Nothing to download ¯\\_(ツ)_/¯')
            return
        }
        toast.success('Download started')
        downloadImage(animalPicture() as string)
    }

    const onAnimalNameClick = () => {
        if (!animalData()) {
            toast.error('Nothing to copy ¯\\_(ツ)_/¯')
            return
        }
        navigator.clipboard.writeText((animalData() as AnimalData).name)
        toast.success('Copied to clipboard')
    }

    const onTelegramButtonClick = () => {
        if (!animalData()) {
            toast.error('Failed to open Telegram link')
            return
        }

        window.open(
            'https://t.me/' +
                (animalData() as AnimalData).name
                    .toLowerCase()
                    .split(' ')
                    .join(''),
            '_blank'
        )
    }

    return (
        <div class="container">
            <Card>
                <Card.Content>
                    <Card.Header>
                        <h2 class="card-title">
                            <Badge badgeContent="web" color="primary">
                                Random Animals
                            </Badge>
                        </h2>
                        <a class="logotype" href="https://t.me/softik">
                            <img src={logo} width="52" alt="logotype" />
                        </a>
                    </Card.Header>
                    <AnimalPicture animalPicture={animalPicture}>
                        <Show when={showPlaceholder()}>
                            <AnimalPicturePlaceholder />
                        </Show>
                        <Show when={showLoader()}>
                            <AnimalPictureLoader />
                        </Show>
                    </AnimalPicture>
                    <Card.Footer>
                        <button
                            class="generate-button"
                            onClick={onGenerateClick}
                            disabled={showLoader()}
                        >
                            Generate
                        </button>
                        <input
                            class="animal-name-input"
                            type="text"
                            value={animalData()?.name ?? '...'}
                            onClick={onAnimalNameClick}
                            readOnly
                        />
                        <button
                            class={
                                'telegram-button ' +
                                (showLoader() || !animalPicture()
                                    ? 'grey'
                                    : animalData()?.is_username_available
                                    ? 'available'
                                    : 'unavailable')
                            }
                            onClick={onTelegramButtonClick}
                            disabled={
                                showLoader() ||
                                !animalPicture() ||
                                !animalData()?.is_username_available
                            }
                        >
                            <Fa icon={faTelegram} />
                        </button>
                        <button
                            class="download-button"
                            onClick={onDownloadClick}
                            disabled={showLoader() || !animalPicture()}
                        >
                            Download
                        </button>
                    </Card.Footer>
                </Card.Content>
            </Card>
        </div>
    )
}

export default AnimalsPage

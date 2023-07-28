import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { Badge, CircularProgress } from '@suid/material'
import Fa from 'solid-fa'
import { Show, createSignal, type Component } from 'solid-js'
import { toast } from 'solid-toast'
import logo from '../assets/logo.svg'
import { downloadImage } from '../helpers/download-image'
import { generateRandomAnimal } from '../services/animals.service'
import { AnimalData } from '../types/animal/AnimalData'

const AnimalsPage: Component = () => {
    const [animalPicture, setAnimalPicture] = createSignal()
    const [animalData, setAnimalData] = createSignal<AnimalData | undefined>()
    const [showPlaceholder, setShowPlaceholder] = createSignal(true)
    const [showLoader, setShowLoader] = createSignal(false)

    const onGenerateClick = async () => {
        setShowLoader(true)
        setShowPlaceholder(false)

        const res = await generateRandomAnimal()
        if (!res) {
            setAnimalPicture()
            setAnimalData()
            setShowPlaceholder(true)
            setShowLoader(false)
            return
        }

        const { image, meta } = res.result
        setShowLoader(false)
        setAnimalPicture(image)
        setAnimalData(meta)
    }

    const onDownloadClick = () => {
        if (!animalPicture() || !animalData()) {
            toast.error('Nothing to download ¯\\_(ツ)_/¯')
            return
        }
        toast.success('Download started')
        downloadImage(
            animalPicture() as string,
            (animalData() as AnimalData).name
                .toLowerCase()
                .split(' ')
                .join('_') + '.png'
        )
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
            <div class="card">
                <div class="card-content">
                    <div class="card-header">
                        <h2 class="card-title">
                            <Badge badgeContent="web" color="primary">
                                Random Animals
                            </Badge>
                        </h2>
                        <a class="logotype" href="https://t.me/softik">
                            <img src={logo} width="64" alt="logotype" />
                        </a>
                    </div>
                    <div
                        class="animal-picture"
                        style={{
                            'background-image': animalPicture()
                                ? `url('data:image/png;base64,${animalPicture()}')`
                                : undefined,
                        }}
                    >
                        <Show when={showPlaceholder()}>
                            <div class="placeholder">
                                Press the button to generate a picture
                            </div>
                        </Show>
                        <Show when={showLoader()}>
                            <div class="loader">
                                <CircularProgress color="inherit" />
                            </div>
                        </Show>
                    </div>
                    <div class="card-footer">
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
                    </div>
                </div>
            </div>
            <footer class="footer">
                &copy 2023{' • '}
                <a
                    href="https://t.me/randanimalbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bot-link"
                >
                    @randanimalbot
                </a>
            </footer>
        </div>
    )
}

export default AnimalsPage

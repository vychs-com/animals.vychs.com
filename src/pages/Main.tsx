import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { Badge, CircularProgress } from '@suid/material'
import Fa from 'solid-fa'
import { Show, createEffect, createSignal, type Component } from 'solid-js'
import { toast } from 'solid-toast'
import { generateRandomAnimal } from '../services/animals.service'
import { AnimalData } from '../types/animal/AnimalData'

const AnimalsPage: Component = () => {
    const [telegramButtonRef, setTelegramButtonRef] = createSignal()

    const [animalPicture, setAnimalPicture] = createSignal()
    const [animalData, setAnimalData] = createSignal<AnimalData | undefined>()
    const [showPlaceholder, setShowPlaceholder] = createSignal(true)
    const [showLoader, setShowLoader] = createSignal(false)

    createEffect(() => {
        if (!telegramButtonRef()) return

        const buttonElement = telegramButtonRef() as HTMLButtonElement

        if (showLoader()) {
            buttonElement.classList.add('grey')
        } else {
            buttonElement.classList.remove('grey')
        }

        const animalDataValue = animalData() as AnimalData
        if (!animalDataValue) return

        if (!animalDataValue.is_username_available) {
            buttonElement.classList.add('unavailable')
        } else {
            buttonElement.classList.remove('unavailable')
        }

        if (animalDataValue.is_username_available) {
            buttonElement.classList.add('available')
        } else {
            buttonElement.classList.remove('available')
        }
    })

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

        const a = document.createElement('a')
        a.href = 'data:image/png;base64,' + animalPicture()
        a.download =
            (animalData() as AnimalData).name
                .toLowerCase()
                .split(' ')
                .join('_') + '.png'
        a.click()
        a.remove()
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
                        <button
                            class="generate-button"
                            onClick={onGenerateClick}
                        >
                            Generate
                        </button>
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
                        <input
                            class="animal-name-input"
                            type="text"
                            value={animalData()?.name ?? '...'}
                            onClick={onAnimalNameClick}
                            readOnly
                        />
                        <button
                            class="telegram-button"
                            ref={setTelegramButtonRef}
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
        </div>
    )
}

export default AnimalsPage

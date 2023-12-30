import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@suid/material'
import Fa from 'solid-fa'
import { Show, createSignal, onMount, type Component } from 'solid-js'
import { toast } from 'solid-toast'
import logo from '../assets/logo.svg'
import { AnimalPictureLoader } from '../components/Loaders/AnimalPictureLoader'
import { AnimalPicturePlaceholder } from '../components/Placeholders/AnimalPicturePlaceholder'
import { AnimalPicture } from '../components/UI/AnimalPicture'
import Card from '../components/UI/Card'
import { Dropdown, DropdownOption } from '../components/UI/Dropdown'
import { downloadImage } from '../helpers/download-image'
import {
    generateRandomAnimal,
    getSpeciesList,
} from '../services/animals.service'
import { AnimalData } from '../types/animal/AnimalData'

const AnimalsPage: Component = () => {
    const [animalPicture, setAnimalPicture] = createSignal<string | undefined>()
    const [animalData, setAnimalData] = createSignal<AnimalData | undefined>()
    const [showPlaceholder, setShowPlaceholder] = createSignal(true)
    const [showLoader, setShowLoader] = createSignal(false)
    const [refBackgroundColorPicker, setRefBackgroundColorPicker] =
        createSignal<HTMLInputElement | undefined>()
    const [refAnimalColorPicker, setRefAnimalColorPicker] = createSignal<
        HTMLInputElement | undefined
    >()
    const [backgroundColor, setBackgroundColor] = createSignal<
        string | undefined
    >()
    const [animalColor, setAnimalColor] = createSignal<string | undefined>()
    const [isAccordionOpen, setIsAccordionOpen] = createSignal(false)
    const [species, setSpecies] = createSignal<DropdownOption[]>([])
    const [isSpeciesDropdownDisabled, setIsSpeciesDropdownDisabled] =
        createSignal<boolean>(false)
    const [animal, setAnimal] = createSignal<string | undefined>()

    onMount(async () => {
        const res = await getSpeciesList()
        if (!res) {
            setIsSpeciesDropdownDisabled(true)
            return
        } else {
            setSpecies(
                res.result.map((e: string) => ({
                    value: e,
                    label: e,
                }))
            )
        }
    })

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen())
    }

    const resetAnimalPicture = () => {
        setAnimalPicture()
        setAnimalData()
        setShowPlaceholder(true)
    }

    const onGenerateClick = async () => {
        try {
            setShowLoader(true)
            setShowPlaceholder(false)

            const res = await generateRandomAnimal({
                animal: animal(),
                color: animalColor(),
                background: backgroundColor(),
            })
            if (!res) {
                resetAnimalPicture()
                return
            }

            const { url, ...rest } = res.result

            setAnimalPicture(import.meta.env.VITE_MEDIA_URL + url)
            setAnimalData(rest)
        } catch (e) {
            console.error(e)
            resetAnimalPicture()
        } finally {
            setShowLoader(false)
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

    const onResetClick = () => {
        refBackgroundColorPicker()!.value = '#ffffff'
        refAnimalColorPicker()!.value = '#ffffff'
        setBackgroundColor()
        setAnimalColor()
    }

    const onBackgroundColorChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (!target) return
        setBackgroundColor(target.value)
    }

    const onAnimalColorChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (!target) return
        setAnimalColor(target.value)
    }

    const onDropdownChange = (option: string) => {
        if (option === 'none') {
            setAnimal()
        } else {
            setAnimal(option)
        }
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
                        <div class="top-row">
                            <button
                                class="generate-button"
                                onClick={onGenerateClick}
                                disabled={showLoader()}
                            >
                                Generate
                            </button>
                            <button
                                onClick={toggleAccordion}
                                class="accordion-toggle"
                            >
                                <Fa
                                    /* @ts-ignore */
                                    icon={faChevronDown}
                                    class={`icon ${
                                        isAccordionOpen() ? 'rotate' : ''
                                    }`}
                                />
                            </button>
                        </div>
                        <div
                            class={`accordion-content ${
                                isAccordionOpen() ? 'open' : ''
                            }`}
                        >
                            <div class="middle-row">
                                <span class="background-picker">
                                    <label class="color-picker-label">
                                        Background:
                                    </label>
                                    <input
                                        ref={setRefBackgroundColorPicker}
                                        class="color-picker background-color-input"
                                        type="color"
                                        value="#ffffff"
                                        onChange={onBackgroundColorChange}
                                    />
                                </span>
                                <span class="animal-picker">
                                    <label class="color-picker-label">
                                        Animal:
                                    </label>
                                    <input
                                        ref={setRefAnimalColorPicker}
                                        class="color-picker animal-color-input"
                                        type="color"
                                        value="#ffffff"
                                        onChange={onAnimalColorChange}
                                    />
                                </span>
                                <button
                                    class="reset-colors-button"
                                    onClick={onResetClick}
                                    disabled={
                                        !backgroundColor() && !animalColor()
                                    }
                                >
                                    Reset Colors
                                </button>
                                <Dropdown
                                    options={[
                                        {
                                            value: 'none',
                                            label: 'Select Animal',
                                        },
                                        ...species(),
                                    ]}
                                    defaultValue="none"
                                    onChange={onDropdownChange}
                                    disabled={isSpeciesDropdownDisabled()}
                                />
                            </div>
                        </div>
                        <div class="bottom-row">
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
                                        : animalData()?.username_available
                                        ? 'available'
                                        : 'unavailable')
                                }
                                onClick={onTelegramButtonClick}
                                disabled={
                                    showLoader() ||
                                    !animalPicture() ||
                                    !animalData()?.username_available
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
                    </Card.Footer>
                </Card.Content>
            </Card>
        </div>
    )
}

export default AnimalsPage

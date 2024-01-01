import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import {
    faArrowRotateBack,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons'
import { Badge } from '@suid/material'
import Fa from 'solid-fa'
import { ParentProps, createSignal, onMount } from 'solid-js'
import { toast } from 'solid-toast'
import { capitalize } from '../../helpers/capitalize'
import { downloadImage } from '../../helpers/download-image'
import { getAnimalsList } from '../../services/animals.service'
import { AnimalData } from '../../types/animal/AnimalData'
import { Dropdown, DropdownOption } from '../UI/Dropdown'

interface AnimalCardFooterProps extends ParentProps {
    onGenerateAnimalClick: any
    generatedAnimalData: any
    generatedAnimalPicture: any
    showLoader: any
}

export const AnimalCardFooter = ({
    onGenerateAnimalClick,
    generatedAnimalData,
    generatedAnimalPicture,
    showLoader,
}: AnimalCardFooterProps) => {
    const [refBackgroundColorPicker, setRefBackgroundColorPicker] =
        createSignal<HTMLInputElement | undefined>()
    const [refAnimalColorPicker, setRefAnimalColorPicker] = createSignal<
        HTMLInputElement | undefined
    >()
    const [refAnimalSelect, setRefAnimalSelect] = createSignal<
        HTMLSelectElement | undefined
    >()

    const [animalsList, setAnimalsList] = createSignal<DropdownOption[]>([])
    const [selectedAnimal, setSelectedAnimal] = createSignal<
        string | undefined
    >()
    const [backgroundColor, setBackgroundColor] = createSignal<
        string | undefined
    >()
    const [animalColor, setAnimalColor] = createSignal<string | undefined>()

    const [isCustomizationAccordionOpen, setIsCustomizationAccordionOpen] =
        createSignal(false)
    const [isAnimalSelectDisabled, setIsAnimalSelectDisabled] =
        createSignal<boolean>(false)
    const [customizationCount, setCustomizationCount] = createSignal<number>(0)

    onMount(async () => {
        const reply = await getAnimalsList()

        if (!reply || !reply.result) {
            setIsAnimalSelectDisabled(true)
            return
        }

        setAnimalsList(
            reply.result.map((animal: string) => ({
                value: animal,
                label: capitalize(animal),
            }))
        )
    })

    const incrementCustomizationCount = () => {
        setCustomizationCount(c => c + 1)
    }
    const decrementCustomizationCount = () => {
        if (customizationCount() === 0) return
        setCustomizationCount(c => c - 1)
    }

    const onCustomizationAccordionClick = () => {
        setIsCustomizationAccordionOpen(!isCustomizationAccordionOpen())
    }

    const onDownloadPictureClick = () => {
        if (!generatedAnimalPicture() || !generatedAnimalData()) {
            toast.error('Nothing to download ¯\\_(ツ)_/¯')
            return
        }

        toast.success('Download started')
        downloadImage(generatedAnimalPicture())
    }

    const onAnimalNameClick = () => {
        if (!generatedAnimalData()) {
            toast.error('Nothing to copy ¯\\_(ツ)_/¯')
            return
        }

        navigator.clipboard.writeText(
            (generatedAnimalData() as AnimalData).name
        )
        toast.success('Copied to clipboard')
    }

    const onTelegramButtonClick = () => {
        if (!generatedAnimalData()) {
            toast.error('Failed to open Telegram link')
            return
        }

        const telegramUsername = (generatedAnimalData() as AnimalData).name
            .toLowerCase()
            .split(' ')
            .join('')
        window.open('https://t.me/' + telegramUsername, '_blank')
    }

    const onResetColorsClick = () => {
        if (backgroundColor()) {
            refBackgroundColorPicker()!.value = '#ffffff'
            setBackgroundColor()
            decrementCustomizationCount()
        }
        if (animalColor()) {
            refAnimalColorPicker()!.value = '#ffffff'
            setAnimalColor()
            decrementCustomizationCount()
        }
    }

    const onResetSelectedAnimalClick = () => {
        refAnimalSelect()!.value = 'none'
        setSelectedAnimal()
        decrementCustomizationCount()
    }

    const onBackgroundColorChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (!target) return

        if (!backgroundColor()) incrementCustomizationCount()
        setBackgroundColor(target.value)
    }

    const onAnimalColorChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (!target) return

        if (!animalColor()) incrementCustomizationCount()
        setAnimalColor(target.value)
    }

    const onAnimalSelectChange = (option: string) => {
        if (option === 'none') {
            setSelectedAnimal()
            decrementCustomizationCount()
        } else {
            if (!selectedAnimal()) incrementCustomizationCount()
            setSelectedAnimal(option)
        }
    }

    return (
        <>
            <div class="top-row">
                <button
                    class="generate-button"
                    onClick={() =>
                        onGenerateAnimalClick({
                            animal: selectedAnimal(),
                            color: animalColor(),
                            background: backgroundColor(),
                        })
                    }
                    disabled={showLoader()}
                >
                    Generate
                </button>
                <button
                    onClick={onCustomizationAccordionClick}
                    class="accordion-toggle"
                >
                    <Badge
                        class="customization-counter"
                        color="primary"
                        invisible={!customizationCount()}
                        badgeContent={customizationCount()}
                    >
                        <Fa
                            /* @ts-ignore */
                            icon={faChevronDown}
                            class={`icon ${
                                isCustomizationAccordionOpen() ? 'rotate' : ''
                            }`}
                        />
                    </Badge>
                </button>
            </div>
            <div
                class={`accordion-content ${
                    isCustomizationAccordionOpen() ? 'open' : ''
                }`}
            >
                <div class="middle-row">
                    <span class="background-picker">
                        <label class="color-picker-label">Background:</label>
                        <input
                            ref={setRefBackgroundColorPicker}
                            class="color-picker background-color-input"
                            type="color"
                            value="#ffffff"
                            onChange={onBackgroundColorChange}
                        />
                    </span>
                    <span class="animal-picker">
                        <label class="color-picker-label">Animal:</label>
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
                        onClick={onResetColorsClick}
                        disabled={!backgroundColor() && !animalColor()}
                    >
                        <Fa
                            /* @ts-ignore */
                            icon={faArrowRotateBack}
                        />{' '}
                        Colors
                    </button>
                    <Dropdown
                        ref={setRefAnimalSelect}
                        options={[
                            {
                                value: 'none',
                                label: 'Select Animal',
                                placeholder: true,
                            },
                            ...animalsList(),
                        ]}
                        defaultValue="none"
                        onChange={onAnimalSelectChange}
                        disabled={isAnimalSelectDisabled()}
                    />
                    <button
                        class="reset-animal-button"
                        onClick={onResetSelectedAnimalClick}
                        disabled={!selectedAnimal()}
                    >
                        <Fa
                            /* @ts-ignore */
                            icon={faArrowRotateBack}
                        />{' '}
                        Animal
                    </button>
                </div>
            </div>
            <div class="bottom-row">
                <input
                    class="animal-name-input"
                    type="text"
                    value={generatedAnimalData()?.name ?? '...'}
                    onClick={onAnimalNameClick}
                    readOnly
                />
                <button
                    class={
                        'telegram-button ' +
                        (showLoader() || !generatedAnimalPicture()
                            ? 'grey'
                            : generatedAnimalData()?.username_available
                            ? 'available'
                            : 'unavailable')
                    }
                    onClick={onTelegramButtonClick}
                    disabled={
                        showLoader() ||
                        !generatedAnimalPicture() ||
                        !generatedAnimalData()?.username_available
                    }
                >
                    <Fa icon={faTelegram} />
                </button>
                <button
                    class="download-button"
                    onClick={onDownloadPictureClick}
                    disabled={showLoader() || !generatedAnimalPicture()}
                >
                    Download
                </button>
            </div>
        </>
    )
}
import type { Component } from 'solid-js'
import { Toaster } from 'solid-toast'
import AnimalsPage from './pages/Main'

const App: Component = () => {
    return (
        <>
            <Toaster position="bottom-right" />
            <AnimalsPage />
        </>
    )
}

export default App

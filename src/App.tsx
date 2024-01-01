import type { Component } from 'solid-js'
import { Toaster } from 'solid-toast'
import { MainPage } from './pages/Main'

const App: Component = () => {
    return (
        <>
            <Toaster position="bottom-right" />
            <MainPage />
        </>
    )
}

export default App

import Header from './components/Header'
import Hero from './components/Hero'
import Comparison from './components/Comparison'
import AddressDecoder from './components/AddressDecoder'
import QuoteBuilder from './components/QuoteBuilder'
import LifecycleStepper from './components/LifecycleStepper'
import OrderAnatomy from './components/OrderAnatomy'
import OrderTypes from './components/OrderTypes'
import Resources from './components/Resources'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Comparison />
        <AddressDecoder />
        <QuoteBuilder />
        <LifecycleStepper />
        <OrderAnatomy />
        <OrderTypes />
        <Resources />
      </main>
      <Footer />
    </div>
  )
}

export default App

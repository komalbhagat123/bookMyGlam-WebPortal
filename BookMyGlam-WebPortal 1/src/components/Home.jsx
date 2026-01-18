import Hero from "./Hero"
import Navbar from "./Navbar"
import Choose from "./Choose"
import Offers from "./Offers"
import Footer from "./Footer"



const Home = () => {
    return (
        <div>
            <Navbar/>
            <Hero/>
            <Choose/>
            <Offers/>
            <Footer/>
        </div>
    )
}
export default Home

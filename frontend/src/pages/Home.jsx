import Banner from '../components/Banner'
import Header from '../components/Header'
import TopDoctors from '../components/Doctors/TopDoctors'

const Home = () => {
  return (
    <div>
      <Header />
      <TopDoctors />
      <Banner/>
    </div>
  )
}

export default Home